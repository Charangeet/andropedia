const { Router } = require('express')
const settings = require('../controllers/settings')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', settings.getWeights)
router.put('/', requireAuth, settings.updateWeights)

module.exports = router
