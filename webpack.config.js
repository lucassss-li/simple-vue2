const path = require('path')

module.exports = {
  entry: './lucas.js',
  mode: 'production',
  output: {
    filename: 'lucas.js',
    path: path.join(__dirname, '/dist')
  }
}
