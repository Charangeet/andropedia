const prisma = require('../lib/prisma')

async function list(req, res) {
  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const entries = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  res.json(entries)
}

module.exports = { list }
