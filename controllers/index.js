const authController = require('./auth')
const userController = require('./user')

module.exports = { authController, userController }

// NOTE:
// create / update / delete

// read mothod don't effect

// 建立事務
// const transaction = await sequelize.transaction()
// 提交事務
// await transaction.commit()
// 回滾事務
// await transaction.rollback()