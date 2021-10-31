const path = require('path')

module.exports = {
  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
    localePath: path.resolve('./config/locales'),
    reloadOnPrerender: (process.env.NODE_ENV || process.env.VERCEL_ENV || 'development') === 'development'
  }
}
