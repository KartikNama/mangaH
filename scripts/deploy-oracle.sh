#!/usr/bin/env bash
# Build + restart Next.js on Oracle
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.production ]]; then
  echo "Missing .env.production — copy from .env.production.example"
  exit 1
fi

echo "==> Pull + install"
git pull
# npm ci needs a perfectly synced lockfile; npm install is safer on the server
npm install --no-audit --no-fund

echo "==> Build (NEXT_PUBLIC_* baked in at build time)"
set -a
source .env.production
set +a
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

echo "Deployed. curl -sI http://127.0.0.1:3000 | head -5"
