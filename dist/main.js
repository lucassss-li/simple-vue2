/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./compiler.js":
/*!*********************!*\
  !*** ./compiler.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Complier; });\n/* harmony import */ var _watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./watcher */ \"./watcher.js\");\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dep */ \"./dep.js\");\n\r\n\r\n/*\r\n * @Author: your name\r\n * @Date: 2020-04-20 14:16:10\r\n * @LastEditTime: 2020-04-20 15:36:01\r\n * @LastEditors: Please set LastEditors\r\n * @Description: In User Settings Edit\r\n * @FilePath: \\web\\lucas-vue\\compiler.js\r\n */\r\nclass Complier {\r\n  constructor(vm) {\r\n    this.vm = vm,\r\n      this.$el = vm.$el;\r\n    this.$el.appendChild(this.complie(this.$el));\r\n  }\r\n  complie(root) {\r\n    let fragment = document.createDocumentFragment();\r\n    let nodes = [...root.childNodes];\r\n    for (let item of nodes) {\r\n      if (item.nodeType === 1) {\r\n        this.compileNode(item);\r\n      } else {\r\n        this.compileText(item);\r\n      }\r\n      fragment.appendChild(item);\r\n    }\r\n    return fragment;\r\n  }\r\n  compileText(node) {\r\n    let str = node.textContent.trim();\r\n    let matchs = str.match(/\\{\\{(.*)\\}\\}/g);\r\n    let params = str.split(/\\{\\{(.*)\\}\\}/g);\r\n    let exp = [];\r\n    for (let item of params) {\r\n      if (matchs && matchs.indexOf(\"{{\" + item + \"}}\") > -1) {\r\n        exp.push(\"(\" + item + \")\");\r\n      } else if (item != '') {\r\n        exp.push(\"'\" + item + \"'\");\r\n      }\r\n    }\r\n    _dep__WEBPACK_IMPORTED_MODULE_1__[\"default\"].target = new _watcher__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.vm, exp.join(\"+\"), newValue => node.textContent = newValue);\r\n    _dep__WEBPACK_IMPORTED_MODULE_1__[\"default\"].target = null;\r\n  }\r\n  compileNode(node) {\r\n    if (node.childNodes && node.childNodes.length > 0) {\r\n      let nodes = [...node.childNodes];\r\n      for (let item of nodes) {\r\n        if (item.nodeType === 1) {\r\n          this.compileNode(item);\r\n        } else {\r\n          this.compileText(item);\r\n        }\r\n      }\r\n    }\r\n  }\r\n\r\n}\n\n//# sourceURL=webpack:///./compiler.js?");

/***/ }),

/***/ "./dep.js":
/*!****************!*\
  !*** ./dep.js ***!
  \****************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Dep; });\n/*\r\n * @Author: your name\r\n * @Date: 2020-04-20 14:16:29\r\n * @LastEditTime: 2020-04-20 15:57:07\r\n * @LastEditors: Please set LastEditors\r\n * @Description: In User Settings Edit\r\n * @FilePath: \\web\\lucas-vue\\dep.js\r\n */\r\nclass Dep {\r\n  constructor() {\r\n    this.subs = {};\r\n  }\r\n  addSub(watcher) {\r\n    this.subs[watcher.uid] = watcher;\r\n  }\r\n  notify() {\r\n    for (let item in this.subs) {\r\n      this.subs[item].update();\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack:///./dep.js?");

/***/ }),

/***/ "./lucas.js":
/*!******************!*\
  !*** ./lucas.js ***!
  \******************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Lucas; });\n/* harmony import */ var _compiler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./compiler */ \"./compiler.js\");\n/* harmony import */ var _observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./observer */ \"./observer.js\");\n\r\n\r\n\r\n/*\r\n * @Author: your name\r\n * @Date: 2020-04-20 14:10:33\r\n * @LastEditTime: 2020-04-20 14:36:23\r\n * @LastEditors: Please set LastEditors\r\n * @Description: In User Settings Edit\r\n * @FilePath: \\web\\lucas-vue\\lucas.js\r\n */\r\nclass Lucas {\r\n  constructor(options) {\r\n    this.$options = options;\r\n    this.$el = document.querySelector(options.el);\r\n    this.$data = options.data;\r\n    this.$methods = options.methods;\r\n\r\n    new _observer__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this.$data);\r\n    this._proxyData(this.$data);\r\n    this._proxyMethod(this.$methods);\r\n\r\n    new _compiler__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this);\r\n  }\r\n  _proxyData(data) {\r\n    for (let key in data) {\r\n      Object.defineProperty(this, key, {\r\n        enumerable: true,\r\n        get() {\r\n          return this.$data[key];\r\n        },\r\n        set(newValue) {\r\n          this.$data[key] = newValue\r\n        }\r\n      })\r\n    }\r\n  }\r\n  _proxyMethod(methods){\r\n    for(let key in methods){\r\n      this[key] = methods[key];\r\n    }\r\n  }\r\n}\n\n//# sourceURL=webpack:///./lucas.js?");

/***/ }),

/***/ "./main.js":
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _lucas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lucas */ \"./lucas.js\");\n/*\r\n * @Author: your name\r\n * @Date: 2020-04-20 14:10:20\r\n * @LastEditTime: 2020-04-20 15:57:39\r\n * @LastEditors: Please set LastEditors\r\n * @Description: In User Settings Edit\r\n * @FilePath: \\web\\lucas-vue\\main.js\r\n */\r\n\r\n\r\nconst vm = new _lucas__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\r\n  el:'#app',\r\n  data:{\r\n    num:1000,\r\n    msg:'lucas',\r\n    person:{\r\n      name:\"lucas\",\r\n      footer:{\r\n        size:41\r\n      }\r\n    }\r\n  },\r\n  methods: {\r\n   handle(){\r\n     console.log('method');\r\n   } \r\n  }\r\n})\r\n\r\nconsole.log(vm);\r\nsetInterval(()=>{\r\n  vm.num++;\r\n},1000)\r\n\n\n//# sourceURL=webpack:///./main.js?");

/***/ }),

/***/ "./observer.js":
/*!*********************!*\
  !*** ./observer.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Observer; });\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ \"./dep.js\");\n/*\r\n * @Author: your name\r\n * @Date: 2020-04-20 14:16:02\r\n * @LastEditTime: 2020-04-20 15:57:23\r\n * @LastEditors: Please set LastEditors\r\n * @Description: In User Settings Edit\r\n * @FilePath: \\web\\lucas-vue\\observer.js\r\n */\r\n\r\n\r\n\r\nclass Observer {\r\n  constructor(data) {\r\n    this.$data = data || {};\r\n    this.walk(this.$data);\r\n  }\r\n  walk(data) {\r\n    for (let key in data) {\r\n      this.defineReatable(data, key, data[key]);\r\n      if (typeof data[key] === 'object') this.walk(data[key]);\r\n    }\r\n  }\r\n  defineReatable(target, key, value) {\r\n    let dep = new _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\r\n    Object.defineProperty(target, key, {\r\n      enumerable: true,\r\n      get() {\r\n        _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target&&dep.addSub(_dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target);\r\n        return value;\r\n      },\r\n      set(newValue) {\r\n        value = newValue;\r\n        dep.notify();\r\n      }\r\n    })\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack:///./observer.js?");

/***/ }),

/***/ "./watcher.js":
/*!********************!*\
  !*** ./watcher.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Watcher; });\n/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ \"./dep.js\");\n\r\n/*\r\n * @Author: your name\r\n * @Date: 2020-04-20 14:16:22\r\n * @LastEditTime: 2020-04-20 15:49:00\r\n * @LastEditors: Please set LastEditors\r\n * @Description: In User Settings Edit\r\n * @FilePath: \\web\\lucas-vue\\watcher.js\r\n */\r\n\r\nlet uid = 0;\r\nclass Watcher {\r\n  constructor(vm, exp, cb) {\r\n    this.uid = uid++;\r\n    this.vm = vm;\r\n    this.exp = exp;\r\n    this.cb = cb;\r\n    this.update();\r\n  }\r\n  get() {\r\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = this;\r\n    let newValue = Watcher.computeExp(this.exp, this.vm);\r\n    _dep__WEBPACK_IMPORTED_MODULE_0__[\"default\"].target = null;\r\n    return newValue;\r\n  }\r\n  update() {\r\n    let newValue = this.get();\r\n    this.cb && this.cb(newValue);\r\n  }\r\n  static computeExp(exp, scope) {\r\n    let fn = new Function('scope', \"with(scope){return \" + exp + \"}\");\r\n    return fn(scope);\r\n  }\r\n}\n\n//# sourceURL=webpack:///./watcher.js?");

/***/ })

/******/ });