// Twilio 帳號資料
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

// 引用 Twilio SDK
const client = require('twilio')(accountSid, authToken)
// 引用自訂錯誤訊息模組
const CustomError = require('../../../errors/CustomError')

// 簡訊內容
function message(data, type) {
  switch (type) {
    case 'verify':
      return `【瞎皮爾購物】輸入 ${data.otp} 以建立您的帳號，15 分鐘內有效。請不要將驗證碼分享給任何人，包括瞎皮爾員工。`
    case 'notify':
      return `【瞎皮爾購物】您的密碼最近在 ${data.date} 完成了變更。如果您並未要求更改密碼，請立刻聯絡我們的瞎皮爾客服團隊。`
    default:
      throw new CustomError(400, 'invalidSmsType', '無效的簡訊類型')
  }
}

// 設定選項
const options = (data, type) => {
  if (!process.env.TWILIO_PHONE) {
    throw new CustomError(500, 'twilioMissingPhone', '缺少 Twilio 電話號碼')
  }

  return {
    from: process.env.TWILIO_PHONE,
    to: `+886${data.phone.slice(1)}`,
    body: message(data, type)
  }
}

// Twilio 簡訊發送器
async function twilio(data, type) {
  try {
    if (!accountSid) throw new CustomError(500, 'twilioMissingSid', '缺少 Twilio Account SID')
    if (!authToken) throw new CustomError(500, 'twilioMissingToken', '缺少 Twilio Auth Token')

    // 發送簡訊
    await client.messages.create(options(data, type))
  } catch (err) {
    throw new CustomError(500, 'twilioOtpSendFail', '簡訊OTP發送失敗 (Twilio)')
  }
}

module.exports = twilio
