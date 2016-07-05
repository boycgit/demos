var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

// 这里分析传入的js文件
function analysis(code){
  var ast = esprima.parse(code); // 调用api分析源码

  // 用于存储函数统计情况
  var functionsStats = {}; // 1

  // 初始化新函数统计key-value
  var addStatsEntry = function(funcName){
    // 将函数名作为key
    if(!functionsStats[funcName]){
      functionsStats[funcName] = {calls:0,declarations:0}
    }
  }

  // 开始遍历
  estraverse.traverse(ast,{
    enter:function(node){
      if(node.type === 'FunctionDeclaration') {
        addStatsEntry(node.id.name);
        functionsStats[node.id.name].declarations++; // 统计声明次数
      } else if(node.type === 'CallExpression' && node.callee.type=== 'Identifier'){
        addStatsEntry(node.callee.name);
        functionsStats[node.callee.name].calls++; // 统计调用次数
      }
    }
  });
  processResults(functionsStats);
}

function processResults(results) {
  for (var name in results) {
    if (results.hasOwnProperty(name)) {
      var stats = results[name];
      if (stats.declarations === 0) {
        console.log('函数', name, ':没有定义');
      } else if (stats.declarations > 1) {
        console.log('函数', name, ':重复定义');
      } else if (stats.calls === 0) {
        console.log('函数', name, ':定义了却没有被调用');
      }
    }
  }
}

// 处理参数,必须要有3个
if(process.argv.length < 3){
  console.log('用法:node analysis.js [target].js');
  process.exit(1);
}

// 获取入参,argv第1个参数是node,第二个参数是JS名字,第三个参数才是真正传入的参数
var filename = process.argv[2];
console.log('正在读取'+filename+'文件....');

console.log('开始分析代码');
var code = fs.readFileSync(filename);

analysis(code);
console.log("---分析完毕---");