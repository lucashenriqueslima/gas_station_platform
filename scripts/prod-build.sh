#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$PROJECT_ROOT/build"
PM2_CONFIG="$PROJECT_ROOT/ecosystem.config.cjs"
APP_NAME="meuapp"
SCHEDULER_NAME="locavibe-scheduler"
MIN_ZERO_DOWNTIME_INSTANCES=2

ensure_min_pm2_instances() {
  local app_name="$1"
  local min_instances="$2"

  if ! pm2 describe "$app_name" >/dev/null 2>&1; then
    return
  fi

  local current_instances
  current_instances="$(
    pm2 jlist | node -e "
      const fs = require('fs')
      const appName = process.argv[1]
      const processes = JSON.parse(fs.readFileSync(0, 'utf8'))
      const matches = processes.filter((process) => process.name === appName)
      process.stdout.write(String(matches.length))
    " "$app_name"
  )"

  if [ "$current_instances" -lt "$min_instances" ]; then
    echo "Scaling $app_name from $current_instances to $min_instances instances for zero-downtime reload..."
    pm2 scale "$app_name" "$min_instances"
  fi
}

reload_or_start_app() {
  local app_name="$1"

  if pm2 describe "$app_name" >/dev/null 2>&1; then
    pm2 reload "$app_name" --update-env
    return
  fi

  pm2 start "$PM2_CONFIG" --only "$app_name" --update-env
}

restart_or_start_process() {
  local app_name="$1"

  if pm2 describe "$app_name" >/dev/null 2>&1; then
    pm2 restart "$app_name" --update-env
    return
  fi

  pm2 start "$PM2_CONFIG" --only "$app_name" --update-env
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

# cd "$PROJECT_ROOT"
# ensure_min_pm2_instances "$APP_NAME" "$MIN_ZERO_DOWNTIME_INSTANCES"
# reload_or_start_app "$APP_NAME"
# restart_or_start_process "$SCHEDULER_NAME"
