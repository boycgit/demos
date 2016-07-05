var fs = require('fs');
var babel = require('babel-core');

var moriscript = require('./moriscript');

var analysis = function(src){

  // 使用我们自定义的插件,转换代码
  var out = babel.transform(src, {
    plugins: [moriscript]
  });

  // 将转换之后的代码打印到屏幕上
  console.log(out.code);
}

// 处理参数,必须要有3个
if(process.argv.length < 3){
  console.log('用法:node mori-gen.js [target].js');
  process.exit(1);
}

// 获取入参,argv第1个参数是node,第二个参数是JS名字,第三个参数才是真正传入的参数
var filename = process.argv[2];
console.log('正在读取'+filename+'文件....');

console.log('开始转换代码');
var code = fs.readFileSync(filename);

analysis(code);
console.log("---转换完毕---");

