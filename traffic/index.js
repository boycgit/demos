var koa = require('koa');
var router = require('koa-router')();
var handlebars = require("koa-handlebars");
var app = koa();
var port = 3000;

// 使用handlerbars作为模板文件
app.use(handlebars({
  defaultLayout: "index"
}));

// 定义路由
router.get("/", function *(next) {
  yield this.render('index',{
    title:'Redux示例-交通灯',
    name:'交通灯示例'
  });
});


// 定义应用路由
router.get('app','/app/:name',function*(next){
  this.appName = this.params.name || 'index'; // 应用名字

  yield this.render('app/'+this.appName,{
    title:'应用',
    filename:this.appName
  });

})

// 定义demo路由
router.get('demo','/:name/:type', function *(next) {
  this.demoName = this.params.name || 'demo'; // 获取名称
  this.demoType = this.params.type; // 获取示例类型
  yield this.render(this.demoName + '/index',{
    title:'示例',
    filename:this.demoType
  });
});



// 启用路由
app
  .use(router.routes())
  .use(router.allowedMethods());

// 监听端口
app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  监听端口 %s. 请在浏览器里打开 http://localhost:%s/.", port, port)
  }
})