const prisma = require('../lib/prisma')

async function list(req, res) {
  const { memberId, eventId } = req.query
  const records = await prisma.attendance.findMany({
    where: {
      ...(memberId ? { memberId: Number(memberId) } : {}),
      ...(eventId ? { eventId: Number(eventId) } : {}),
    },
    include: { member: true, event: true },
    orderBy: { date: 'desc' },
  })
  res.json(records)
}

async function create(req, res) {
  const { memberId, eventId, status, date } = req.body
  if (!memberId || !eventId || !status) {
    return res.status(400).json({ error: 'memberId, eventId and status are required' })
  }
  const record = await prisma.attendance.upsert({
    where: { memberId_eventId: { memberId: Number(memberId), eventId: Number(eventId) } },
    update: { status },
    create: {
      memberId: Number(memberId),
      eventId: Number(eventId),
      status,
      date: date ? new Date(date) : undefined,
    },
  })
  res.status(201).json(record)
}

module.exports = { list, create }
