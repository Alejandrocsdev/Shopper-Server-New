const { Router } = require('express')
const router = Router()

const { userController } = require('../controllers')

// 簡訊
router.get('/:userId', userController.getUserById)
router.get('/check/:userInfo', userController.checkUserByInfo)

module.exports = router
