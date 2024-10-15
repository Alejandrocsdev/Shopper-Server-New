// 引入加密相關模組
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

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
      throw new CustomError(500, 'hashFail', '雜湊失敗 (Encrypt.hash)')
    }
  }

  // 雜湊比對
  async hashCompare(data, hashedData) {
    try {
      const isMatch = await bcrypt.compare(data, hashedData)
      return isMatch
    } catch (err) {
      throw new CustomError(500, 'hashCompareFail', '雜湊比對失敗 (Encrypt.hashCompare)')
    }
  }

  // 密鑰
  secret() {
    try {
      const secret = crypto.randomBytes(32).toString('hex')
      return secret
    } catch (err) {
      throw new CustomError(500, 'secretGenerateFail', '密鑰生成失敗 (Encrypt.secret)')
    }
  }

  // 簡訊 OTP
  otp() {
    try {
      const code = crypto.randomInt(100000, 1000000)
      return String(code)
    } catch (err) {
      throw new CustomError(500, 'otpGenerateFail', '生成OTP失敗 (Encrypt.otp)')
    }
  }

  // 隨機帳號
  randomCredential(length = 10) {
    try {
      const special = '!@#$%&'
      const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
      const number = '0123456789'

      const charSet = special + upperCase + lowerCase + number

      let result = ''
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length)
        result += charSet[randomIndex]
      }
      return result
    } catch (err) {
      throw new CustomError(
        500,
        'randowmCredentialFail',
        '隨機帳號生成失敗 (Encrypt.randomCredential)'
      )
    }
  }

  // 生成唯一帳號
  async uniqueUsername(model) {
    try {
      // 檢查帳號是否存在函式
      const isExist = async (username) => {
        const user = await model.findOne({ where: { username } })
        return !!user
      }

      let username
      let isUnique = false

      // 持續生成帳號直到生成唯一的帳號
      while (!isUnique) {
        // 隨機生成帳號
        username = this.randomCredential()
        // 檢查帳號是否存在
        isUnique = !(await isExist(username))
      }

      return username
    } catch (err) {
      throw new CustomError(500, 'uniqueUsernameFail', '生成唯一帳號失敗 (Encrypt.uniqueUsername)')
    }
  }

  // Email JWT
  signEmailToken(id) {
    const token = jwt.sign({ id: Number(id) }, process.env.EMAIL_SECRET, { expiresIn: '15m' })
    return token
  }

  // Access JWT
  signAccessToken(id) {
    const token = jwt.sign({ id: Number(id) }, process.env.AT_SECRET, { expiresIn: '15m' })
    return token
  }

  // Refresh JWT
  signRefreshToken(id) {
    const token = jwt.sign({ id: Number(id) }, process.env.RT_SECRET, { expiresIn: '7d' })
    return token
  }

  // 驗證 JWT
  verifyToken(token, type) {
    let secret
    switch (type) {
      case 'at':
        secret = process.env.AT_SECRET
        break
      case 'rt':
        secret = process.env.RT_SECRET
        break
      case 'email':
        secret = process.env.EMAIL_SECRET
        break
    }

    const decoded = jwt.verify(token, secret)
    return decoded
  }
}

module.exports = new Encrypt()
