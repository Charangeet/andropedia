const { Router } = require('express')
const auth = require('../controllers/auth')

const router = Router()

router.post('/login', auth.login)
router.post('/logout', auth.logout)
router.get('/session', auth.session)

module.exports = router
