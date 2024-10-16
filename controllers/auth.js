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
const { encrypt, cookie } = require('../utils')
// 需驗證Body路由 (validate)
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

class AuthController extends Validator {
  constructor() {
    super(schema)
  }

  autoSignIn = asyncError(async (req, res, next) => {
    const { userId } = req.params

    const user = await User.findByPk(userId)
    this.validateData([user])

    const refreshToken = encrypt.signRefreshToken(userId)
    await User.update({ refreshToken }, { where: { id: userId } })
    cookie.store(res, refreshToken)

    const accessToken = encrypt.signAccessToken(userId)
    res.status(200).json({ message: '自動登入成功', accessToken })
  })

  signIn = asyncError(async (req, res, next) => {
    const { user } = req
    console.log('user', user)

    if (!user) throw new CustomError(401, 'signInFail', '登入失敗')

    const refreshToken = encrypt.signRefreshToken(user.id)
    await User.update({ refreshToken }, { where: { id: user.id } })
    cookie.store(res, refreshToken)

    const accessToken = encrypt.signAccessToken(user.id)
    res.status(200).json({ message: '登入成功', accessToken })
  })

  signUp = asyncError(async (req, res, next) => {
    // 驗證請求主體
    this.validateBody(req.body, 'signUp')
    const { phone, password } = req.body

    const [username, hashedPassword] = await Promise.all([
      encrypt.uniqueUsername(User),
      encrypt.hash(password)
    ])

    const user = await User.create({ username, password: hashedPassword, phone })

    // 刪除敏感資料
    const newUser = user.toJSON()
    delete newUser.password

    res.status(201).json({ message: '新用戶註冊成功', user: newUser })
  })
}

module.exports = new AuthController()
