const { Router } = require('express')
const tasks = require('../controllers/tasks')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/', tasks.list)
router.post('/', requireAuth, tasks.create)
router.patch('/:id', requireAuth, tasks.update)

module.exports = router
