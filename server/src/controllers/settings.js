const prisma = require('../lib/prisma')
const { getWeights } = require('../services/engagementScore')
const { logAudit } = require('../lib/audit')
const { getActor } = require('../middleware/requireAuth')

const FIELDS = ['attendance', 'taskCompletion', 'workshopParticipation', 'contribution']

async function getWeightsHandler(_req, res) {
  const weights = await getWeights()
  res.json(weights)
}

async function updateWeights(req, res) {
  const values = {}
  for (const field of FIELDS) {
    const value = req.body[field]
    if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
      return res.status(400).json({ error: `${field} must be a non-negative number` })
    }
    values[field] = value
  }

  const weights = await prisma.engagementWeight.upsert({
    where: { id: 1 },
    update: values,
    create: { id: 1, ...values },
  })
  await logAudit({
    action: 'update',
    entityType: 'EngagementWeight',
    entityId: 1,
    actor: getActor(req),
    summary: 'Updated engagement weights',
  })
  res.json(weights)
}

module.exports = { getWeights: getWeightsHandler, updateWeights }
