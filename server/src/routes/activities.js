const { Router } = require('express')
const activities = require('../controllers/activities')

const router = Router()

router.get('/', activities.list)
router.post('/', activities.create)

module.exports = router
