const prisma = require('../lib/prisma')
const { logAudit } = require('../lib/audit')
const { getActor } = require('../middleware/requireAuth')

async function list(_req, res) {
  const projects = await prisma.project.findMany({
    include: { tasks: true },
    orderBy: { startDate: 'desc' },
  })
  res.json(projects)
}

async function create(req, res) {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })
  const project = await prisma.project.create({ data: { name, description } })
  await logAudit({
    action: 'create',
    entityType: 'Project',
    entityId: project.id,
    actor: getActor(req),
    summary: `Created project ${project.name}`,
  })
  res.status(201).json(project)
}

module.exports = { list, create }
