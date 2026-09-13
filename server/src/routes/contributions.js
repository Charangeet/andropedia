const { Router } = require('express')
const contributions = require('../controllers/contributions')

const router = Router()

router.get('/', contributions.list)
router.post('/', contributions.create)

module.exports = router
