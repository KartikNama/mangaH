#!/usr/bin/env bash
# First-time Oracle setup for saudult.xyz frontend
# Run as ubuntu on a fresh VM (or same VM as backend — see DEPLOY.md memory notes)
set -euo pipefail

APP_DIR="/var/www/mangaH"
REPO="${REPO:-https://github.com/KartikNama/mangaH.git}"

echo "==> System packages"
sudo apt update
sudo apt install -y nginx git curl ufw certbot python3-certbot-nginx

echo "==> Firewall"
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

if ! command -v node >/dev/null 2>&1; then
  echo "==> Node.js 20"
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "==> pm2"
  sudo npm i -g pm2
fi

echo "==> Swap (helps next build on 1GB RAM)"
bash scripts/ensure-swap.sh || true

echo "==> Clone app"
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
if [[ ! -d "$APP_DIR/.git" ]]; then
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"

if [[ ! -f .env.production ]]; then
  cp .env.production.example .env.production
  echo ""
  echo "!! Edit $APP_DIR/.env.production with Supabase + media URL, then run:"
  echo "   bash scripts/deploy-oracle.sh"
  exit 0
fi

echo "==> Nginx site"
sudo cp deploy/nginx/saudult.conf /etc/nginx/sites-available/saudult
sudo ln -sf /etc/nginx/sites-available/saudult /etc/nginx/sites-enabled/saudult
# keep media site if present; remove default only
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo "==> Deploy app"
bash scripts/deploy-oracle.sh

echo "==> HTTPS (after DNS A records point to this IP)"
echo "   sudo certbot --nginx -d saudult.xyz -d www.saudult.xyz"

echo "Done. Test: curl -sI http://127.0.0.1:3000"
