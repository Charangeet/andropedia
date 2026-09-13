const prisma = require('../lib/prisma')

const DEFAULT_WEIGHTS = {
  attendance: 0.4,
  taskCompletion: 0.3,
  workshopParticipation: 0.2,
  contribution: 0.1,
}

async function getWeights() {
  const existing = await prisma.engagementWeight.findUnique({ where: { id: 1 } })
  if (existing) return existing
  return prisma.engagementWeight.create({ data: { id: 1, ...DEFAULT_WEIGHTS } })
}

function normalizeWeights(weights) {
  const { attendance, taskCompletion, workshopParticipation, contribution } = weights
  const sum = attendance + taskCompletion + workshopParticipation + contribution
  if (sum <= 0) return DEFAULT_WEIGHTS
  return {
    attendance: attendance / sum,
    taskCompletion: taskCompletion / sum,
    workshopParticipation: workshopParticipation / sum,
    contribution: contribution / sum,
  }
}

function classify(score) {
  if (score >= 70) return 'Active'
  if (score >= 40) return 'At Risk'
  return 'Inactive'
}

function rate(numerator, denominator) {
  if (denominator === 0) return 0
  return numerator / denominator
}

/**
 * Computes a member's engagement score over an optional date window.
 * Contribution count is normalized against the highest contribution
 * count among all members in the same window, so score stays 0-100.
 */
async function computeMemberScore(memberId, { from, to, weights } = {}) {
  const dateFilter = {}
  if (from) dateFilter.gte = new Date(from)
  if (to) dateFilter.lte = new Date(to)
  const dateWhere = Object.keys(dateFilter).length ? { date: dateFilter } : {}

  const WEIGHTS = normalizeWeights(weights || (await getWeights()))

  const [attendanceRecords, tasks, contributions, maxContributions] = await Promise.all([
    prisma.attendance.findMany({
      where: { memberId, ...dateWhere },
      include: { event: true },
    }),
    prisma.task.findMany({
      where: { memberId, ...(from || to ? { dueDate: dateFilter } : {}) },
    }),
    prisma.contribution.count({
      where: { memberId, ...dateWhere },
    }),
    maxContributionCount({ from, to }),
  ])

  const totalEvents = attendanceRecords.length
  const presentCount = attendanceRecords.filter((a) => a.status === 'present').length
  const attendanceRate = rate(presentCount, totalEvents)

  const workshopEvents = attendanceRecords.filter((a) => a.event.type === 'workshop')
  const workshopPresent = workshopEvents.filter((a) => a.status === 'present').length
  const workshopParticipationRate = rate(workshopPresent, workshopEvents.length)

  const doneTasks = tasks.filter((t) => t.status === 'done').length
  const taskCompletionRate = rate(doneTasks, tasks.length)

  const contributionNormalized = rate(contributions, maxContributions)

  const score =
    (attendanceRate * WEIGHTS.attendance +
      taskCompletionRate * WEIGHTS.taskCompletion +
      workshopParticipationRate * WEIGHTS.workshopParticipation +
      contributionNormalized * WEIGHTS.contribution) *
    100

  const rounded = Math.round(score * 10) / 10

  return {
    memberId,
    score: rounded,
    classification: classify(rounded),
    breakdown: {
      attendanceRate: Math.round(attendanceRate * 1000) / 10,
      taskCompletionRate: Math.round(taskCompletionRate * 1000) / 10,
      workshopParticipationRate: Math.round(workshopParticipationRate * 1000) / 10,
      contributionCount: contributions,
      contributionNormalized: Math.round(contributionNormalized * 1000) / 10,
    },
  }
}

async function maxContributionCount({ from, to } = {}) {
  const dateFilter = {}
  if (from) dateFilter.gte = new Date(from)
  if (to) dateFilter.lte = new Date(to)
  const dateWhere = Object.keys(dateFilter).length ? { date: dateFilter } : {}

  const grouped = await prisma.contribution.groupBy({
    by: ['memberId'],
    where: dateWhere,
    _count: { _all: true },
  })
  if (grouped.length === 0) return 0
  return Math.max(...grouped.map((g) => g._count._all))
}

async function computeAllScores(options = {}) {
  const [members, weights] = await Promise.all([
    prisma.member.findMany({ select: { id: true } }),
    options.weights ? Promise.resolve(options.weights) : getWeights(),
  ])
  return Promise.all(members.map((m) => computeMemberScore(m.id, { ...options, weights })))
}

module.exports = {
  computeMemberScore,
  computeAllScores,
  classify,
  getWeights,
}
