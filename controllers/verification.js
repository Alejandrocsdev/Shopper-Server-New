// 引用 Models
const { Otp, User } = require('../models')
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
// 發送器模組 (電話)
const sendSMS = require('../config/phone')
const smsType = process.env.SMS_TYPE
// 需驗證Body路由
const v = {
  phone: ['sendOtp', 'verifyOtp'],
  isReset: ['sendOtp'],
  otp: ['verifyOtp']
}
// Body驗證條件
const schema = (route) => {
  return Joi.object({
    phone: v['phone'].includes(route)
      ? Joi.string().regex(/^09/).length(10).required()
      : Joi.forbidden(),
    isReset: v['isReset'].includes(route) ? Joi.boolean().default(false) : Joi.forbidden(),
    otp: v['otp'].includes(route) ? Joi.string().length(6).required() : Joi.forbidden()
  })
}

class VerificationController extends Validator {
  constructor() {
    super(schema)
  }

  sendOtp = asyncError(async (req, res, next) => {
    // 驗證請求主體
    this.validateBody(req.body, 'sendOtp')
    // isReset: 是否為重設密碼
    const { phone, isReset } = req.body

    // 生成OTP
    const otp = encrypt.otp()

    // 確認用戶存在 / OTP 加密
    const [user, hashedOtp] = await Promise.all([
      User.findOne({ where: { phone } }),
      encrypt.hash(otp)
    ])

    if (isReset) {
      // 1. 如電話不存在,無法重設密碼
      // 2. 如是註冊,電話存在與否都會嘗試發送OTP
      this.validateData([user], `未有使用電話 ${phone} 註冊用戶 `)
    }

    // OTP 有效期限(15分鐘)
    const expireTime = Date.now() + 15 * 60 * 1000
    // 查詢OTP紀錄, 不存在則新增
    const [otpRecord, created] = await Otp.findOrCreate({
      where: { phone },
      defaults: { phone, hashedOtp, expireTime }
    })

    // 如果 OTP 記錄已存在，更新 OTP 和 expireTime
    if (!created) {
      await otpRecord.update({ hashedOtp, expireTime, attempts: 0 })
    }

    // 發送簡訊
    await sendSMS({ phone, otp }, 'verify', smsType)
    // 成功回應
    res.status(200).json({ message: `簡訊OTP發送成功 (${smsType})` })
  })

  verifyOtp = asyncError(async (req, res, next) => {
    // 驗證請求主體
    this.validateBody(req.body, 'verifyOtp')
    const { phone, otp } = req.body

    // 讀取單一資料
    const otpRecord = await Otp.findOne({ where: { phone } })

    // 驗證 OTP 是否存在
    this.validateData([otpRecord], `未有使用電話 ${phone} 發送OTP紀錄 `)

    const { hashedOtp, expireTime, attempts } = otpRecord

    const newAttempts = attempts + 1

    // 驗證 OTP 是否正確
    const isMatch = await encrypt.hashCompare(otp, hashedOtp)

    // 刪除Otp資訊: OTP 正確 / OTP 失效 / 嘗試次數過多
    if (isMatch || expireTime <= Date.now() || newAttempts > 5) {
      // 刪除Otp資訊
      await Otp.destroy({ where: { hashedOtp } })

      // OTP 正確
      if (isMatch) {
        res.status(200).json({ message: `簡訊OTP驗證成功 (${smsType})` })
      }
      // OTP 失效
      else if (expireTime <= Date.now()) {
        throw new CustomError(401, 'otpExpired', '您輸入的驗證碼已經過期。請再次嘗試請求新的驗證碼。')
      }
      // 嘗試次數過多
      else if (newAttempts > 5) {
        throw new CustomError(429, 'tooManyAttempts', '輸入錯誤達5次。請再次嘗試請求新的驗證碼。')
      }
    }
    // 未達嘗試限制: 更新嘗試次數
    else {
      // 更新Otp資訊
      await Otp.update({ attempts: newAttempts }, { where: { phone } })

      throw new CustomError(401, 'invalidOtp', '無效的驗證碼。')
    }
  })
}

module.exports = new VerificationController()
