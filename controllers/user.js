// 引用 Models
const { User } = require('../models')
// 引用異步錯誤處理中間件
const { asyncError } = require('../middlewares')
// 自訂錯誤訊息模組
const CustomError = require('../errors/CustomError')
// 引用自定驗證模組
const Validator = require('../Validator')
// 引用 加密 模組
const { encrypt } = require('../utils')

class UserController extends Validator {
  getUserById = asyncError(async (req, res, next) => {
    const { userId } = req.params

    const user = await User.findByPk(userId)
    this.validateData([user], `查無 id: ${userId} 用戶資料`)

    // 刪除敏感資料
    const userData = user.toJSON()
    delete userData.password

    res.status(200).json({ message: '取得用戶資料成功', user: userData })
  })

  findUserByInfo = asyncError(async (req, res, next) => {
    const { userInfo } = req.params

    const infoType = userInfo.split(':')[0] // phone || email
    const info = userInfo.split(':')[1]

    const user = await User.findOne({ where: { [infoType]: info } })

    const userData = user ? user.toJSON() : null

    // 刪除敏感資料
    if (user) delete userData.password

    res.status(200).json({ message: user ? '資料已經註冊' : '資料尚未註冊', user: userData })
  })
}

module.exports = new UserController()
