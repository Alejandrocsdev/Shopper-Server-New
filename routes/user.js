const { Router } = require('express')
const router = Router()

const { userController } = require('../controllers')

// 透過 id 返回用戶資料, 不存在返回錯誤
router.get('/:userId', userController.getUserById)
// 透過 phone / email 檢查用戶是否存在, 返回布林值(true返回用戶資料, false不返回錯誤) 
router.get('/check/:userInfo', userController.checkUserByInfo)

router.post('/sign-up', userController.signUp)

module.exports = router
