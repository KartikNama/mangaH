# Frontend deploy (Cloudflare)

See also: `../manga-backend/DEPLOY.md` for the full Oracle + Cloudflare guide.

## One-time setup

```bash
npm install
npm install @opennextjs/cloudflare@latest wrangler@latest --save-dev
npx wrangler login
```

## Env (Cloudflare dashboard or GitHub secrets)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MEDIA_URL=https://media.saudult.xyz`

## Deploy

```bash
npm run deploy
```

## CI/CD options

1. **Cloudflare Git integration** (easiest): import this repo in Cloudflare → auto deploy on push  
2. **GitHub Actions**: `.github/workflows/deploy.yml` needs secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_MEDIA_URL`
