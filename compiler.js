import Watcher from './watcher'
import { dir } from 'async';
/*
 * @Author: your name
 * @Date: 2020-04-20 14:16:10
 * @LastEditTime: 2020-04-20 21:56:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web\lucas-vue\compiler.js
 */
export default class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.vm.$el.appendChild(this.compile(this.vm.$el));
  }
  compile(root) {
    let fargment = document.createDocumentFragment();
    let nodes = [...root.childNodes];
    for (let node of nodes) {
      if (node.nodeType === 1) {
        this.compileNode(node);
      } else {
        this.compileText(node);
      }
      fargment.appendChild(node);
    }
    return fargment;
  }
  compileNode(node) {
    if (node.childNodes && node.childNodes.length > 0) {
      let nodes = [...node.childNodes];
      for (let node of nodes) {
        if (node.nodeType === 1) {
          this.compileNode(node);
        } else {
          this.compileText(node);
        }
      }
    }
    //编译元素节点属性
    let attrs = [...node.attributes];
    if (attrs.some(item => item.name === 'l-for')) {
      //编译l-for指令
      
      node.removeAttribute('l-for');
      attrs = attrs.filter(item => item.name !== 'l-for');
    }
    for (let item of attrs) {
      this.compileIstruction(node, item);
    }
  }


  compileText(node) {
    if ([...node.parentNode.attributes].some(item => {
      return item.name === 'l-for';
    })) return;
    let str = node.textContent.trim();
    let matchs = str.match(/\{\{.*\}\}/g);
    let params = str.split(/\{\{(.*)\}\}/g);
    if (str && matchs) {
      let exp = [];
      for (let item of params) {
        if (matchs.indexOf("{{" + item + "}}") > -1) {
          exp.push("(" + item + ")");
        } else if (item !== '') {
          exp.push("'" + item + "'");
        }
      }
      new Watcher(exp.join("+"), this.vm, newValue => node.textContent = newValue);
    }
  }


  compileIstruction(node, attr) {
    let key = attr.name;
    let value = attr.value;
    let vm = this.vm;
    if (/^(l-on)/.test(key)) {
      let event = key.slice(5);
      node.addEventListener(event, vm[value]);
      node.removeAttribute(key);
    } else if (/^(l-bind)/.test(key)) {
      node.removeAttribute(key);
    } else if (/^l-/.test(key)) {
      switch (key) {
        case 'l-model': {
          new Watcher(value, vm, newValue => node.value = newValue);
          node.oninput = function () {
            vm[value] = node.value;
          }
          break;
        }
        case 'l-text': {
          new Watcher(value, vm, newValue => node.innerText = newValue);
          break;
        }
        case 'l-html': {
          new Watcher(value, vm, newValue => node.innerHTML = newValue);
          break;
        }
        case 'l-show': {
          new Watcher(value, vm, newValue => {
            if (!newValue) {
              node.hidden = true;
            } else {
              node.hidden = false;
            }
          });
          break;
        }
        case 'l-for': {
          // let params = value.split(" in ");
          // console.log(node.textContent);
          // console.log(vm[params[1]]);
          // let exp = node.
          // new Watcher(vm[params[1]]);

          break;
        }
      }
      node.removeAttribute(key);
    }
  }
}