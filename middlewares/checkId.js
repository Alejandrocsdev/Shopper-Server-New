// 引用客製化錯誤訊息模組
const CustomError = require('../errors/CustomError')

function checkId(req, res, next, val) {
  const id = Number(val)
  if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    const err = new CustomError(400, 'invalidParamsId', '無效參數ID')
    return next(err)
  }
  next()
}

module.exports = checkId
