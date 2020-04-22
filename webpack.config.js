/*
 * @Author: your name
 * @Date: 2020-04-20 13:54:19
 * @LastEditTime: 2020-04-22 19:19:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\webpack.config.js
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./lucas.js",
  output: {
    filename: "lucas.js",
    path: path.join(__dirname,'/dist')
  }
}