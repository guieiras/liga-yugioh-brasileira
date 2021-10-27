const path = require('path')

module.exports = {
  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
    localePath: path.resolve('./config/locales')
  }
};
