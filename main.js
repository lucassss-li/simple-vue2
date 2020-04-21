/*
 * @Author: your name
 * @Date: 2020-04-20 14:10:20
 * @LastEditTime: 2020-04-21 10:35:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\main.js
 */
import Lucas from "./lucas"

const vm = new Lucas({
  el: '#app',
  data: {
    list: [
      {content:10000,done:true},
      {content:'two',done:true},
      {content:'three',done:false}
    ],
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
      this.list[0].done = !this.list[0].done;
    }
  }
})