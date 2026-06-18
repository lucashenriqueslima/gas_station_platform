#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
PM2_CONFIG="$PROJECT_ROOT/ecosystem.config.cjs"
APP_NAME="${PM2_APP_NAME:-gas_station_platform}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-true}"
NATIVE_DEPENDENCIES=("@tensorflow/tfjs-node" "canvas" "sharp" "better-sqlite3")

ensure_pnpm() {
  if command -v pnpm >/dev/null 2>&1; then
    return
  fi

  if command -v corepack >/dev/null 2>&1; then
    corepack enable
  fi

  if ! command -v pnpm >/dev/null 2>&1; then
    echo "pnpm is required for production builds. Install pnpm or enable it with corepack."
    exit 1
  fi
}

rebuild_native_dependencies() {
  pnpm rebuild "${NATIVE_DEPENDENCIES[@]}"
}

sync_public_directory_to_build() {
  local source_public_dir="$PROJECT_ROOT/public"
  local build_public_dir="$BUILD_DIR/public"
  local build_assets_dir="$build_public_dir/assets"
  local temp_assets_dir="$BUILD_DIR/.generated-assets"

  if [ ! -d "$source_public_dir" ]; then
    echo "Missing public directory at $source_public_dir"
    exit 1
  fi

  if [ -d "$build_assets_dir" ]; then
    rm -rf "$temp_assets_dir"
    cp -R "$build_assets_dir" "$temp_assets_dir"
  fi

  rm -rf "$build_public_dir"
  cp -R "$source_public_dir" "$build_public_dir"

  if [ -d "$temp_assets_dir" ]; then
    rm -rf "$build_assets_dir"
    cp -R "$temp_assets_dir" "$build_assets_dir"
    rm -rf "$temp_assets_dir"
  fi
}

reload_or_start_app() {
  local app_name="$1"

  if pm2 describe "$app_name" >/dev/null 2>&1; then
    pm2 reload "$PM2_CONFIG" --only "$app_name" --update-env
    return
  fi

  pm2 start "$PM2_CONFIG" --only "$app_name" --update-env
}

validate_build_artifacts() {
  local build_server="$BUILD_DIR/bin/server.js"
  local build_manifest="$BUILD_DIR/public/assets/.vite/manifest.json"
  local models_dir="$BUILD_DIR/public/models"
  local model_files=(
    "ssd_mobilenetv1_model-weights_manifest.json"
    "ssd_mobilenetv1_model-shard1"
    "ssd_mobilenetv1_model-shard2"
    "face_landmark_68_model-weights_manifest.json"
    "face_landmark_68_model-shard1"
    "face_recognition_model-weights_manifest.json"
    "face_recognition_model-shard1"
    "face_recognition_model-shard2"
  )

  if [ ! -f "$build_server" ]; then
    echo "Missing production server build at $build_server"
    exit 1
  fi

  if [ ! -f "$build_manifest" ]; then
    echo "Missing Vite manifest at $build_manifest"
    exit 1
  fi

  for model_file in "${model_files[@]}"; do
    if [ ! -f "$models_dir/$model_file" ]; then
      echo "Missing face recognition model at $models_dir/$model_file"
      exit 1
    fi
  done
}

sync_public_assets() {
  local build_assets_dir="$BUILD_DIR/public/assets"
  local public_assets_dir="$PROJECT_ROOT/public/assets"

  if [ ! -d "$build_assets_dir" ]; then
    echo "Missing built assets directory at $build_assets_dir"
    exit 1
  fi

  rm -rf "$public_assets_dir"
  cp -R "$build_assets_dir" "$public_assets_dir"
}

cd "$PROJECT_ROOT"

ensure_pnpm

pnpm install --frozen-lockfile
rebuild_native_dependencies
pnpm run build
sync_public_directory_to_build

cd "$BUILD_DIR"

cp "$PROJECT_ROOT/pnpm-lock.yaml" "$BUILD_DIR/"
cp "$PROJECT_ROOT/pnpm-workspace.yaml" "$BUILD_DIR/"
pnpm install --prod --frozen-lockfile
rebuild_native_dependencies

cd "$PROJECT_ROOT"
cp "$PROJECT_ROOT/.env" "$BUILD_DIR/"
if [ -d "$PROJECT_ROOT/credentials" ]; then
  rm -rf "$BUILD_DIR/credentials"
  cp -R "$PROJECT_ROOT/credentials" "$BUILD_DIR/"
fi

cd "$PROJECT_ROOT"
validate_build_artifacts
sync_public_assets

if [ "$RUN_MIGRATIONS" = "true" ]; then
  cd "$BUILD_DIR"
  NODE_ENV=production node ace migration:run --force
  cd "$PROJECT_ROOT"
fi

mkdir -p "$PROJECT_ROOT/logs"
reload_or_start_app "$APP_NAME"
