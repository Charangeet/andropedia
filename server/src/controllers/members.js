const prisma = require('../lib/prisma')
const { computeMemberScore, computeAllScores } = require('../services/engagementScore')
const { sendCsv } = require('../lib/csv')
const { logAudit } = require('../lib/audit')
const { getActor } = require('../middleware/requireAuth')

async function list(req, res) {
  const { role, search } = req.query
  const members = await prisma.member.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    orderBy: { name: 'asc' },
  })
  res.json(members)
}

async function getOne(req, res) {
  const id = Number(req.params.id)
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      attendance: { include: { event: true }, orderBy: { date: 'desc' } },
      tasks: { orderBy: { dueDate: 'desc' } },
      contributions: { orderBy: { date: 'desc' } },
      activities: { orderBy: { date: 'desc' } },
    },
  })
  if (!member) return res.status(404).json({ error: 'Member not found' })
  res.json(member)
}

async function create(req, res) {
  const { name, email, role } = req.body
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' })
  }
  const member = await prisma.member.create({
    data: { name, email, role: role || 'member' },
  })
  await logAudit({
    action: 'create',
    entityType: 'Member',
    entityId: member.id,
    actor: getActor(req),
    summary: `Created member ${member.name}`,
  })
  res.status(201).json(member)
}

async function update(req, res) {
  const id = Number(req.params.id)
  const { name, email, role } = req.body
  const member = await prisma.member.update({
    where: { id },
    data: { name, email, role },
  })
  await logAudit({
    action: 'update',
    entityType: 'Member',
    entityId: member.id,
    actor: getActor(req),
    summary: `Updated member ${member.name}`,
  })
  res.json(member)
}

async function remove(req, res) {
  const id = Number(req.params.id)
  const member = await prisma.member.delete({ where: { id } })
  await logAudit({
    action: 'delete',
    entityType: 'Member',
    entityId: id,
    actor: getActor(req),
    summary: `Deleted member ${member.name}`,
  })
  res.status(204).end()
}

async function score(req, res) {
  const id = Number(req.params.id)
  const { from, to } = req.query
  const result = await computeMemberScore(id, { from, to })
  res.json(result)
}

async function inactive(req, res) {
  const { from, to, format } = req.query
  const scores = await computeAllScores({ from, to })
  const members = await prisma.member.findMany({ select: { id: true, name: true, email: true } })
  const byId = new Map(members.map((m) => [m.id, m]))
  const result = scores
    .filter((s) => s.classification !== 'Active')
    .map((s) => ({ ...byId.get(s.memberId), ...s }))
    .sort((a, b) => a.score - b.score)

  if (format === 'csv') {
    return sendCsv(
      res,
      'inactive-members.csv',
      [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'score', header: 'Score' },
        { key: 'classification', header: 'Classification' },
      ],
      result
    )
  }
  res.json(result)
}

async function leaderboard(req, res) {
  const { from, to, format } = req.query
  const scores = await computeAllScores({ from, to })
  const members = await prisma.member.findMany({ select: { id: true, name: true, email: true } })
  const byId = new Map(members.map((m) => [m.id, m]))
  const result = scores
    .map((s) => ({ ...byId.get(s.memberId), ...s }))
    .sort((a, b) => b.score - a.score)

  if (format === 'csv') {
    return sendCsv(
      res,
      'leaderboard.csv',
      [
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        { key: 'score', header: 'Score' },
        { key: 'classification', header: 'Classification' },
      ],
      result
    )
  }
  res.json(result)
}

async function trend(req, res) {
  const id = Number(req.params.id)
  const months = Number(req.query.months) || 6
  const now = new Date()
  const points = []

  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
    const { score } = await computeMemberScore(id, { from: start.toISOString(), to: end.toISOString() })
    points.push({
      month: start.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      score,
    })
  }

  res.json(points)
}

async function exportActivity(req, res) {
  const id = Number(req.params.id)
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      attendance: { include: { event: true } },
      tasks: true,
      contributions: true,
    },
  })
  if (!member) return res.status(404).json({ error: 'Member not found' })

  const rows = [
    ...member.attendance.map((a) => ({
      date: a.date.toISOString().slice(0, 10),
      type: 'attendance',
      detail: a.event.name,
      status: a.status,
    })),
    ...member.tasks.map((t) => ({
      date: (t.completedDate || t.dueDate || new Date()).toISOString().slice(0, 10),
      type: 'task',
      detail: t.title,
      status: t.status,
    })),
    ...member.contributions.map((c) => ({
      date: c.date.toISOString().slice(0, 10),
      type: 'contribution',
      detail: c.description,
      status: `impact ${c.impactScore}`,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1))

  sendCsv(
    res,
    `${member.name.replace(/\s+/g, '-').toLowerCase()}-activity.csv`,
    [
      { key: 'date', header: 'Date' },
      { key: 'type', header: 'Type' },
      { key: 'detail', header: 'Detail' },
      { key: 'status', header: 'Status' },
    ],
    rows
  )
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
  score,
  inactive,
  leaderboard,
  trend,
  exportActivity,
}
