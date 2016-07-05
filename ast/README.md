# AST抽象语法树

列举出本demo包含的内容,和操作方式:

## 1. 分析函数调用次数

最简单的例子,使用AST分析源代码中函数调用情况;
本代码来自[JavaScript的抽象语法树与语法解析](http://wwsun.github.io/posts/javascript-ast-tutorial.html)


demo使用方式:

```shell
node fn-times.js fn-times.test.js
```

文件作用:

 - **fn-times.js**: 主函数入口
 - **fn-times.test.js**:测试文件

## 2. 分析是否是全局变量(变量泄露)

主要是变量作用域(scope)的分析,参考自文章[Fun with Esprima and Static Analysis](http://tobyho.com/2013/12/02/fun-with-esprima/)
 - 只有函数才能创造作用域,有3种类型节点可以创建作用域
   - **FunctionDeclarations**,比如 `function f(){...}`
   - **FunctionExpressions**,比如 `var f = function(){...};`
   - 全局作用域,节点类型一定是**Program**
 - 找到 `Assignments` 类型节点,找到赋值定义
 - 通过遍历AST,分析出作用域链及时pop出作用域链

这里包含两个小demo:

第一个是用来展现作用域链的:
```shell
node var-global.js var-global.test.js
```

第2个是用来测试全局变量泄露的:
```shell
node var-global.js var-leak.test.js
```


> 本程序还有两个todo: 1. 函数声明的时候也相当于声明一个变量; 2. 函数的参数在函数作用域中相当于声明一个变量;

## 3. 创建babel的mori转换器

mori-gen.js 是演示入口文件, moriscript是babel插件内容;

```shell
node mori-gen.js mori-case.ms
```

会演示如何转换将现有js转换成 moriScript

另外一个简单就是重载运算符:

```js
// 转换之前
const doubleAndSquare = x => x | double | square

// 转换之后
const doubleAndSquare = x => square(double(x));
```


## 附
该demo集合的来源是我当时分析webpack源码的时候,看到它期间用acorn抽取语法树的操作;Compiler中用到了Parser，找了一下源码，其中给出了[SpiderMonkey Parser API](https://developer.mozilla.org/zh-CN/docs/Mozilla/Projects/SpiderMonkey/Parser_API)的地址；
 
> SpiderMonkey 是Mozilla的JavaScript 引擎,使用C/C++编写.被使用在多个Mozilla产品中, 包括Firefox,Thunderbird,Seamonkey等, 授权协议采用GPL, LGPL, MPL 三协议授权.
 
该工具的作用相当于解析JS语法，然后整理成AST语法树；
 
 
JavaScript的语法解析器[Espsrima](http://esprima.org/)提供了一个[在线解析的工具](http://esprima.org/demo/parse.html)，也可以通过在线[可视化语法树](http://jointjs.com/demos/javascript-ast)网站比较直观体验一下解析的过程；
 
 
webpack中是使用acorn来抽取语法树的，另外比较流行的语法树工具是esprima，具体的差别可以在工具网站 https://astexplorer.net/ 上直观地做对比；babel中也提供了[acorn-to-esprima](https://github.com/babel/acorn-to-esprima)的转换插件；
 
 
[JavaScript的抽象语法树与语法解析](http://wwsun.github.io/posts/javascript-ast-tutorial.html)：优先阅读此文；本文主要介绍了如何对JavaScript代码使用Esprima进行解析，解析后的结果是一棵符合SpiderMonkey解析API的语法树，然后我们使用Estraverse进行遍历，在遍历过程中我们通过识别节点类型来判断代码位置
 
 
 
[avascript语法树](http://purplebamboo.github.io/2014/09/27/javascript-syntax-tree/)：语法树的结构还是内容比较多的。不过只要了解节点的大概结构。还是可以很容易看懂语法树的
 
美团写了一篇[抽象语法树在 JavaScript 中的应用](http://tech.meituan.com/abstract-syntax-tree.html)：
 
[通过 ast_walker 来操作 AST](https://lifesinger.wordpress.com/2011/09/29/ast-walker/)：查看 UglifyJS 的源码，发现内部提供了 ast_walker 方法。我们可以简单封装成 Ast.js
 
[通过Babel内置的AST编写插件](https://www.sitepoint.com/understanding-asts-building-babel-plugin/)：该文章很好地讲述了如何通过AST构造自己的独特语法，简言之就是变换抽象语法树而已；
 
[uglifyjs](http://lisperator.net/uglifyjs/)是比较流行的JS分析器（其更为人知的是压缩器），由于uglifyjs作者在编写程序的时候还不知道SpiderMonkey AST（参见[这里](http://lisperator.net/uglifyjs/spidermonkey)），导致uglifyjs的语法树压根儿是不一样的，也就说和acorn、esprima解析出来的JSON格式不兼容，不过没关系作者写了一个转换器，**能将acorn输出的格式转换成uglify独特的格式**；
 
遍历标准的AST语法树可以通过[Estraverse](Estraverse)进行，我们把代码弄成AST的目的是因为锻造出自己想要的代码（比如加上额外的东西、注释等等），可以使用[Escodegen](https://github.com/estools/escodegen)工具；