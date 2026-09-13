const { Router } = require('express')
const analytics = require('../controllers/analytics')

const router = Router()

router.get('/summary', analytics.summary)
router.get('/engagement-trend', analytics.engagementTrend)
router.get('/attendance-by-event', analytics.attendanceByEvent)

module.exports = router
