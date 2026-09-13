const prisma = require('../lib/prisma')

async function list(req, res) {
  const { eventId } = req.query
  const rsvps = await prisma.rsvp.findMany({
    where: { ...(eventId ? { eventId: Number(eventId) } : {}) },
    include: { member: true },
    orderBy: { respondedAt: 'desc' },
  })
  res.json(rsvps)
}

async function create(req, res) {
  const { memberId, eventId, response } = req.body
  if (!memberId || !eventId || !response) {
    return res.status(400).json({ error: 'memberId, eventId and response are required' })
  }
  const rsvp = await prisma.rsvp.upsert({
    where: { memberId_eventId: { memberId: Number(memberId), eventId: Number(eventId) } },
    update: { response, respondedAt: new Date() },
    create: { memberId: Number(memberId), eventId: Number(eventId), response },
  })
  res.status(201).json(rsvp)
}

module.exports = { list, create }
