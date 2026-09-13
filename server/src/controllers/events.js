const prisma = require('../lib/prisma')
const { upsertAttendance } = require('./attendance')
const { logAudit } = require('../lib/audit')
const { getActor } = require('../middleware/requireAuth')

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
  await logAudit({
    action: 'create',
    entityType: 'Event',
    entityId: event.id,
    actor: getActor(req),
    summary: `Created event ${event.name}`,
  })
  res.status(201).json(event)
}

async function getByCheckinToken(req, res) {
  const event = await prisma.event.findUnique({ where: { checkinToken: req.params.token } })
  if (!event) return res.status(404).json({ error: 'Check-in link not found' })
  res.json(event)
}

async function checkin(req, res) {
  const { memberId } = req.body
  if (!memberId) return res.status(400).json({ error: 'memberId is required' })

  const event = await prisma.event.findUnique({ where: { checkinToken: req.params.token } })
  if (!event) return res.status(404).json({ error: 'Check-in link not found' })

  const record = await upsertAttendance({ memberId: Number(memberId), eventId: event.id, status: 'present' })
  await logAudit({
    action: 'checkin',
    entityType: 'Attendance',
    entityId: record.id,
    actor: 'public',
    summary: `Self check-in for event ${event.name}`,
  })
  res.status(201).json(record)
}

module.exports = { list, getOne, create, getByCheckinToken, checkin }
