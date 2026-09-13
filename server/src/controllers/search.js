const prisma = require('../lib/prisma')

async function search(req, res) {
  const q = (req.query.q || '').trim()
  if (q.length < 2) {
    return res.json({ members: [], events: [], projects: [] })
  }

  const [members, events, projects] = await Promise.all([
    prisma.member.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),
    prisma.event.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      take: 5,
    }),
    prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 5,
    }),
  ])

  res.json({
    members: members.map((m) => ({ type: 'member', id: m.id, label: m.name })),
    events: events.map((e) => ({ type: 'event', id: e.id, label: e.name })),
    projects: projects.map((p) => ({ type: 'project', id: p.id, label: p.name })),
  })
}

module.exports = { search }
