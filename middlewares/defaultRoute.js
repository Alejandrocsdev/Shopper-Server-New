// 引用客製化錯誤訊息模組
const CustomError = require('../errors/CustomError')

// 預設(其他)路由處理中間件
function defaultRoute(req, res, next) {
  const err = new CustomError(404, `伺服器端查無 ${req.method} ${req.originalUrl} 路由`)
  next(err)
}

module.exports = defaultRoute