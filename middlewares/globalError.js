// 全域錯誤訊息中間件
function globalError(err, req, res, next) {
  console.info(err)

  res.status(err.code || 500).json({ message: err.message, i18n: err.i18n || 'defaultError' })
}

module.exports = globalError
