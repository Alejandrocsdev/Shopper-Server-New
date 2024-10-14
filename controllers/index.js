const userController = require('./user')
const verificationController = require('./verification')

module.exports = { userController, verificationController }

// NOTE:
// (more than one non read-only actions: create, update, delete)
// 建立事務
// const transaction = await sequelize.transaction()
// 提交事務
// await transaction.commit()
// 回滾事務
// await transaction.rollback()
// 回滾事務 (只在事務尚未提交時進行回滾)
// if (!transaction.finished) {
//   await transaction.rollback()
// }
// next(err)