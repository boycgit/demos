## 使用 Node.js 实现 Websocket 服务

该示例用于展示如何使用 Node.js 实现 Websocket 协议，在不利用第三方 Websocket 库的前提下使用基础的 Node.js 提供简单的 Websocket 服务；

Websocket 协议的具体实现代码全在 [websocket.js](./websocket.js) 文件中，整体实现大约 200 多行；（除去调试用的 log 语句以及注释代码）

具体的实现原理以及实现过程，请参考我写的总结文章 [Node.js -  200 多行代码实现 Websocket 协议](https://segmentfault.com/a/1190000016467409)


## 如何运行

切换到当前目录下，执行：

```js
node index.js
```
将会在 http://127.0.0.1:3000 创建服务。

这里的 index.js 文件作用是调用我们刚写的 [websocket.js](./websocket.js)，当监听到 `update` 事件后就开启 websocket 服务；

为了演示，我们仅仅是监听两类事件：
 - `data` 事件：当用户通过 ws 客户端向本服务器发送数据消息，服务器接收到消息后会打印出来；同时给客户端发送内容为 **good job** 的消息；
 - `close` 事件：当客户端发送关闭消息、或者服务器主动关闭连接后，会打印出 close 事件的 code 和 reason （客户端发送过来的 close 事件不会有 code 或者 reason）;


运行服务之后，打开控制台就能看到效果：

![demo](https://ws2.sinaimg.cn/large/006tNbRwgy1fv70a9e8adg30hs0fuqrz.gif)

动图中浏览器 console 所执行的 js 代码步骤如下：

 1. **先建立连接**：
```js
var ws = new WebSocket("ws://127.0.0.1:3000");
ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
};
```

 2. **然后发送消息**：（注意一定要在建立连接之后再执行该语句，否则发不出消息的）
```js
ws.send('hello world'); 
```

## 保持心跳

如果建立连接之后，在一定的时间内没有任何数据交互，浏览器端会主动关闭 ws 连接；

不过有些场景，客户端、服务端虽然长时间没有数据往来，但仍需要保持连接。这个时候，可以采用心跳来实现 —— 通过服务器定时地向浏览器发送 ping 消息就可以（反过来也可行的，让浏览器定时发 ping 消息）。

这里的实现我们也考虑到这个场景了，在初始化 ws 之后，调用 `keepLive` 方法就可以：

```js
var ws = new WebSocket(req, socket, upgradeHead);
ws.keepLive(); 
```

keepLive 的原理也很简单，就是每隔 N (默认为 45) 秒发送 ping 控制帧。


