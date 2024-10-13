// 引用加密模組
const encrypt = require('./utils/encrypt')
// 生成環境變數所需密鑰
console.log(encrypt.secret())
