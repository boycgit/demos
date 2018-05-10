
## 0. 多入口 (复习)

webpack 的优势不言而喻，因此在实际应用中我们也常常使用它调试 **多入口** 应用，所谓 **多入口** 是指多个HTML页面会使用多个入口文件，在官方教程 [MULTIPLE ENTRY POINTS](https://webpack.github.io/docs/multiple-entry-points.html) 介绍了如何配置：

```js
{
    entry: {
        a: "./a",
        b: "./b",
        c: ["./c", "./d"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].entry.js"
    }
}
```

这里指定了 3 个入口文件，打包之后分别会在 **dist** 文件夹中生成 3 个打包之后的 js 文件：**a.entry.js**、**b.entry.js**、**c.entry.js**，可被至少 3 个不同的 HTML 页面直接引用；

上述是最基本的使用，实际中还可以使用 [multiple-commons-chunks](https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks) 等提高打包的速度、性能；


## 1. 动态 entry 的场景

像上面那样直接应用 Webpack 的多入口功能，在普通的工程项目中并不存在什么问题，还简单高效；

然而如果你使用 Webpack 构建较大型的页面系统，遂着业务的扩大，入口的数量会逐渐增多，**纵使每个入口文件都很小，在调试的时候等所有的入口文件都 ready 所耗费的时间也是非常巨大的，让用户等待太久显然很不友好**；

用户等待时间随着模块数量而线性增加（见下图）：

![等待时间随着模块数量的增加而线性增加](https://img.alicdn.com/tps/TB19b9tOpXXXXbkXpXXXXXXXXXX-1462-154.png)

假设业务模块有100个，而当前自己仅仅需要调试 A 模块，如果使用默认的多模块入口方式，用户 **必须等这100个模块启动之后才能调试 A 模块**，很明显这会让用户抓狂；

比较合理的做法是，无论当前用户模块目录下有多少个模块，默认都只其构建一个模块，当用户想要调试另外一个模块的时候，再动态添加一个 entry 到 webpack 系统中，**这就减少了用户等待的时间，提高了调试时的用户体验**；

![使用动态entry](https://img.alicdn.com/tps/TB15nCzOpXXXXcwXFXXXXXXXXXX-1462-231.png)


## 2. 实现动态 entry 的原理

目前业界并没有现成的动态 entry 方案，需要自己分析 webpack 源码找到解决方案；（如果不清楚 webpack 流程的，可以参考 @七珏 同学的 [细说webpack之流程篇](http://www.atatech.org/articles/62266)）


2.1、先分析 webpack 源码中处理单入口的 entry 情况，在 `WebpackOptionsApply.js` 有：

![WebpackOptionsApply](https://img.alicdn.com/tps/TB1rxSxOpXXXXb4XXXXXXXXXXXX-957-109.png)

  - 这里首先是加载 **EntryOptionPlugin.js** 然后触发添加 entry 入口
  - 然后触发 **entry-option** 事件节点，将 `context` 和 `entry` 作为参数传入


2.2、 继续看 **EntryOptionPlugin.js** 文件，在 **entry-option** 事件节点中调用 `SingleEntryPlugin` 构造函数构建单入口模块：

![构建单入口模块](https://img.alicdn.com/tps/TB1ga9iOpXXXXa6aXXXXXXXXXXX-604-357.png)

--------

我们可以依样画葫芦，利用官方的 `SingleEntryPlugin` 的对象来完成动态添加入口的功能。
 1. 我们像平常那样创建单入口文件配置文件
 2. 依据 `webpack(config)` 获取 **compiler** 实例；
 3. 然后调用 `compiler.apply(new SingleEntryPlugin(process.cwd(),...);` 新增一个构建入口
 4. 通知 webpack 让新入口生效



## 3. 示例

> 本节的代码放在仓库 [dynamic-entry](http://gitlab.alibaba-inc.com/lastep/dynamic-entry) 中，可以到下载获取

这里我们以 express 框架为例，讲解如何实现动态 entry ；具体操作步骤如下：
 1. 下载 dynamic-entry 代码：`git clone http://gitlab.alibaba-inc.com/lastep/dynamic-entry.git`
 2. `cd dynamic-entry && tnpm install && node server.js`
 3. 启动 web 服务（可访问 http://localhost:3000 ），默认只会构建一个 **src/index1.js**
![默认构建单个](http://ww3.sinaimg.cn/large/006tNbRwgw1fa0ocmyu8pj30ez0340sx.jpg)

 4. 然后访问 `http://localhost:3000/add`，再去看命令行，你会发现现在会构建 **src/index1.js** 和 **src/index2.js** 这两个文件，这就是所谓的动态 entry   
![动态entry](http://ww4.sinaimg.cn/large/006tNbRwgw1fa0odz4c2dj30f0041t92.jpg)

简要分析一下源码，在 **server.js** 中：

```
...
var SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
var webpackDevMiddleware = require('webpack-dev-middleware');

...

var webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, webpackDevMiddlewareParam);
app.use(webpackDevMiddlewareInstance); // 应用针对 express 框架的 webpack 调试中间件

...

var once = true;
// 新增入口
app.get('/add', function(req, res) {
  // 应用单入口插件
  console.log('apply SingleEntryPlugin');
  compiler.apply(new SingleEntryPlugin(process.cwd(), './src/index2.js','index2'));
  once && webpackDevMiddlewareInstance.invalidate(); // 强制重新构建一次，不用调用多次，后续的触发由webpack自己 hot reload
  once = false; // 置 once 就是 false
  res.send('already apply SingleEntryPlugin');
});
```

  - 这里用到了 [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) 模块，是 webpack 调试用的 express 中间件，它提供调试时候将构建的文件输出到文件系统，可以让用户访问获取；
  - 注册 `/add` 路由，当用户访问此页面的时候会调用 `compiler.apply` **新增一个构建入口**
  - 调用 `webpackDevMiddlewareInstance.invalidate()` **强制 webpack 重新构建一次**，这个方法只需要调用1次（因此这儿由 `once` 变量进行控制），后续的触发由webpack自己 hot reload

从上面的过程可见，动态 entry 实施的过程是借鉴 webpack 自身的 **SingleEntryPlugin** 插件进行的，在可靠性方面有很大的保障；其余的代码则是借用现有的 express 中间件获取所需要的 `compiler` 等对象协助此过程；

## 4. 总结

目前动态 entry 之后已经运用在若干个内部构建器中，在应用动态 entry 之后，明显地改善了用户体验；

此篇文章希望能给有类似场景的同学提供帮助；

## 5. 参考文章
 - [MULTIPLE ENTRY POINTS](https://webpack.github.io/docs/multiple-entry-points.html) 
 - [细说webpack之流程篇](http://www.atatech.org/articles/62266)
 - [webpack 源码解析](https://lihuanghe.github.io/2016/05/30/webpack-source-analyse.html)