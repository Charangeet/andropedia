const { Router } = require('express')
const events = require('../controllers/events')

const router = Router()

router.get('/', events.list)
router.post('/', events.create)
router.get('/:id', events.getOne)

module.exports = router
