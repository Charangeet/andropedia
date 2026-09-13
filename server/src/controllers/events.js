const prisma = require('../lib/prisma')

async function list(req, res) {
  const { type, from, to } = req.query
  const dateFilter = {}
  if (from) dateFilter.gte = new Date(from)
  if (to) dateFilter.lte = new Date(to)

  const events = await prisma.event.findMany({
    where: {
      ...(type ? { type } : {}),
      ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
    },
    orderBy: { date: 'desc' },
  })
  res.json(events)
}

async function getOne(req, res) {
  const id = Number(req.params.id)
  const event = await prisma.event.findUnique({
    where: { id },
    include: { attendance: { include: { member: true } } },
  })
  if (!event) return res.status(404).json({ error: 'Event not found' })
  res.json(event)
}

async function create(req, res) {
  const { name, type, date } = req.body
  if (!name || !type || !date) {
    return res.status(400).json({ error: 'name, type and date are required' })
  }
  const event = await prisma.event.create({ data: { name, type, date: new Date(date) } })
  res.status(201).json(event)
}

module.exports = { list, getOne, create }
