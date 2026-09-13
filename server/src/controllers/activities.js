const prisma = require('../lib/prisma')

async function list(req, res) {
  const { memberId, type } = req.query
  const activities = await prisma.activity.findMany({
    where: {
      ...(memberId ? { memberId: Number(memberId) } : {}),
      ...(type ? { type } : {}),
    },
    include: { member: true },
    orderBy: { date: 'desc' },
  })
  res.json(activities)
}

async function create(req, res) {
  const { memberId, type, title, points, notes } = req.body
  if (!memberId || !type || !title) {
    return res.status(400).json({ error: 'memberId, type and title are required' })
  }
  const activity = await prisma.activity.create({
    data: { memberId: Number(memberId), type, title, points: points ?? 0, notes },
  })
  res.status(201).json(activity)
}

module.exports = { list, create }
