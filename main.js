/*
 * @Author: your name
 * @Date: 2020-04-20 14:10:20
 * @LastEditTime: 2020-04-21 22:16:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\main.js
 */
import Lucas from "./lucas"

const vm = new Lucas({
  el: '#app',
  data: {
    list: [
      {id:0, content: 10000, done: true },
      {id:1, content: 'two', done: true },
      {id:2, content: 'three', done: true }
    ],
    num: 100,
    msg: 'lucas',
    isShow: true,
    isRed:true,
    bc:"red",
    border:"green",
    person: {
      name: "lucas",
      footer: {
        size: 41
      }
    }
  },
  methods: {
    handle() {
      this.isRed = !this.isRed;
      this.list[0].done = !this.list[0].done;
    },
    show(e,item){
     this.list[item].done = false;
    }
  }
})
