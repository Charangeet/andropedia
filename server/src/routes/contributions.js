const { Router } = require('express')
const contributions = require('../controllers/contributions')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', contributions.list)
router.post('/', requireAuth, contributions.create)

module.exports = router
