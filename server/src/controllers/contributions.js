const prisma = require('../lib/prisma')

async function list(req, res) {
  const { memberId } = req.query
  const contributions = await prisma.contribution.findMany({
    where: { ...(memberId ? { memberId: Number(memberId) } : {}) },
    include: { member: true },
    orderBy: { date: 'desc' },
  })
  res.json(contributions)
}

async function create(req, res) {
  const { memberId, description, impactScore } = req.body
  if (!memberId || !description) {
    return res.status(400).json({ error: 'memberId and description are required' })
  }
  const contribution = await prisma.contribution.create({
    data: { memberId: Number(memberId), description, impactScore: impactScore ?? 0 },
  })
  res.status(201).json(contribution)
}

module.exports = { list, create }
