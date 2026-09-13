const { Router } = require('express')
const events = require('../controllers/events')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', events.list)
router.post('/', requireAuth, events.create)
router.get('/checkin/:token', events.getByCheckinToken)
router.post('/checkin/:token', events.checkin)
router.get('/:id', events.getOne)

module.exports = router
