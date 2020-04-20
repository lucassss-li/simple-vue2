import Dep from "./dep";
/*
 * @Author: your name
 * @Date: 2020-04-20 14:16:22
 * @LastEditTime: 2020-04-20 20:55:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\watcher.js
 */
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