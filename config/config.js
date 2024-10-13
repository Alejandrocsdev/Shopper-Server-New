require('dotenv').config()

module.exports = {
  development: {
    username: process.env.MYSQL_DEV_USERNAME,
    password: process.env.MYSQL_DEV_PASSWORD,
    host: process.env.MYSQL_DEV_HOST,
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQL_PROD_USERNAME,
    password: process.env.MYSQL_PROD_PASSWORD,
    host: process.env.MYSQL_PROD_HOST,
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql'
  }
}