const { Router } = require('express')
const router = Router()

const auth = require('./auth')
const user = require('./user')
const verification = require('./verification')

router.use('/auth', auth)
router.use('/user', user)
router.use('/verification', verification)

module.exports = router
