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

const app = express()

// Set CORS_ORIGIN in production to restrict to the deployed frontend.
app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN } : {}))
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

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

module.exports = app
