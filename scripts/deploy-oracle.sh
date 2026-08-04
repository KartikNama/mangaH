#!/usr/bin/env bash
# Build + restart Next.js on Oracle (manual or GitHub Actions CI)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOCK_FILE="/var/lock/saudult-web-deploy.lock"

mkdir -p /var/lock
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "ERROR: Another deploy is already running. Wait for it to finish."
  exit 1
fi

if [[ ! -f .env.production ]]; then
  echo "Missing .env.production — copy from .env.production.example and edit"
  exit 1
fi

# Recommended on E2.1.Micro (1 GB RAM)
if [[ -f scripts/ensure-swap.sh ]]; then
  bash scripts/ensure-swap.sh || true
fi

echo "==> Sync with GitHub (discards local edits to tracked files; keeps .env.production)"
git fetch origin main
git reset --hard origin/main

echo "==> Install dependencies"
npm install --no-audit --no-fund

echo "==> Clear stale Next.js build lock"
rm -f .next/lock
pkill -f "next build" 2>/dev/null || true

echo "==> Build (NEXT_PUBLIC_* baked in — often 5–15 min on 1GB micro)"
set -a
# shellcheck disable=SC1091
source .env.production
set +a
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=768}"
export NEXT_TELEMETRY_DISABLED=1
npm run build

echo "==> Standalone bundle"
mkdir -p .next/standalone/.next
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/
cp -f .env.production .next/standalone/.env.production
cp -f .env.production .next/standalone/.env

echo "==> pm2"
if pm2 describe saudult-web >/dev/null 2>&1; then
  pm2 restart saudult-web
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

echo "==> Health check"
sleep 2
curl -sfI http://127.0.0.1:3000 | head -5 || {
  echo "WARN: app not responding yet — check: pm2 logs saudult-web"
  exit 1
}
echo "Deploy complete."
