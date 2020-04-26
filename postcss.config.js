var safe   = require('postcss-safe-parser');

module.exports = {
  parser: safe,
  plugins: {
    'postcss-import': {},
  }
}
