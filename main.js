/*
 * @Author: your name
 * @Date: 2020-04-20 14:10:20
 * @LastEditTime: 2020-04-20 21:09:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\main.js
 */
import Lucas from "./lucas"

const vm = new Lucas({
  el: '#app',
  data: {
    list: ['one', 'two', 'three'],
    num: 10,
    msg: 'lucas',
    isShow: true,
    person: {
      name: "lucas",
      footer: {
        size: 41
      }
    }
  },
  methods: {
    handle() {
      this.isShow = !this.isShow;
    }
  }
})