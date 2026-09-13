# ClubPulse API Contract

Base URL (dev): `http://localhost:4000/api`

All request/response bodies are JSON. Dates are ISO 8601 strings.

## Health

- `GET /health` → `{ status: "ok" }`

## Members

- `GET /members` — list members (query: `?role=`, `?search=`)
- `GET /members/:id` — member detail
- `POST /members` — create member `{ name, email, role? }`
- `PATCH /members/:id` — update member
- `DELETE /members/:id`
- `GET /members/:id/score` — engagement score breakdown for a member
- `GET /members/inactive` — members classified At Risk / Inactive
- `GET /members/leaderboard` — members ranked by contribution/engagement score

## Events

- `GET /events` — list events (query: `?type=`, `?from=`, `?to=`)
- `POST /events` — create event `{ name, type, date }`
- `GET /events/:id`

## Attendance

- `GET /attendance` — list (query: `?memberId=`, `?eventId=`)
- `POST /attendance` — log attendance `{ memberId, eventId, status }`

## Tasks

- `GET /tasks` — list (query: `?memberId=`, `?projectId=`, `?status=`)
- `POST /tasks` — create task `{ memberId, projectId?, title, dueDate? }`
- `PATCH /tasks/:id` — update status/fields, e.g. mark done

## Projects

- `GET /projects`
- `POST /projects` — `{ name, description? }`

## Contributions

- `GET /contributions` — list (query: `?memberId=`)
- `POST /contributions` — `{ memberId, description, impactScore }`

## Activities (unified log, optional fallback)

- `GET /activities` — list (query: `?memberId=`, `?type=`)
- `POST /activities` — `{ memberId, type, title, points?, notes? }`

## Analytics

- `GET /analytics/summary` — overview cards: total members, avg engagement, active/at-risk/inactive counts
- `GET /analytics/engagement-trend` — engagement score over time (for line chart)
- `GET /analytics/attendance-by-event` — attendance counts per event (for bar chart)

## Engagement Score

```
engagement_score =
    (attendance_rate * 0.4) +
    (task_completion_rate * 0.3) +
    (workshop_participation_rate * 0.2) +
    (contribution_count_normalized * 0.1)
```

Computed 0–100 per member, per month.
Classification: `>=70 Active`, `40–69 At Risk`, `<40 Inactive`.
