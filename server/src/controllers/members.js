const prisma = require('../lib/prisma')
const { computeMemberScore, computeAllScores } = require('../services/engagementScore')

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
  res.status(201).json(member)
}

async function update(req, res) {
  const id = Number(req.params.id)
  const { name, email, role } = req.body
  const member = await prisma.member.update({
    where: { id },
    data: { name, email, role },
  })
  res.json(member)
}

async function remove(req, res) {
  const id = Number(req.params.id)
  await prisma.member.delete({ where: { id } })
  res.status(204).end()
}

async function score(req, res) {
  const id = Number(req.params.id)
  const { from, to } = req.query
  const result = await computeMemberScore(id, { from, to })
  res.json(result)
}

async function inactive(req, res) {
  const { from, to } = req.query
  const scores = await computeAllScores({ from, to })
  const members = await prisma.member.findMany({ select: { id: true, name: true, email: true } })
  const byId = new Map(members.map((m) => [m.id, m]))
  const result = scores
    .filter((s) => s.classification !== 'Active')
    .map((s) => ({ ...byId.get(s.memberId), ...s }))
    .sort((a, b) => a.score - b.score)
  res.json(result)
}

async function leaderboard(req, res) {
  const { from, to } = req.query
  const scores = await computeAllScores({ from, to })
  const members = await prisma.member.findMany({ select: { id: true, name: true, email: true } })
  const byId = new Map(members.map((m) => [m.id, m]))
  const result = scores
    .map((s) => ({ ...byId.get(s.memberId), ...s }))
    .sort((a, b) => b.score - a.score)
  res.json(result)
}

module.exports = { list, getOne, create, update, remove, score, inactive, leaderboard }
