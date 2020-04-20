import Compiler from "./compiler";
import Observer from "./observer";

export default class Lucas {
  constructor(options) {
    this.$el = document.querySelector(options.el);
    this.$options = options;
    this.$data = options.data;
    this.$methods = options.methods;

    new Observer(this.$data);
    this._proxyData(this.$data);
    this._proxyMethod(this.$methods);
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
  _proxyMethod(methods){
    for(let method in methods){
      this[method] = methods[method].bind(this);
    }
  }
}