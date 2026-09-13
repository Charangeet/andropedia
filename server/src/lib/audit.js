const prisma = require('./prisma')

async function logAudit({ action, entityType, entityId, actor, summary }) {
  try {
    await prisma.auditLog.create({
      data: { action, entityType, entityId: entityId ?? null, actor, summary: summary ?? null },
    })
  } catch (err) {
    console.error('Failed to write audit log:', err)
  }
}

module.exports = { logAudit }
