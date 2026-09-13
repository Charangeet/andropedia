const { faker } = require('@faker-js/faker')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const MONTHS_BACK = 6
const MEMBER_COUNT = 26

// Each member is assigned a profile that biases their generated activity,
// so the demo dataset has clear "star" and "inactive" members to show off
// the engagement score rather than uniform random noise.
const PROFILES = [
  { name: 'star', weight: 0.15, attendance: 0.95, taskDone: 0.9, contribution: 0.8 },
  { name: 'active', weight: 0.4, attendance: 0.8, taskDone: 0.7, contribution: 0.4 },
  { name: 'average', weight: 0.3, attendance: 0.55, taskDone: 0.5, contribution: 0.15 },
  { name: 'inactive', weight: 0.15, attendance: 0.15, taskDone: 0.2, contribution: 0.02 },
]

function pickProfile() {
  const r = Math.random()
  let acc = 0
  for (const p of PROFILES) {
    acc += p.weight
    if (r <= acc) return p
  }
  return PROFILES[PROFILES.length - 1]
}

function chance(p) {
  return Math.random() < p
}

function monthsAgo(n, day = 1) {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  d.setDate(day)
  return d
}

async function main() {
  console.log('Clearing existing data...')
  await prisma.activity.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.contribution.deleteMany()
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()
  await prisma.event.deleteMany()
  await prisma.member.deleteMany()

  console.log('Creating projects...')
  const projectNames = [
    'Website Revamp',
    'Annual Fest',
    'Alumni Outreach',
    'Tech Workshop Series',
    'Community Cleanup Drive',
  ]
  const projects = []
  for (const name of projectNames) {
    projects.push(
      await prisma.project.create({
        data: { name, description: faker.lorem.sentence(), startDate: monthsAgo(faker.number.int({ min: 1, max: MONTHS_BACK })) },
      })
    )
  }

  console.log('Creating members...')
  const members = []
  for (let i = 0; i < MEMBER_COUNT; i++) {
    const profile = pickProfile()
    const isCoordinator = i < 3
    const member = await prisma.member.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: isCoordinator ? 'coordinator' : 'member',
        joinDate: monthsAgo(faker.number.int({ min: MONTHS_BACK, max: MONTHS_BACK + 6 })),
      },
    })
    members.push({ ...member, profile })
  }

  console.log('Creating events...')
  const events = []
  for (let m = MONTHS_BACK - 1; m >= 0; m--) {
    const meeting = await prisma.event.create({
      data: { name: `Monthly Meeting - ${monthLabel(m)}`, type: 'meeting', date: monthsAgo(m, 5) },
    })
    const workshop = await prisma.event.create({
      data: { name: `Workshop: ${faker.hacker.noun()} ${faker.hacker.ingverb()}`, type: 'workshop', date: monthsAgo(m, 18) },
    })
    events.push(meeting, workshop)
  }

  function monthLabel(monthsBack) {
    const d = monthsAgo(monthsBack)
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
  }

  console.log('Creating attendance...')
  for (const member of members) {
    for (const event of events) {
      if (event.date < member.joinDate) continue
      const present = chance(member.profile.attendance)
      await prisma.attendance.create({
        data: {
          memberId: member.id,
          eventId: event.id,
          status: present ? 'present' : 'absent',
          date: event.date,
        },
      })
    }
  }

  console.log('Creating tasks...')
  const taskTitles = [
    'Design landing page',
    'Draft sponsorship email',
    'Book venue',
    'Prepare workshop slides',
    'Coordinate volunteers',
    'Edit promo video',
    'Update social media',
    'Send newsletter',
    'Collect feedback forms',
    'Order supplies',
  ]
  for (const member of members) {
    const taskCount = faker.number.int({ min: 2, max: 6 })
    for (let i = 0; i < taskCount; i++) {
      const dueDate = monthsAgo(faker.number.int({ min: 0, max: MONTHS_BACK - 1 }), faker.number.int({ min: 1, max: 28 }))
      const done = chance(member.profile.taskDone)
      await prisma.task.create({
        data: {
          memberId: member.id,
          projectId: faker.helpers.arrayElement(projects).id,
          title: faker.helpers.arrayElement(taskTitles),
          status: done ? 'done' : faker.helpers.arrayElement(['todo', 'in_progress']),
          dueDate,
          completedDate: done ? dueDate : null,
        },
      })
    }
  }

  console.log('Creating contributions...')
  for (const member of members) {
    const contributionCount = chance(member.profile.contribution)
      ? faker.number.int({ min: 1, max: 5 })
      : 0
    for (let i = 0; i < contributionCount; i++) {
      await prisma.contribution.create({
        data: {
          memberId: member.id,
          description: faker.lorem.sentence(),
          impactScore: faker.number.int({ min: 1, max: 10 }),
          date: monthsAgo(faker.number.int({ min: 0, max: MONTHS_BACK - 1 })),
        },
      })
    }
  }

  console.log(`Seeded ${members.length} members, ${events.length} events, ${projects.length} projects.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
