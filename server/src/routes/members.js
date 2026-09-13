const { Router } = require('express')
const members = require('../controllers/members')

const router = Router()

router.get('/inactive', members.inactive)
router.get('/leaderboard', members.leaderboard)
router.get('/', members.list)
router.post('/', members.create)
router.get('/:id', members.getOne)
router.patch('/:id', members.update)
router.delete('/:id', members.remove)
router.get('/:id/score', members.score)

module.exports = router
