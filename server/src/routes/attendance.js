const { Router } = require('express')
const attendance = require('../controllers/attendance')

const router = Router()

router.get('/', attendance.list)
router.post('/', attendance.create)

module.exports = router
