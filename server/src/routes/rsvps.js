const { Router } = require('express')
const rsvps = require('../controllers/rsvps')

const router = Router()

router.get('/', rsvps.list)
router.post('/', rsvps.create)

module.exports = router
