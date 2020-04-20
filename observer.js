import Dep from "./dep";
/*
 * @Author: your name
 * @Date: 2020-04-20 14:16:02
 * @LastEditTime: 2020-04-20 20:57:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\observer.js
 */
export default class Observer {
  constructor(data) {
    this.$data = data || {};
    this.walk(this.$data);
  }
  walk(data) {
    for (let key in data) {
      if (typeof data[key] === 'object') this.walk(data[key]);
      this.defineReactable(data, key, data[key]);
    }
  }
  defineReactable(target, key, value) {
    let dep = new Dep();
    Object.defineProperty(target, key, {
      enumerable: true,
      get() {
        Dep.watcher && dep.addsub(Dep.watcher);
        return value;
      },
      set(newValue) {
        value = newValue;
        dep.notify();
      }
    })
  }
}