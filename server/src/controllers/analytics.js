const prisma = require('../lib/prisma')
const { computeAllScores } = require('../services/engagementScore')

async function summary(req, res) {
  const { from, to } = req.query
  const [totalMembers, scores] = await Promise.all([
    prisma.member.count(),
    computeAllScores({ from, to }),
  ])

  const avgEngagement = scores.length
    ? Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10
    : 0

  const counts = { Active: 0, 'At Risk': 0, Inactive: 0 }
  for (const s of scores) counts[s.classification]++

  res.json({
    totalMembers,
    avgEngagement,
    active: counts.Active,
    atRisk: counts['At Risk'],
    inactive: counts.Inactive,
  })
}

async function engagementTrend(req, res) {
  const months = Number(req.query.months) || 6
  const now = new Date()
  const points = []

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
    const scores = await computeAllScores({ from: start.toISOString(), to: end.toISOString() })
    const avg = scores.length
      ? Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10
      : 0
    points.push({
      month: start.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      avgEngagement: avg,
    })
  }

  res.json(points)
}

async function attendanceByEvent(_req, res) {
  const events = await prisma.event.findMany({
    include: { attendance: true },
    orderBy: { date: 'asc' },
  })
  const result = events.map((e) => ({
    eventId: e.id,
    name: e.name,
    date: e.date,
    present: e.attendance.filter((a) => a.status === 'present').length,
    absent: e.attendance.filter((a) => a.status === 'absent').length,
  }))
  res.json(result)
}

module.exports = { summary, engagementTrend, attendanceByEvent }
