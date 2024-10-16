// 引用 Passport 模組
const passport = require('passport')
// 引用 Models
const { User } = require('../../models')
// 引用 加密 / 前端網域 模組
const { encrypt } = require('../../utils')
// 引用客製化錯誤訊息模組
const CustomError = require('../../errors/CustomError')

// 策略
const localStrategy = require('./local')
const smsStrategy = require('./sms')

// 使用策略
passport.use('local', localStrategy)
passport.use('sms', smsStrategy)

// Passport 初始化
const passportInit = passport.initialize()

// 密碼登入驗證 / 簡訊登入驗證
const pwdSignInAuth = passport.authenticate('local', { session: false })
const smsSignInAuth = passport.authenticate('sms', { session: false })

// 憑證驗證
const jwtAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new CustomError(401, '未提供認證標頭')
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      throw new CustomError(401, '未提供存取憑證')
    }

    const payload = encrypt.verifyToken(token, 'AT')
    const user = await User.findByPk(payload.id)
    if (!user) {
      throw new CustomError(404, '查無用戶')
    }

    // 移除敏感資料
    const authUser = user.toJSON()
    delete authUser.password
    delete authUser.refreshToken

    req.user = authUser
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { passportInit, pwdSignInAuth, smsSignInAuth, jwtAuth }
