const { Router } = require('express')
const router = Router()

const { verifController } = require('../controllers')

// 簡訊
router.post('/send/otp', verifController.sendOtp)
router.post('/verify/otp', verifController.verifyOtp)

// 信箱
router.post('/send/link', verifController.sendLink)
router.get('/verify/link', verifController.verifyLink)

module.exports = router
