const { faker } = require('@faker-js/faker')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const MONTHS_BACK = 6
const FILLER_COUNT = 20

// The demo dataset is deterministic so a rehearsed walkthrough always shows the
// same people with the same scores. Re-seeding never reshuffles the cast.
const SEED = 20260913
faker.seed(SEED)

let rngState = SEED
function random() {
  rngState |= 0
  rngState = (rngState + 0x6d2b79f5) | 0
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function chance(p) {
  return random() < p
}

function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(random() * arr.length)]
}

// trend shapes activity over time: 'steady' behaves the same all 6 months,
// 'declining' starts strong and falls off a cliff, 'rising' is the reverse.
// The declining member is the demo's punchline — looks acceptable all-time,
// but filtering the dashboard to the last 3 months exposes the drop-off.
const CAST = [
  {
    name: 'Priya Raghavan',
    email: 'priya.raghavan@andropedia.org',
    role: 'coordinator',
    attendance: 1,
    taskDone: 1,
    contributions: 6,
    trend: 'steady',
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.chen@andropedia.org',
    role: 'coordinator',
    attendance: 0.95,
    taskDone: 0.9,
    contributions: 4,
    trend: 'steady',
  },
  {
    name: 'Aditya Nair',
    email: 'aditya.nair@andropedia.org',
    role: 'member',
    attendance: 0.9,
    taskDone: 0.85,
    contributions: 3,
    trend: 'declining',
  },
  {
    name: 'Hannah Okafor',
    email: 'hannah.okafor@andropedia.org',
    role: 'member',
    attendance: 0.35,
    taskDone: 0.4,
    contributions: 1,
    trend: 'rising',
  },
  {
    name: 'Sofia Almeida',
    email: 'sofia.almeida@andropedia.org',
    role: 'member',
    attendance: 0.08,
    taskDone: 0.1,
    contributions: 0,
    trend: 'steady',
  },
  {
    name: 'Tom Becker',
    email: 'tom.becker@andropedia.org',
    role: 'member',
    attendance: 0.05,
    taskDone: 0,
    contributions: 0,
    trend: 'steady',
  },
]

// Curated rather than faker-generated: generated names read as obviously fake
// on a projector, which undercuts the demo.
const FILLER_NAMES = [
  'Ananya Desai',
  'Liam Fitzgerald',
  'Wei Zhang',
  'Fatima Al-Rashid',
  'Diego Morales',
  'Grace Mwangi',
  'Ethan Brooks',
  'Yuki Tanaka',
  'Olivia Bennett',
  'Rahul Kapoor',
  'Nina Petrova',
  'Samuel Adeyemi',
  'Clara Lindqvist',
  'Arjun Menon',
  'Maya Rosenberg',
  'Daniel Osei',
  'Isabella Rossi',
  'Kiran Shah',
  'Noah Whitfield',
  'Leila Haddad',
]

const FILLER_PROFILES = [
  { attendance: 0.85, taskDone: 0.8, contributions: 2, trend: 'steady' },
  { attendance: 0.7, taskDone: 0.65, contributions: 1, trend: 'steady' },
  { attendance: 0.55, taskDone: 0.5, contributions: 1, trend: 'steady' },
  { attendance: 0.45, taskDone: 0.45, contributions: 0, trend: 'steady' },
  { attendance: 0.25, taskDone: 0.3, contributions: 0, trend: 'steady' },
]

// Multiplier applied to a member's base rates for an event N months ago.
function trendMultiplier(trend, monthsAgoValue) {
  if (trend === 'declining') return monthsAgoValue >= 3 ? 1 : 0.1
  if (trend === 'rising') return monthsAgoValue >= 3 ? 0.4 : 1.9
  return 1
}

function monthsAgo(n, day = 1) {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  d.setDate(day)
  return d
}

function monthLabel(monthsBack) {
  return monthsAgo(monthsBack).toLocaleString('en-US', { month: 'short', year: 'numeric' })
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
        data: {
          name,
          description: faker.lorem.sentence(),
          startDate: monthsAgo(randomInt(1, MONTHS_BACK)),
        },
      })
    )
  }

  console.log('Creating members...')
  const profiles = [
    ...CAST,
    ...FILLER_NAMES.slice(0, FILLER_COUNT).map((name, i) => ({
      ...FILLER_PROFILES[i % FILLER_PROFILES.length],
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@andropedia.org`,
      role: 'member',
    })),
  ]

  const members = []
  for (const profile of profiles) {
    const member = await prisma.member.create({
      data: {
        name: profile.name,
        email: profile.email,
        role: profile.role,
        joinDate: monthsAgo(randomInt(MONTHS_BACK, MONTHS_BACK + 6)),
      },
    })
    members.push({ ...member, profile })
  }

  console.log('Creating events...')
  const workshopTopics = [
    'Intro to Git',
    'Design Systems 101',
    'Public Speaking',
    'Data Viz with D3',
    'Resume Clinic',
    'Hackathon Prep',
  ]
  const events = []
  for (let m = MONTHS_BACK - 1; m >= 0; m--) {
    const meeting = await prisma.event.create({
      data: { name: `Monthly Meeting — ${monthLabel(m)}`, type: 'meeting', date: monthsAgo(m, 5) },
    })
    const workshop = await prisma.event.create({
      data: {
        name: `Workshop: ${workshopTopics[MONTHS_BACK - 1 - m]}`,
        type: 'workshop',
        date: monthsAgo(m, 18),
      },
    })
    events.push({ ...meeting, monthsAgo: m }, { ...workshop, monthsAgo: m })
  }

  console.log('Creating attendance...')
  for (const member of members) {
    for (const event of events) {
      if (event.date < member.joinDate) continue
      const rate = member.profile.attendance * trendMultiplier(member.profile.trend, event.monthsAgo)
      await prisma.attendance.create({
        data: {
          memberId: member.id,
          eventId: event.id,
          status: chance(Math.min(rate, 1)) ? 'present' : 'absent',
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
    const taskCount = randomInt(3, 6)
    for (let i = 0; i < taskCount; i++) {
      const monthsAgoValue = randomInt(0, MONTHS_BACK - 1)
      const dueDate = monthsAgo(monthsAgoValue, randomInt(1, 28))
      const rate = member.profile.taskDone * trendMultiplier(member.profile.trend, monthsAgoValue)
      const done = chance(Math.min(rate, 1))
      await prisma.task.create({
        data: {
          memberId: member.id,
          projectId: pick(projects).id,
          title: pick(taskTitles),
          status: done ? 'done' : pick(['todo', 'in_progress']),
          dueDate,
          completedDate: done ? dueDate : null,
        },
      })
    }
  }

  console.log('Creating contributions...')
  const contributionIdeas = [
    'Rebuilt the club website homepage',
    'Secured a sponsor for the annual fest',
    'Mentored three first-year members',
    'Ran the social media campaign',
    'Organised the alumni networking night',
    'Wrote the workshop curriculum',
    'Designed the event poster series',
    'Set up the new attendance process',
  ]
  for (const member of members) {
    for (let i = 0; i < member.profile.contributions; i++) {
      // A declining member's contributions all sit in the older half of the window.
      const monthsAgoValue =
        member.profile.trend === 'declining'
          ? randomInt(3, MONTHS_BACK - 1)
          : randomInt(0, MONTHS_BACK - 1)
      await prisma.contribution.create({
        data: {
          memberId: member.id,
          description: pick(contributionIdeas),
          impactScore: randomInt(4, 10),
          date: monthsAgo(monthsAgoValue, randomInt(1, 28)),
        },
      })
    }
  }

  console.log(
    `Seeded ${members.length} members (${CAST.length} named cast + ${FILLER_COUNT} filler), ${events.length} events, ${projects.length} projects.`
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
