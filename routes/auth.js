const { Router } = require('express')
const router = Router()

const { authController } = require('../controllers')

// 簡訊
router.post('/send/otp', authController.sendOtp)
router.post('/verify/otp', authController.verifyOtp)

// 信箱
// router.post('/send/link', authController.sendLink)
// router.get('/verify/link', authController.verifyLink)

module.exports = router
