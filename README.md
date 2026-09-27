# snip

minimal open-source url shortener that you host it yourself, with:

- short links + custom slugs
- qr codes (svg download)
- expiring links
- password-protected links
- click analytics with a little graph

full typescript. next.js + prisma + sqlite. no account, no tracking bs.

## run it

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

open http://localhost:3000

## how it works

- `POST /api/links` — make a link. body: `{ url, slug?, expiresAt?, password? }`
- `GET /:slug` — redirects, logs a click. shows password form if locked, "expired" if past expiry.
- `POST /api/click` — unlock a password link (also logs the click)
- `GET /api/links/:slug` — stats json for the graph
- `GET /stats/:slug` — qr + graph + recent clicks page

clicks store ip / user-agent / referer only, in your own db. nothing leaves the server.

## self-host

set `NEXT_PUBLIC_BASE_URL` to your domain, ex `https://s.yourdomain.com`, then `npm run build && npm start`.

want postgres instead of sqlite? change `provider` in `prisma/schema.prisma` and `DATABASE_URL`. rest just works.

## contributing

PRs welcome. keep it small and readable. run `npm run typecheck` before pushing.

MIT — do whatever you want with it.
