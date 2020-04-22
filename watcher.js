
import Dep from "./dep";

let uid = 0;
export default class Watcher {
  constructor(exp, scope, cb) {
    this.uid = uid++;
    this.cb = cb;
    this.scope = scope;
    this.exp = exp;
    this.update();
  }
  get() {
    Dep.watcher = this;
    let newValue = Watcher.computeExp(this.scope, this.exp);
    Dep.watcher = null;
    return newValue;
  }
  update() {
    let newValue = this.get();
    this.cb(newValue);
  }
  static computeExp(scope, exp) {
    let fn = new Function('scope', 'with(scope){return ' + exp + '}');
    return fn(scope);
  }
}