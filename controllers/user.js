// 引用 Models
const { User } = require('../models')
// 引用異步錯誤處理中間件
const { asyncError } = require('../middlewares')
// 自訂錯誤訊息模組
const CustomError = require('../errors/CustomError')
// 引用自定驗證模組
const Validator = require('../Validator')
// 引用驗證模組
const Joi = require('joi')
// 引用 加密 模組
const { encrypt } = require('../utils')
// 需驗證Body路由
const v = {
  phone: ['signUp'],
  password: ['signUp']
}
// Body驗證條件
const schema = (route) => {
  return Joi.object({
    phone: v['phone'].includes(route)
      ? Joi.string().regex(/^09/).length(10).required()
      : Joi.forbidden(),
    password: v['password'].includes(route)
      ? Joi.string().min(8).max(16).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/).required()
      : Joi.forbidden()
  })
}

class UserController extends Validator {
  constructor() {
    super(schema)
  }

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

  signUp = asyncError(async (req, res, next) => {
    // 驗證請求主體
    this.validateBody(req.body, 'signUp')
    const { phone, password } = req.body

    const hashedPassword = await encrypt.hash(password)

    // 生成唯一帳號
    const username = await encrypt.uniqueUsername(User)

    const user = await User.create({ username, password: hashedPassword, phone })

    const newUser = user.toJSON()
    delete newUser.password

    res.status(201).json({ message: '新用戶註冊成功', newUser })
  })
}

module.exports = new UserController()
