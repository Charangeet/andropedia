const { Router } = require('express')
const activities = require('../controllers/activities')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', activities.list)
router.post('/', requireAuth, activities.create)

module.exports = router
