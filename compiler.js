import Watcher from './watcher'
import { dir } from 'async';
import Lucas from './lucas';
/*
 * @Author: your name
 * @Date: 2020-04-20 14:16:10
 * @LastEditTime: 2020-04-21 10:40:02
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
      let attr = attrs.find(item => /^l-for/.test(item.name));
      let key = attr.name;
      let value = attr.value;
      let vm = this.vm;
      let params = value.split(" in ");
      node.removeAttribute('l-for');

      //订阅数组长度，通过fragment替换
      Watcher.node = node;
      Watcher.compiler = this;
      new Watcher(`${params[1]}.length`, vm, newValue => {
        let fragment = document.createDocumentFragment();

        let node = Watcher.node;
        Watcher.node = null;
        let compiler = Watcher.compiler;
        Watcher.compiler = null

        function itemToKey(node, list, index) {
          if (node.nodeType === 1) {
            if (node.childNodes && node.childNodes.length > 0) {
              let nodes = [...node.childNodes];
              for (let node of nodes) {
                itemToKey(node, list, index);
              }
            }
            let attrs = [...node.attributes];
            for (let item of attrs) {
              let key = item.name;
              let value = item.value;
              node.setAttribute(key, value.replace(/item/g, `${list}[${index}]`));
            }
          } else {
            node.textContent = node.textContent.replace(/\{\{(.*)(item)(\.?.*)\}\}/g, '{{'+'$1'+`${list}[${index}]` + '$3}}');
          }
        }

        for (let i = 0; i < newValue; i++) {
          let newNode = node.cloneNode(true);
          itemToKey(newNode, params[1], i);
          compiler.compileNode(newNode);
          fragment.appendChild(newNode);
        }
        setTimeout(()=>{
          node.parentNode.replaceChild(fragment,node);
        },0)
      })
    } else {
      for (let item of attrs) {
        this.compileIstruction(node, item);
      }
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
      }
      node.removeAttribute(key);
    }
  }
}