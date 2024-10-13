// 自訂化錯誤訊息模組
class CustomError extends Error {
  constructor(code, i18n, message) {
    // 覆蓋 Error 預設錯誤訊息
    super(message)
    // 增加 Error.code (自訂錯誤狀態碼)
    this.code = code
    // 增加 Error.i18n (自訂國際化代碼)
    this.i18n = i18n
  }
}

module.exports = CustomError
