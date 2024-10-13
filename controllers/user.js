// 引用 Models
const { sequelize, User } = require('../models')
// 引用異步錯誤處理中間件
const { asyncError } = require('../middlewares')
// 自訂錯誤訊息模組
const CustomError = require('../errors/CustomError')
// 引用自定驗證模組
const Validator = require('../Validator')
// 引用驗證模組
// const Joi = require('joi')
// 需驗證Body路由
// const v = {
//   phone: ['sendOtp', 'verifyOtp'],
//   otp: ['verifyOtp']
// }
// Body驗證條件
// const schema = (route) => {
//   return Joi.object({
//     phone: v['phone'].includes(route) 
//       ? Joi.string().regex(/^09/).length(10).required() 
//       : Joi.forbidden(),
//     otp: v['otp'].includes(route) 
//       ? Joi.string().length(6).required() 
//       : Joi.forbidden()
//   })
// }

class UserController extends Validator {
  // constructor() {
  //   super(schema)
  // }

  getUserById = asyncError(async (req, res, next) => {
    const { userId } = req.params

    const user = await User.findByPk(userId)

    // 刪除敏感資料
    const userData = user.toJSON()
    console.log(userData)
    delete userData.password

    res.status(200).json({ message: '取得用戶資料成功', userData })
  })

  checkUserByInfo = asyncError(async (req, res, next) => {
    const { userInfo } = req.params

    // format:
    // (1) 'phone:0938473300'
    // (2) 'email:newlean14@gmail.com'
    const infoType = userInfo.split(':')[0] // phone || email
    const info = userInfo.split(':')[1]

    const user = await User.findOne({ where: { [infoType]: info } })
    let userData = {}
    if (user) {
      // 刪除敏感資料
      userData = user.toJSON()
      userData.exist = true
      delete userData.password
    } else {
      userData.exist = false
    }

    res.status(200).json({ message: user ? '用戶已經註冊' : '用戶尚未註冊', userData })
  })
}

module.exports = new UserController()
