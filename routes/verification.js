const { Router } = require('express')
const router = Router()

const { verificationController } = require('../controllers')

// 簡訊
router.post('/send/otp', verificationController.sendOtp)
router.post('/verify/otp', verificationController.verifyOtp)

// 信箱
// router.post('/send/link', verificationController.sendLink)
// router.get('/verify/link', verificationController.verifyLink)

module.exports = router
