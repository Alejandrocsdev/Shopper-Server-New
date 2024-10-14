const { Router } = require('express')
const router = Router()

const user = require('./user')
const verification = require('./verification')

router.use('/user', user)
router.use('/verification', verification)

module.exports = router
