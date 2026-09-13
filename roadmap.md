# ClubPulse – Build Roadmap

Club Performance & Engagement Analytics Dashboard
Stack: React + Node/Express + PostgreSQL | Timeline: Hackathon (24–48 hrs)

## 1. Problem → Product Translation

| Problem | Product Feature |
|---|---|
| Data scattered (attendance, tasks, projects, workshops) | Unified DB schema + manual/CSV data entry forms |
| No visibility into engagement | Engagement score per member (computed metric) |
| Can't spot inactive members | "At Risk / Inactive" list, sorted by last activity |
| Can't recognize top contributors | Leaderboard ranked by contribution score |
| No decision support | Dashboard with charts (trends, comparisons, breakdowns) |

## 2. Tech Stack

- **Frontend:** React (Vite), React Router, Recharts or Chart.js for graphs, Tailwind CSS for fast styling
- **Backend:** Node.js + Express, REST API
- **Database:** PostgreSQL (relational — fits members/events/many-to-many well)
- **ORM:** Prisma (fastest to scaffold schema + migrations + queries for a hackathon)
- **Auth (optional/stretch):** Simple JWT login for "coordinator" role only — skip member-level auth
- **Deployment:** Frontend → Vercel/Netlify, Backend+DB → Render/Railway (free tier, 1-click Postgres)

## 3. Database Schema (core tables)

```
members
  id, name, email, role (member/coordinator), join_date

activities            -- generic log of anything a member did
  id, member_id (FK), type (attendance|task|project|workshop|contribution),
  title, points, date, notes

attendance
  id, member_id (FK), event_id (FK), status (present/absent), date

events
  id, name, type (meeting|workshop), date

tasks
  id, member_id (FK), project_id (FK), title, status (todo/in_progress/done), due_date, completed_date

projects
  id, name, description, start_date

contributions
  id, member_id (FK), description, impact_score, date
```

Keep it simple: `activities` can double as a unified log if time is short, with `tasks`/`attendance`/`contributions` as optional detail tables layered on top later. Start with `members`, `events`, `attendance`, `tasks` — that alone supports the core insights.

## 4. Engagement Score Logic (the analytics core)

Define a simple weighted formula so it's explainable in the demo:

```
engagement_score =
    (attendance_rate * 0.4) +
    (task_completion_rate * 0.3) +
    (workshop_participation_rate * 0.2) +
    (contribution_count_normalized * 0.1)
```

- Compute per member, per month, as a 0–100 score.
- Classify: `>=70 Active`, `40–69 At Risk`, `<40 Inactive`.
- This becomes the single number that drives the dashboard's headline visuals — judges love a clear derived metric, not just raw tables.

## 5. Hour-by-Hour Build Plan (assuming ~36 working hours across 2 days)

**Phase 0 — Setup (Hours 0–2)**
- Init repo, split into `/client` (React) and `/server` (Express)
- Set up Postgres (local or Railway/Neon free instance)
- Define Prisma schema for tables above, run first migration
- Agree on API contract (endpoints list) as a team before splitting work

**Phase 1 — Backend API (Hours 2–8)**
- CRUD endpoints: members, events, attendance, tasks, contributions
- Seed script with realistic fake data (20–30 members, several months of activity) — critical for a good demo
- Engagement score calculation endpoint (`GET /api/members/:id/score`, `GET /api/analytics/summary`)
- Endpoint for "inactive members" list, "top contributors" list

**Phase 2 — Frontend Shell (Hours 6–12, parallel with backend)**
- Page routing: Dashboard, Members, Member Detail, Data Entry
- Layout + nav, connect to API with fetch/axios + a loading/error state pattern
- Basic tables/lists rendering real data from API

**Phase 3 — Dashboard & Visualizations (Hours 12–22)**
- Overview cards: total members, avg engagement, active/at-risk/inactive counts
- Charts: engagement trend over time (line), attendance by event (bar), contribution leaderboard (bar/table), active vs inactive split (pie/donut)
- Member detail page: individual score breakdown + activity timeline
- Filters: by date range, by activity type

**Phase 4 — Data Entry / Admin (Hours 20–26)**
- Simple forms for coordinators to log attendance, mark task complete, add contribution
- (Stretch) CSV import for bulk historical data — very demo-impressive if time allows

**Phase 5 — Polish & Deploy (Hours 26–32)**
- Responsive check, empty states, loading skeletons
- Deploy backend (Render/Railway) + frontend (Vercel), point frontend at deployed API
- Smoke test full flow end-to-end on the deployed URL

**Phase 6 — Demo Prep (Hours 32–36)**
- Seed a compelling demo dataset (a couple of obviously "star" members, a couple obviously "inactive")
- Script a 2–3 minute walkthrough: problem → dashboard overview → drill into one active member, one inactive member → show the score formula → close on club impact
- Prepare 3–5 slides: problem statement, architecture diagram, schema, screenshots, "what's next"

## 6. MVP vs Stretch Goals

**MVP (must-have for demo):**
- Members, attendance, tasks tracked in DB
- Engagement score computed and shown per member
- Dashboard with at least 3 charts
- Inactive members list + top contributors list

**Stretch (only if ahead of schedule):**
- CSV bulk import
- Coordinator login/auth
- Exportable PDF/CSV reports
- Email/notification nudge for inactive members
- Predictive trend (e.g. "engagement dropping 3 weeks running")

## 7. Suggested Folder Structure

```
androhack/
  client/            # React app
    src/
      pages/
      components/
      api/           # fetch wrappers
  server/            # Express app
    src/
      routes/
      controllers/
      services/      # engagement score logic lives here
      prisma/
        schema.prisma
  roadmap.md
```

## 8. Key Risks & How to Avoid Them

- **Fake/no data = boring demo** → write the seed script early (Phase 1), not last.
- **Scope creep on auth/roles** → skip member login entirely unless MVP is done early.
- **Chart library rabbit holes** → pick one (Recharts recommended for React) and don't swap mid-hackathon.
- **Schema churn** → lock the schema after Phase 0; add columns later rather than restructuring relations.
