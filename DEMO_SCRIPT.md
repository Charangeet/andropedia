# ANDROPEDIA — 3 Minute Demo Script

**Before you start:** `docker compose up -d`, both dev servers running, browser at
`http://localhost:5173`, date filter on **All time**. If deployed on Render's free
tier, load the API once beforehand — it sleeps and takes ~50s to wake.

The dataset is deterministic, so the numbers below are exactly what you'll see.

---

## 0:00 — The problem (20s)

> "Our club tracks attendance in one spreadsheet, tasks in a WhatsApp thread, and
> projects nowhere. So we can't answer two questions that actually matter: who's
> carrying the club, and who are we about to lose?
>
> ANDROPEDIA turns that scattered activity into one number per member."

## 0:20 — Dashboard overview (30s)

Land on **Dashboard**.

> "26 members. Average engagement 46.6. Six active, nine at risk, eleven inactive."

Point at the charts in order:

- **Engagement trend** — "club-wide engagement, month over month"
- **Attendance by event** — "every meeting and workshop, present vs absent"
- **The status bar** — "the split at a glance"
- **Top contributors** — "who's actually shipping work"

## 0:50 — Drill into a star (25s)

**Members** → click **Priya Raghavan**.

> "Priya scores 100. The dashboard doesn't just say she's great, it shows why:
> 100% attendance, every task completed, six logged contributions. That's the
> recognition problem solved — this is who you put on stage at the end of year."

Scroll the timeline.

> "And here's every single thing she did, with dates."

## 1:15 — The punchline: catching a drop-off (45s)

Back to **Members** → click **Aditya Nair**.

> "Aditya scores 66.7 — 'At Risk'. Borderline. You'd probably scroll past him."

Go to **Dashboard** → click **Last 3 months**.

> "But watch what happens when I ask about *this quarter* instead of all time."

Back to Aditya's page.

> "Three months ago Aditya was a perfect 100 — one of our best. Right now he's a
> 38. Inactive.
>
> The all-time average was hiding him. This is the member you can still save, and
> we found him before he quit."

*(Optional, if time allows — the reverse story: Hannah Okafor climbs from 8 to 59
over the same window. "Whatever we changed is working on her.")*

## 2:00 — The formula (25s)

Back on a member page, point at the four metric tiles.

> "No black box. The score is a weighted formula we can defend:
> attendance 40%, task completion 30%, workshop participation 20%, contributions
> 10%. Anything 70 and up is Active, under 40 is Inactive. Change the weights and
> every number on the dashboard recomputes."

## 2:25 — Data entry (15s)

**Data Entry** tab. Mark one task done.

> "And coordinators keep it current from here — log attendance, close a task, add
> a contribution. It feeds straight back into the scores."

## 2:40 — Close (20s)

> "So: one number that tells a club president who to thank and who to call. Built
> on React, Express and Postgres, with the whole thing deployable in a day.
>
> Next up is CSV import for historical data and automatic nudges when someone's
> score drops three weeks running."

---

## The cast (for your own reference)

| Member | All-time | Story |
|---|---|---|
| Priya Raghavan | 100 | The star — perfect attendance, every task, most contributions |
| Marcus Chen | 86.7 | Solid second, reliable coordinator |
| **Aditya Nair** | **66.7** | **Was 100, now 38 in the last quarter — the drop-off you catch** |
| Hannah Okafor | 36.7 | The reverse: 8 → 59, turning around |
| Sofia Almeida | 6 | Joined and vanished |
| Tom Becker | 3.3 | Never engaged |

## If something breaks

- Blank dashboard → API is down. Check `curl localhost:4000/api/health`.
- Numbers look wrong → re-run `cd server && npm run prisma:seed` (deterministic,
  restores exactly the table above).
- Charts empty on a filter → the range excludes all events; click **All time**.
