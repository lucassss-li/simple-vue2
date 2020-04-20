const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./main.js",
  output: {
    filename: "main.js",
    path: path.join(__dirname,'/dist')
  },
  module: {

  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ],
  mode: "development",
  devServer: {
    port: 3003,
    compress: true,
    open: true,
    //开启HMR
    //css由styly-loader实现
    //js需要修改js代码，见main.js
    hot: true
  }
}