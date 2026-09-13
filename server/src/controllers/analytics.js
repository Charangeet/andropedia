const prisma = require('../lib/prisma')
const { computeAllScores, getWeights } = require('../services/engagementScore')

const CLASSIFICATION_RANK = { Active: 0, 'At Risk': 1, Inactive: 2 }

function summarize(scores) {
  const avgEngagement = scores.length
    ? Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10
    : 0
  const counts = { Active: 0, 'At Risk': 0, Inactive: 0 }
  for (const s of scores) counts[s.classification]++
  return {
    avgEngagement,
    active: counts.Active,
    atRisk: counts['At Risk'],
    inactive: counts.Inactive,
  }
}

async function summary(req, res) {
  const { from, to } = req.query
  const [totalMembers, scores] = await Promise.all([
    prisma.member.count(),
    computeAllScores({ from, to }),
  ])

  res.json({ totalMembers, ...summarize(scores) })
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

async function attendanceByEvent(req, res) {
  const { from, to } = req.query
  const dateFilter = {}
  if (from) dateFilter.gte = new Date(from)
  if (to) dateFilter.lte = new Date(to)

  const events = await prisma.event.findMany({
    where: Object.keys(dateFilter).length ? { date: dateFilter } : {},
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

async function compare(req, res) {
  const { fromA, toA, fromB, toB } = req.query
  const weights = await getWeights()

  const [members, scoresA, scoresB] = await Promise.all([
    prisma.member.findMany({ select: { id: true, name: true, email: true } }),
    computeAllScores({ from: fromA, to: toA, weights }),
    computeAllScores({ from: fromB, to: toB, weights }),
  ])

  const scoresAById = new Map(scoresA.map((s) => [s.memberId, s.score]))
  const scoresBById = new Map(scoresB.map((s) => [s.memberId, s.score]))

  const memberRows = members
    .map((m) => {
      const scoreA = scoresAById.get(m.id) ?? 0
      const scoreB = scoresBById.get(m.id) ?? 0
      return {
        id: m.id,
        name: m.name,
        email: m.email,
        scoreA,
        scoreB,
        delta: Math.round((scoreB - scoreA) * 10) / 10,
      }
    })
    .sort((a, b) => b.delta - a.delta)

  res.json({
    windowA: summarize(scoresA),
    windowB: summarize(scoresB),
    members: memberRows,
  })
}

async function watchlist(req, res) {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const weights = await getWeights()
  const [members, currentScores, previousScores, recentEvents] = await Promise.all([
    prisma.member.findMany({ select: { id: true, name: true, email: true } }),
    computeAllScores({ from: thisMonthStart.toISOString(), to: thisMonthEnd.toISOString(), weights }),
    computeAllScores({ from: lastMonthStart.toISOString(), to: lastMonthEnd.toISOString(), weights }),
    prisma.event.findMany({ orderBy: { date: 'desc' }, take: 2 }),
  ])

  const byId = new Map(members.map((m) => [m.id, m]))
  const currentById = new Map(currentScores.map((s) => [s.memberId, s]))
  const previousById = new Map(previousScores.map((s) => [s.memberId, s]))

  const worsening = members
    .map((m) => {
      const current = currentById.get(m.id)
      const previous = previousById.get(m.id)
      if (!current || !previous) return null
      if (CLASSIFICATION_RANK[current.classification] <= CLASSIFICATION_RANK[previous.classification]) return null
      return {
        ...m,
        score: current.score,
        previousClassification: previous.classification,
        currentClassification: current.classification,
      }
    })
    .filter(Boolean)

  const recentEventIds = recentEvents.map((e) => e.id)
  let missedRecent = []
  if (recentEventIds.length > 0) {
    const attendanceRecords = await prisma.attendance.findMany({
      where: { eventId: { in: recentEventIds } },
    })
    const presentCountByMember = new Map()
    for (const a of attendanceRecords) {
      if (a.status === 'present') {
        presentCountByMember.set(a.memberId, (presentCountByMember.get(a.memberId) || 0) + 1)
      }
    }
    missedRecent = members
      .filter((m) => (presentCountByMember.get(m.id) || 0) === 0)
      .map((m) => ({ ...byId.get(m.id), missedCount: recentEventIds.length }))
  }

  res.json({ worsening, missedRecent })
}

module.exports = { summary, engagementTrend, attendanceByEvent, compare, watchlist }
