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
