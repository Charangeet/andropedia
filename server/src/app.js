const express = require('express')
const cors = require('cors')

const membersRouter = require('./routes/members')
const eventsRouter = require('./routes/events')
const attendanceRouter = require('./routes/attendance')
const tasksRouter = require('./routes/tasks')
const projectsRouter = require('./routes/projects')
const contributionsRouter = require('./routes/contributions')
const activitiesRouter = require('./routes/activities')
const analyticsRouter = require('./routes/analytics')
const settingsRouter = require('./routes/settings')
const authRouter = require('./routes/auth')
const rsvpsRouter = require('./routes/rsvps')
const searchRouter = require('./routes/search')
const auditLogRouter = require('./routes/audit-log')

const app = express()

// Set CORS_ORIGIN in production to restrict to the deployed frontend.
// credentials: true is required so the browser sends/accepts the auth session cookie.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  })
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/members', membersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/contributions', contributionsRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/settings/weights', settingsRouter)
app.use('/api/auth', authRouter)
app.use('/api/rsvps', rsvpsRouter)
app.use('/api/search', searchRouter)
app.use('/api/audit-log', auditLogRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

module.exports = app
