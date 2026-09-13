const { Router } = require('express')
const auditLog = require('../controllers/auditLog')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', requireAuth, auditLog.list)

module.exports = router
