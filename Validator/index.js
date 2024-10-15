// 引用自訂錯誤訊息模組
const CustomError = require('../errors/CustomError')

class Validator {
  constructor(schema) {
    this.schema = schema
  }

  // 驗證請求主體
  validateBody(payload, route) {
    // 驗證錯誤
    const { error } = this.schema(route).validate(payload)
    if (error) {
      console.log(error.message)
      throw new CustomError(400, 'invalidPayload', error.details[0].message)
    }
  }

  // 驗證(多筆)資料是否存在
  validateData(datas, message) {
    datas.forEach((data) => {
      if (!data) {
        throw new CustomError(404, 'noTableData', message)
      }
    })
  }
}

module.exports = Validator
