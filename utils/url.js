const isProduction = process.env.NODE_ENV === 'production'

const backUrl = isProduction ? process.env.BACK_PROD_BASE_URL : process.env.BACK_DEV_BASE_URL
const frontUrl = isProduction ? process.env.FRONT_PROD_BASE_URL : process.env.FRONT_DEV_BASE_URL

module.exports = { backUrl, frontUrl }
