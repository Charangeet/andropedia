const { Router } = require('express')
const projects = require('../controllers/projects')

const router = Router()

router.get('/', projects.list)
router.post('/', projects.create)

module.exports = router
