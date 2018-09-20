var http = require('http');
var WebSocket = require('./websocket');
// HTTP服务器部分
var server = http.createServer(function(req, res) {
  res.end('websocket test\r\n');
});

console.log('starting...');

// Upgrade请求处理
server.on('upgrade', callback);

function callback(req, socket, upgradeHead) {
  var ws = new WebSocket(req, socket, upgradeHead);
  // ws.keepLive(); // 保持心跳连接，否则一般经过一定的时间没有数据交互，浏览器端会主动关闭 ws 链接
  ws.on('data', function(opcode, payload) {
    console.log('receive data:', opcode, payload.length);
    ws.send('good job');
  });


  ws.on('close', function(code, reason) {
    console.log('close:', code, reason);
  });

}

server.listen(3000);
