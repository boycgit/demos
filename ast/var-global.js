var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');


// 有3种节点类型会创建作用域
function createsNewScope(node){
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'Program';
}

// 打印详细的节点\作用域信息
function printScope(scope, node){
  var varsDisplay = scope.join(', ');

  if(node.type === 'Program'){
    console.log('定义在顶层的变量:',varsDisplay);
  } else {
    if(node.id && node.id.name){
      console.log('定义在函数'+node.id.name+'()中的变量:',varsDisplay);
    } else {
      console.log('定义在匿名函数中的变量:',varsDisplay);
    }
  }
}

// 查找变量是否定义过
// 很关键的点:逆向查找
function isVarDefined(varname,scopeChain){
  for(var i=0;i<scopeChain.length;i++){
    var scope = scopeChain[i];
    if(scope.indexOf(varname)!==-1){
      return true;
    }
  }
  return false;
}

// 检查是否泄露
// 检查assign的变量是否在当前作用域链里
function checkForLeaks(assignments,scopeChain){
  for(var i = 0; i < assignments.length; i++){
    var varname = assignments[i].left.name;
    if(!isVarDefined(varname,scopeChain)){
      console.log('!!检测到全局变量泄露:',varname,',line:',assignments[i].loc.start.line);
    }
  }
}

// 这里分析传入的js文件
function analysis(code){
  var ast = esprima.parse(code,{loc:true}); // 调用api分析源码,{loc:true}表示开启地址信息


  var scopeChain = [];// 存储作用域链
  var assignments = []; // 存储赋值的变量




  // 开始遍历
  estraverse.traverse(ast,{
    enter:function(node){
      // 如果需要创建
      if(createsNewScope(node)){
        scopeChain.push([]);
      }

      // 寻找变量定义节点,将变量推进该作用域
      if(node.type === 'VariableDeclarator'){
        var currentScope = scopeChain[scopeChain.length - 1];
        currentScope.push(node.id.name);
      }
      // 寻找变量赋值节点
      if (node.type === 'AssignmentExpression'){
        assignments.push(node);
      }
    },
    leave: function(node){

      if(createsNewScope(node)){
        // 同时查看是否有变量泄露(全局变量)
        checkForLeaks(assignments,scopeChain);

        // 打印节点
        var currentScope = scopeChain.pop();
        printScope(currentScope,node);

        // 重置assignments
        assignments = [];
      }
    }
  });
}

// 处理参数,必须要有3个
if(process.argv.length < 3){
  console.log('用法:node var-global.js [target].js');
  process.exit(1);
}

// 获取入参,argv第1个参数是node,第二个参数是JS名字,第三个参数才是真正传入的参数
var filename = process.argv[2];
console.log('正在读取'+filename+'文件....');

console.log('开始分析代码');
var code = fs.readFileSync(filename);

analysis(code);
console.log("---分析完毕---");