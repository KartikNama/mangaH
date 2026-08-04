#!/usr/bin/env bash
# Add 2GB swap on 1GB Oracle micro so `next build` doesn't OOM/hang
set -euo pipefail

if swapon --show 2>/dev/null | grep -q swapfile; then
  echo "Swap already active"
  swapon --show
  exit 0
fi

if [[ ! -f /swapfile ]]; then
  echo "Creating 2GB swapfile..."
  sudo fallocate -l 2G /swapfile 2>/dev/null || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
fi

sudo swapon /swapfile
grep -q '^/swapfile ' /etc/fstab 2>/dev/null || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo "Swap enabled:"
swapon --show
free -h
