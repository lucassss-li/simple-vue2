import Watcher from './watcher'
import { dir } from 'async';
import Lucas from './lucas';
/*
 * @Author: your name
 * @Date: 2020-04-20 14:16:10
 * @LastEditTime: 2020-04-21 22:15:56
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
    // if (node.childNodes && node.childNodes.length > 0) {
    //   let nodes = [...node.childNodes];
    //   for (let node of nodes) {
    //     if (node.nodeType === 1) {
    //       this.compileNode(node);
    //     } else {
    //       this.compileText(node);
    //     }
    //   }
    // }
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
      let buckets = [];

      //订阅数组长度，通过fragment替换
      new Watcher(`${params[1]}`, vm, newValue => {
        let fragment = document.createDocumentFragment();
        let b = [...buckets];
        buckets = [];
        while (b.length > 0) {
          node.parentNode.removeChild(b.pop());
        }
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
            node.textContent = node.textContent.replace(/\{\{(.*)(item)(\.?.*)\}\}/g, '{{' + '$1' + `${list}[${index}]` + '$3}}');
          }
        }

        for (let i = 0; i < newValue.length; i++) {
          let newNode = node.cloneNode(true);
          itemToKey(newNode, params[1], i);
          this.compileNode(newNode);
          buckets.push(newNode);
          fragment.appendChild(newNode);
        }
        setTimeout(() => {
          node.hidden = true;
          node.parentNode.insertBefore(fragment, node);
        }, 0)
      }, node, this)
    } else {
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
      value = value.split(/\((.*)\)/g);
      let exp = [];
      if (value[1]) {
        let params = [...value[1]]
        for (let item of params) {
          if (/(\[|\]|\.)/.test(item)) {
            exp.push('+');
          } else {
            exp.push(item);
          }
        }
        exp = exp.join('').split('+').filter(item => item != '');
        console.log(exp);
      }
      function expToValue(exp){
        let result = vm;
        for(let item of exp){
          result = result[item];
        }
        return result;
      }
      let event = key.slice(5);
      node.addEventListener(event, function (e) {
        vm[value[0]](e,expToValue(exp))
      });
      node.removeAttribute(key);
    } else if (/^(l-bind)/.test(key)) {
      let nativekey = key.split(":")[1]
      switch (nativekey) {
        case 'class': {
          if (value.includes('[')) {
            let classes = value.slice(1, value.length - 1).split(',');
            for (let item of classes) {
              new Watcher(item, vm, newValue => node.classList.add(newValue));
            }
          } else if (value.includes('{')) {
            let a = value.slice(1, value.length - 1).split(',');
            let b = {};
            for (let item of a) {
              let [key, value] = item.split(":");
              b[key] = value;
            }
            for (let item in b) {
              new Watcher(b[item], vm, newValue => {
                if (newValue) {
                  node.classList.add(item);
                } else {
                  node.classList.remove(item);
                }
              })
            }
          } else {
            new Watcher(value, vm, newValue => node.classList.add(newValue));
          }
          break;
        }
        case 'style': {
          let a = value.slice(1, value.length - 1).split(',');
          let b = {};
          for (let item of a) {
            let [key, value] = item.split(":");
            b[key] = value;
          }
          for (let item in b) {
            new Watcher(b[item], vm, newValue => node.style[item] = newValue);
          }
          break;
        }
        default: {
          new Watcher(value, vm, newValue => node[nativekey] = newValue);
        }
      }
      node.removeAttribute(key);
    } else if (/^l-/.test(key)) {
      switch (key) {
        case 'l-model': {
          let flag = value.match(/(\[|\]|\.)/) === null;
          if (flag) {
            new Watcher(value, vm, newValue => node.value = newValue);
          } else {
            let nvalue = this.changeInstruction(value);
            new Watcher(nvalue, vm, newValue => node.value = newValue);
          }
          if (flag) {
            node.addEventListener('input', function () {
              vm[value] = node.value;
            })
          } else {
            let params = [...value]
            let exp = [];
            for (let item of params) {
              if (/(\[|\]|\.)/.test(item)) {
                exp.push('+');
              } else {
                exp.push(item);
              }
            }
            exp = exp.filter(item => item != '').join("").split("+");
            value = exp.shift();
            for (let item of exp) {
              if (item !== '') value = value + "['" + item + "']";
            }
            let fn = new Function('e', "this." + value + "=e.target.value").bind(vm);
            node.addEventListener('input', fn);
          }
          break;
        }
        case 'l-text': {
          if (value.match(/(\[|\]|\.)/) === null) {
            new Watcher(value, vm, newValue => node.innerText = newValue);
          } else {
            value = this.changeInstruction(value);
            new Watcher(value, vm, newValue => node.innerText = newValue);
          }
          break;
        }
        case 'l-html': {
          if (value.match(/(\[|\]|\.)/) === null) {
            new Watcher(value, vm, newValue => node.innerHTML = newValue);
          } else {
            value = this.changeInstruction(value);
            new Watcher(value, vm, newValue => node.innerHTML = newValue);
          }
          break;
        }
        case 'l-show': {
          if (value.match(/(\[|\]|\.)/) === null) {
            new Watcher(value, vm, newValue => {
              if (!newValue) {
                node.hidden = true;
              } else {
                node.hidden = false;
              }
            });
          } else {
            value = this.changeInstruction(value);
            new Watcher(value, vm, newValue => {
              if (!newValue) {
                node.hidden = true;
              } else {
                node.hidden = false;
              }
            });
          }
          break;
        }
      }
      node.removeAttribute(key);
    }
  }
  changeInstruction(value) {
    let params = [...value]
    let exp = [];
    for (let item of params) {
      if (/(\[|\]|\.)/.test(item)) {
        exp.push('+');
      } else {
        exp.push(item);
      }
    }
    exp = exp.filter(item => item != '').join("").split("+");
    value = exp.shift();
    for (let item of exp) {
      if (item !== '') value = value + "['" + item + "']";
    }
    return value;
  }
}