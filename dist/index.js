
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./tester.cjs.production.min.js')
} else {
  module.exports = require('./tester.cjs.development.js')
}
