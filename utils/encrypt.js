// 引入加密相關模組
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// 引用客製化錯誤訊息模組
const CustomError = require('../errors/CustomError')

class Encrypt {
  // 雜湊
  async hash(data) {
    try {
      const salt = await bcrypt.genSaltSync(10)
      const hashedData = await bcrypt.hash(data, salt)
      return hashedData
    } catch (err) {
      throw new CustomError(500, '', '雜湊失敗 (Encrypt.hash)')
    }
  }

  // 雜湊比對
  async hashCompare(data, hashedData) {
    try {
      const isMatch = await bcrypt.compare(data, hashedData)
      return isMatch
    } catch (err) {
      throw new CustomError(500, '', '雜湊比對失敗 (Encrypt.hashCompare)')
    }
  }

  // 密鑰
  secret() {
    try {
      const secret = crypto.randomBytes(32).toString('hex')
      return secret
    } catch (err) {
      throw new CustomError(500, '', '密鑰生成失敗 (Encrypt.secret)')
    }
  }

  // 簡訊 OTP
  otp() {
    try {
      const code = crypto.randomInt(100000, 1000000)
      return String(code)
    } catch (err) {
      throw new CustomError(500, '', '生成OTP失敗 (Encrypt.otp)')
    }
  }
}

module.exports = new Encrypt()
