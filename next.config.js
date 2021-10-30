const i18n = require('./next-i18next.config.js')

module.exports = {
  ...i18n,
  env: {
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN
  }
}
