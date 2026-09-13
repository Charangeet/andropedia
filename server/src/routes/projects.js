const { Router } = require('express')
const projects = require('../controllers/projects')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', projects.list)
router.post('/', requireAuth, projects.create)

module.exports = router
