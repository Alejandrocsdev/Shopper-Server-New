// 引用 axios
const axios = require('axios')
// 引用簡訊內容
const smsMessage = require('../smsMessage')
// 引用自訂錯誤訊息模組
const CustomError = require('../../../errors/CustomError')

// TwSMS 帳號資料
const username = process.env.TWSMS_USERNAME
const password = process.env.TWSMS_PASSWORD
const BASE_API = `${process.env.TWSMS_API}?username=${username}&password=${password}`

// TwSMS 簡訊發送器
async function twsms(data, type) {
  try {
    if (!username) throw new CustomError(500, 'twsmsMissingUsr', '缺少 TwSMS 帳號')
    if (!password) throw new CustomError(500, 'twsmsMissingPwd', '缺少 TwSMS 密碼')

    // 發送簡訊
    await axios.get(`${BASE_API}&mobile=${data.phone}&message=${smsMessage(data, type)}`)
  } catch (err) {
    throw new CustomError(500, 'twsmsOtpSendFail', '簡訊OTP發送失敗 (TwSMS)')
  }
}

module.exports = twsms
