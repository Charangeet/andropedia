const prisma = require('../lib/prisma')

async function list(req, res) {
  const { memberId, projectId, status } = req.query
  const tasks = await prisma.task.findMany({
    where: {
      ...(memberId ? { memberId: Number(memberId) } : {}),
      ...(projectId ? { projectId: Number(projectId) } : {}),
      ...(status ? { status } : {}),
    },
    include: { member: true, project: true },
    orderBy: { dueDate: 'asc' },
  })
  res.json(tasks)
}

async function create(req, res) {
  const { memberId, projectId, title, dueDate } = req.body
  if (!memberId || !title) {
    return res.status(400).json({ error: 'memberId and title are required' })
  }
  const task = await prisma.task.create({
    data: {
      memberId: Number(memberId),
      projectId: projectId ? Number(projectId) : undefined,
      title,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  })
  res.status(201).json(task)
}

async function update(req, res) {
  const id = Number(req.params.id)
  const { title, status, dueDate } = req.body
  const data = { title, status, dueDate: dueDate ? new Date(dueDate) : undefined }
  if (status === 'done') {
    data.completedDate = new Date()
  }
  const task = await prisma.task.update({ where: { id }, data })
  res.json(task)
}

module.exports = { list, create, update }
