const { Router } = require('express')
const tasks = require('../controllers/tasks')

const router = Router()

router.get('/', tasks.list)
router.post('/', tasks.create)
router.patch('/:id', tasks.update)

module.exports = router
