// 異步錯誤處理中間件
function asyncError(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err))
  }
}

module.exports = asyncError