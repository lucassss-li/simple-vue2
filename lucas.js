

import Compiler from "./compiler";
import Observer from "./observer";
import Watcher from "./watcher";
import Dep from "./dep";

class Lucas {
  constructor(options) {
    this.$el = document.querySelector(options.el);
    this.$options = options;
    this.$vm = this;
    this.$data = options.data;
    this.$methods = options.methods;
    this.$computed = options.computed;

    new Observer(this.$data);
    this._proxyData(this.$data);
    this._proxyMethod(this.$methods);
    this._proxyComputed(this.$computed);
    new Compiler(this);

  }
  _proxyData(data) {
    for (let key in data) {
      Object.defineProperty(this, key, {
        enumerable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          data[key] = newValue;
        }
      })
    }
  }
  _proxyMethod(methods) {
    for (let method in methods) {
      this[method] = methods[method].bind(this);
    }
  }
  _proxyComputed(computed) {
    for (let item in computed) {
      let exp = '$computed[' + "'" + item + "'" + '].call($vm)';
      new Watcher(exp, this, newValue => {
        this[item] = newValue;
      });
      DefineReact(this, item, this[item]);
    }
    function DefineReact(target, key, value) {
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
}

window.Lucas = Lucas;
export default Lucas