const { Router } = require('express')
const router = Router()

const { authController } = require('../controllers')

const { checkId } = require('../middlewares')

// 驗證參數 userId
router.param('userId', checkId)

router.post('/sign-in/auto/:userId', authController.autoSignIn)
router.post('/sign-up', authController.signUp)

module.exports = router
