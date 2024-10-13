const isProduction = process.env.NODE_ENV === 'production'

const config = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  path: '/',
  sameSite: isProduction ? 'none' : 'strict',
  secure: isProduction,
  domain: isProduction ? process.env.COOKIE_DOMAIN : 'localhost'
}

class Cookie {
  store(res, token) {
    return res.cookie('jwt', token, config)
  }

  clear(res) {
    return res.clearCookie('jwt', config)
  }
}

module.exports = new Cookie()