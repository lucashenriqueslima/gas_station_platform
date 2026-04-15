#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
PM2_CONFIG="$PROJECT_ROOT/ecosystem.config.cjs"
APP_NAME="${PM2_APP_NAME:-gas_station_platform}"

reload_or_start_app() {
  local app_name="$1"

  if pm2 describe "$app_name" >/dev/null 2>&1; then
    pm2 reload "$app_name" --update-env
    return
  fi

  pm2 start "$PM2_CONFIG" --only "$app_name" --update-env
}

validate_build_artifacts() {
  local build_server="$BUILD_DIR/bin/server.js"
  local build_manifest="$BUILD_DIR/public/assets/.vite/manifest.json"

  if [ ! -f "$build_server" ]; then
    echo "Missing production server build at $build_server"
    exit 1
  fi

  if [ ! -f "$build_manifest" ]; then
    echo "Missing Vite manifest at $build_manifest"
    exit 1
  fi
}

cd "$PROJECT_ROOT"

npm install
npm run build

cd "$BUILD_DIR"

npm i --prod

cd "$PROJECT_ROOT"
cp "$PROJECT_ROOT/.env" "$BUILD_DIR/"
if [ -d "$PROJECT_ROOT/credentials" ]; then
  rm -rf "$BUILD_DIR/credentials"
  cp -R "$PROJECT_ROOT/credentials" "$BUILD_DIR/"
fi

cd "$PROJECT_ROOT"
validate_build_artifacts
reload_or_start_app "$APP_NAME"
