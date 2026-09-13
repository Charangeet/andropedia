# ClubPulse

Club Performance & Engagement Analytics Dashboard. See `roadmap.md` for the build plan and `API_CONTRACT.md` for the API spec.

## Stack

- Client: React (Vite) + React Router + Tailwind CSS + Recharts + axios — `/client`
- Server: Node/Express + Prisma — `/server`
- Database: PostgreSQL (via Docker Compose)

## Quickstart

```bash
# 1. Start Postgres
docker compose up -d

# 2. Server
cd server
npm install
npx prisma migrate dev
npm run dev          # http://localhost:4000

# 3. Client (separate terminal)
cd client
npm install
npm run dev           # http://localhost:5173, proxies /api to :4000
```

`server/.env.example` documents the required environment variables (copy to `.env`).

Seed the database with demo data (26 members across 6 months of activity):

```bash
cd server && npm run prisma:seed
```

## Deployment

**Backend + database → Render.** `render.yaml` is a blueprint covering both. In
Render: New → Blueprint → pick this repo. It provisions the Postgres instance,
wires `DATABASE_URL` automatically, and runs `prisma migrate deploy` on build.
Afterwards, seed the demo data once from the service's shell:
`npm run prisma:seed`.

**Frontend → Vercel.** Import the repo with **Root Directory** set to `client`.
Set `VITE_API_URL` to the Render service URL (e.g.
`https://clubpulse-api.onrender.com`, no trailing slash). `client/vercel.json`
adds the SPA rewrite so deep links like `/members/12` work on refresh.

Finally, set `CORS_ORIGIN` on the Render service to the Vercel URL and redeploy.

> Render's free tier sleeps after inactivity, so the first request after a quiet
> period takes ~50s. Wake the API before demoing.

