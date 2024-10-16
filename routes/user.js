const { Router } = require('express')
const router = Router()

const { userController } = require('../controllers')

const { checkId } = require('../middlewares')

// 驗證參數 userId
router.param('userId', checkId)

router.get('/:userId', userController.getUserById)
router.get('/find/:userInfo', userController.findUserByInfo)
router.put('/pwd/:userInfo', userController.putPwdByInfo)

module.exports = router
