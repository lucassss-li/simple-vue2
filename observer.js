import Dep from "./dep";
/*
 * @Author: your name
 * @Date: 2020-04-20 14:16:02
 * @LastEditTime: 2020-04-21 21:35:00
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
      if (data[key] instanceof Array) this.addPush(data, key);
      if (typeof data[key] === 'object') this.walk(data[key]);
      this.defineReactable(data, key, data[key]);
    }
  }
  defineReactable(target, key, value) {
    let _this = this;
    let dep = new Dep();
    Object.defineProperty(target, key, {
      enumerable: true,
      get() {
        Dep.watcher && dep.addsub(Dep.watcher);
        return value;
      },
      set(newValue) {
        value = newValue;
        if (typeof newValue == 'object') {
          _this.walk(target[key]);
        }
        dep.notify();
      }
    })
  }
  addPush(root, key) {
    let _this = this;
    root[key].push = function (data) {
      let arr = [...this];
      Array.prototype.push.call(arr, data);
      root[key] = arr;
      _this.addPush(root,key);
    }
  }
}