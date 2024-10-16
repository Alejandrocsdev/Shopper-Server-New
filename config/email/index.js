// 引用發送郵件模組
const nodemailer = require('nodemailer')
// 引用客製化錯誤訊息模組
const CustomError = require('../../errors/CustomError')
// 引用 Node.js 內建 File System 模組
const fs = require('fs')
// 引用 Node.js 內建 Path 模組
const path = require('path')

// 郵件傳送器設定
const config = {
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}

// 讀取郵件樣板並替換內容
const loadTemplate = (templateName, replacements) => {
  const textPath = path.resolve(__dirname, 'templates', templateName, `${templateName}.txt`)
  const htmlPath = path.resolve(__dirname, 'templates', templateName, `${templateName}.html`)

  let textContent = fs.readFileSync(textPath, 'utf8')
  let htmlContent = fs.readFileSync(htmlPath, 'utf8')

  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{{${key}}}`
    textContent = textContent.replace(new RegExp(placeholder, 'g'), value)
    htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value)
  }

  return { text: textContent, html: htmlContent }
}

// 郵件選項
const emailOptions = {
  verify: (data) => ({
    ...loadTemplate('verify', { username: data.username, link: data.link }),
    subject: '重設您的瞎皮爾購物密碼'
  }),
  notify: (data) => ({
    ...loadTemplate('notify', { username: data.username, date: data.date }),
    subject: '您的瞎皮爾購物密碼已經變更'
  })
}

// 發送郵件函式
async function sendMail(data, type) {
  // 郵件傳送器驗證
  const { user, pass } = config.auth

  if (!user || !user.includes('@gmail.com')) throw new CustomError(500, '缺少郵件傳送器信箱')
  if (!pass || pass.length !== 16) throw new CustomError(500, '缺少郵件傳送器密碼(App Password)')

  // 郵件傳送器
  const transporter = nodemailer.createTransport(config)

  try {
    const mailOptions = emailOptions[type](data)
    await transporter.sendMail({ from: user, to: data.email, ...mailOptions })
  } catch (err) {
    throw new CustomError(500, '郵件發送失敗 (gmail)')
  }
}

module.exports = sendMail
