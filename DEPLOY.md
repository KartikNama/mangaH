# Frontend on Oracle Cloud (from scratch)

Host **saudult.xyz** on Oracle Always Free — **not** Cloudflare Workers.

## Architecture

```
saudult.xyz        → nginx → Next.js :3000   (this repo)
www.saudult.xyz    → nginx → Next.js :3000
media.saudult.xyz  → nginx → Express :3033   (manga-backend, images)
data               → Supabase
```

**Option A — same VM (1 GB micro):** scraper + site together (tight on RAM).  
**Option B — two free micros (recommended):** VM1 = backend/media, VM2 = frontend only.

---

## Step 0 — Remove Cloudflare Worker (one-time)

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → worker **saudult**
2. **Settings → Domains & Routes** → delete `saudult.xyz/*` and `www.saudult.xyz/*`
3. **DNS** for `saudult.xyz`:

| Type | Name | Content | Proxy |
|------|------|---------|--------|
| A | `@` | Oracle public IP | DNS only (grey) |
| A | `www` | Oracle public IP | DNS only |
| A | `media` | Oracle public IP | DNS only |

Wait a few minutes for DNS to update.

---

## Step 1 — Oracle VM

- Shape: **VM.Standard.E2.1.Micro** (Always Free)
- Ubuntu 24.04, public IP ON
- VCN ingress: TCP **22**, **80**, **443**
- On the VM, fix iptables if HTTP times out (Oracle default REJECT before UFW):

```bash
sudo iptables -I INPUT 5 -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -p tcp --dport 443 -j ACCEPT
sudo apt install -y iptables-persistent && sudo netfilter-persistent save
```

---

## Step 2 — First-time setup (SSH into VM)

```bash
ssh -i your-key.key ubuntu@YOUR_ORACLE_IP

git clone https://github.com/KartikNama/mangaH.git /var/www/mangaH
cd /var/www/mangaH
chmod +x scripts/*.sh

nano .env.production
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# NEXT_PUBLIC_MEDIA_URL=https://media.saudult.xyz

bash scripts/setup-oracle.sh
```

If `.env.production` was missing, the script stops after creating it — edit it, then:

```bash
bash scripts/deploy-oracle.sh
```

---

## Step 3 — HTTPS

```bash
sudo certbot --nginx -d saudult.xyz -d www.saudult.xyz
```

If backend is on the **same** VM, media cert may already exist:

```bash
sudo certbot --nginx -d media.saudult.xyz
```

---

## Step 4 — Verify

```bash
curl -sI http://127.0.0.1:3000
curl -sI https://saudult.xyz
pm2 status
pm2 logs saudult-web --lines 30
```

Open https://saudult.xyz — filters, tags, and **Load more** should work (normal Node, not Workers).

---

## CI/CD — auto deploy on git push

Every push to **`main`** SSHs into your **frontend** Oracle VM and runs `scripts/deploy-oracle.sh`.

### One-time: GitHub secrets

Repo: **KartikNama/mangaH** → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|--------|
| `ORACLE_FRONTEND_HOST` | Public IP of **saudult-frontend** VM (e.g. `155.x.x.x`) |
| `ORACLE_FRONTEND_SSH_KEY` | Full private key file contents (same `.key` you use for SSH) |

### One-time: server prep

On the frontend VM:

```bash
# allow GitHub Actions to pull without merge conflicts
cd /var/www/mangaH
git config pull.rebase false

# swap helps next build on 1GB RAM (run once)
bash scripts/ensure-swap.sh

# .env.production must exist on server (NOT in git)
nano .env.production
```

### How it works

1. You `git push` to `main`
2. GitHub Actions connects over SSH
3. Server runs: `git reset --hard origin/main` → `npm install` → `next build` → `pm2 restart`
4. View progress: GitHub → **Actions** tab

Manual deploy from Actions: **Run workflow** button.

Build on a 1GB micro usually takes **5–15 minutes** — that is normal, not a code bug.

---

## Updates (manual)

```bash
cd /var/www/mangaH && bash scripts/deploy-oracle.sh
```

---

## Env notes

- `NEXT_PUBLIC_*` values are **inlined at `npm run build`**. Change `.env.production` → run `deploy-oracle.sh` again.
- Production images come from `NEXT_PUBLIC_MEDIA_URL`, not local `/media`.

---

## Memory (1 GB VM running scraper + web)

```bash
pm2 status
# pause scraper while testing site if OOM:
pm2 stop game-scraper
```

Web pm2 limit: `max_memory_restart: 450M` in `ecosystem.config.cjs`.

---

## Local dev

```bash
npm install
npm run dev
# optional: MEDIA_PROXY_URL=http://127.0.0.1:3033 in .env.local
```
