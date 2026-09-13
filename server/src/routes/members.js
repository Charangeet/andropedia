const { Router } = require('express')
const members = require('../controllers/members')
const { requireAuth } = require('../middleware/requireAuth')

const router = Router()

router.get('/inactive', members.inactive)
router.get('/leaderboard', members.leaderboard)
router.get('/', members.list)
router.post('/', requireAuth, members.create)
router.get('/:id', members.getOne)
router.patch('/:id', requireAuth, members.update)
router.delete('/:id', requireAuth, members.remove)
router.get('/:id/score', members.score)
router.get('/:id/trend', members.trend)
router.get('/:id/export', members.exportActivity)

module.exports = router
