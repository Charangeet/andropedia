const { Router } = require('express')
const attendance = require('../controllers/attendance')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', attendance.list)
router.post('/', attendance.create)
router.post('/bulk-import', requireAuth, attendance.bulkImport)

module.exports = router
