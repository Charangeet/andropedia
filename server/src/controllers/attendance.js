const prisma = require('../lib/prisma')
const { parseCsv } = require('../lib/csv')
const { logAudit } = require('../lib/audit')
const { getActor } = require('../middleware/requireAuth')

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

async function upsertAttendance({ memberId, eventId, status, date }) {
  return prisma.attendance.upsert({
    where: { memberId_eventId: { memberId, eventId } },
    update: { status },
    create: { memberId, eventId, status, date },
  })
}

async function create(req, res) {
  const { memberId, eventId, status, date } = req.body
  if (!memberId || !eventId || !status) {
    return res.status(400).json({ error: 'memberId, eventId and status are required' })
  }
  const record = await upsertAttendance({
    memberId: Number(memberId),
    eventId: Number(eventId),
    status,
    date: date ? new Date(date) : undefined,
  })
  await logAudit({
    action: 'upsert',
    entityType: 'Attendance',
    entityId: record.id,
    actor: getActor(req),
    summary: `Marked member ${record.memberId} ${status} for event ${record.eventId}`,
  })
  res.status(201).json(record)
}

const VALID_STATUSES = ['present', 'absent']

async function bulkImport(req, res) {
  const { eventId, csvText } = req.body
  if (!eventId || !csvText) {
    return res.status(400).json({ error: 'eventId and csvText are required' })
  }

  const { header, rows } = parseCsv(csvText)
  const emailIdx = header.findIndex((h) => h.trim().toLowerCase() === 'email')
  const statusIdx = header.findIndex((h) => h.trim().toLowerCase() === 'status')
  if (emailIdx === -1 || statusIdx === -1) {
    return res.status(400).json({ error: 'CSV must have "email" and "status" columns' })
  }

  const emails = rows.map((r) => r[emailIdx]?.trim().toLowerCase()).filter(Boolean)
  const members = await prisma.member.findMany({ where: { email: { in: emails } } })
  const memberByEmail = new Map(members.map((m) => [m.email.toLowerCase(), m]))

  let imported = 0
  const skipped = []

  for (const row of rows) {
    const email = row[emailIdx]?.trim().toLowerCase()
    const status = row[statusIdx]?.trim().toLowerCase()
    if (!email) continue

    const member = memberByEmail.get(email)
    if (!member) {
      skipped.push({ email, reason: 'No member with this email' })
      continue
    }
    if (!VALID_STATUSES.includes(status)) {
      skipped.push({ email, reason: `Invalid status "${status}"` })
      continue
    }

    await upsertAttendance({ memberId: member.id, eventId: Number(eventId), status })
    imported++
  }

  await logAudit({
    action: 'bulk-import',
    entityType: 'Attendance',
    entityId: Number(eventId),
    actor: getActor(req),
    summary: `Bulk-imported ${imported} attendance record(s) for event ${eventId}`,
  })

  res.json({ imported, skipped })
}

module.exports = { list, create, bulkImport, upsertAttendance }
