// 引用自訂錯誤訊息模組
const CustomError = require('../../errors/CustomError')

// 簡訊內容
function smsMessage(data, type) {
  switch (type) {
    case 'verify':
      return `【瞎皮爾購物】輸入 ${data.otp} 以建立您的帳號，15 分鐘內有效。請不要將驗證碼分享給任何人，包括瞎皮爾員工。`
    case 'notify':
      return `【瞎皮爾購物】您的密碼最近在 ${data.date} 完成了變更。如果您並未要求更改密碼，請立刻聯絡我們的瞎皮爾客服團隊。`
    default:
      throw new CustomError(400, 'invalidSmsMsgType', '無效的簡訊內容類型')
  }
}

module.exports = smsMessage