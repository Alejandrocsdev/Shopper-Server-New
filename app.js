// 引用環境變數模組
require('dotenv').config()
// 引用後端框架
const express = require('express')
// 建立 Express 應用程式
const app = express()
// 伺服器端口
const port = process.env.PORT
// 引用 CORS 中間件
const cors = require('cors')
// 引用前端網域
const { frontUrl } = require('./utils')
// 設定 CORS 的選項，允許來自特定來源的請求，並且允許攜帶憑證
const corsOptions = {
  origin: frontUrl,
  credentials: true
}
// 引用路由模組
const routes = require('./routes')
// 引用自定義中間件(預設路由/全域錯誤)
const { defaultRoute, globalError } = require('./middlewares')
// Express 中間件: 解析請求主體的 URL 編碼格式資料 (不使用擴展模式)
app.use(express.urlencoded({ extended: false }))
// Express 中間件: 解析請求主體的 JSON 格式資料
app.use(express.json())
// 中間件: 跨來源資源共用
app.use(cors(corsOptions))
// 掛載路由中間件
app.use('/api', routes)
// 掛載預設路由中間件
app.all('*', defaultRoute)
// 掛載全域錯誤中間件
app.use(globalError)
// 監聽伺服器運行
app.listen(port, () => console.info(`Express server running on port: ${port}`))
