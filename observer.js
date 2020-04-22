
import Dep from "./dep";

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
}