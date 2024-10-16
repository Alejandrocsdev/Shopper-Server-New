const { Router } = require('express')
const router = Router()

const auth = require('./auth')
const user = require('./user')
const verif = require('./verif')

router.use('/auth', auth)
router.use('/user', user)
router.use('/verif', verif)

module.exports = router
