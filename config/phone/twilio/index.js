// 引用簡訊內容
const smsMessage = require('../smsMessage')
// 引用自訂錯誤訊息模組
const CustomError = require('../../../errors/CustomError')

// Twilio 帳號資料
const accountPhone = process.env.TWILIO_PHONE
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

// 引用 Twilio SDK
const client = require('twilio')(accountSid, authToken)

// 設定選項
const options = (data, type) => {
  return {
    from: accountPhone,
    to: `+886${data.phone.slice(1)}`,
    body: smsMessage(data, type)
  }
}

// Twilio 簡訊發送器
async function twilio(data, type) {
  try {
    if (!accountPhone) throw new CustomError(500, 'twilioMissingPhone', '缺少 Twilio 電話號碼')
    if (!accountSid) throw new CustomError(500, 'twilioMissingSid', '缺少 Twilio Account SID')
    if (!authToken) throw new CustomError(500, 'twilioMissingToken', '缺少 Twilio Auth Token')

    // 發送簡訊
    await client.messages.create(options(data, type))
  } catch (err) {
    throw new CustomError(500, 'twilioOtpSendFail', '簡訊OTP發送失敗 (Twilio)')
  }
}

module.exports = twilio
