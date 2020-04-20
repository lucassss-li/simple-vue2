/*
 * @Author: your name
 * @Date: 2020-04-20 14:16:29
 * @LastEditTime: 2020-04-20 19:50:35
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\dep.js
 */
export default class Dep {
  constructor() {
    this.subs = {}
  }
  addsub(watcher) {
    this.subs[watcher.uid] = watcher;
  }
  notify() {
    for (let index in this.subs) {
      this.subs[index].update();
    }
  }
}