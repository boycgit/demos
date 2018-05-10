var fs = require('fs');
var express = require('express');
var app = express();
var webpack = require('webpack');
var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var webpackDevMiddleware = require('webpack-dev-middleware');
var config = require('./webpack.config.js');
var compiler = webpack(config);

var webpackDevMiddlewareParam = {
    // options
    publicPath: '/dist',
    noInfo: false,
    quiet: false,

    stats: {
        chunks: false,
        colors: true,
        child: true
    }
};

var webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, webpackDevMiddlewareParam);

app.use(webpackDevMiddlewareInstance); // 应用针对 express 框架的 webpack 调试中间件

app.listen(3000, function(){
    console.log('server listen on 3000');
});


var once = true;

// 主页入口
app.get('/', function(req, res) {
  // 应用单入口插件
  res.send('hello~');
});

// 新增入口
app.get('/add', function(req, res) {
  // 应用单入口插件
  console.log('apply SingleEntryPlugin');
  compiler.apply(new SingleEntryPlugin(process.cwd(), './src/index2.js','index2'));

  once && webpackDevMiddlewareInstance.invalidate(); // 强制重新构建一次，不用调用多次，后续的触发由 webpack 自己 hot reload
  once = false; // 置 once 就是 false
  res.send('already apply SingleEntryPlugin');
});