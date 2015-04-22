# Nodejs + Selenium 搭配测试用例

## 环境

系统：`Win7`

程序语言：`Nodejs`

浏览器：`Chrome`

## 效果演示



## 使用步骤

**STEP 1**：Chrome适配器

到官网下载Chrome适配器：https://sites.google.com/a/chromium.org/chromedriver/downloads。
选择最新的就可以。


**STEP 2**：设置环境变量

适配器下载好了还不能马上使用，要将这个适配器设置到环境变量`PATH`中去。

通过在命令行输入`chromedriver`验证是否正确配置了：

![设置环境变量](http://ww3.sinaimg.cn/mw690/514b710agw1eremi52c1ej20n904cdfq.jpg)


**STEP 3**: 安装依赖

下载本示例，并安装依赖
```shell
npm install
```

并确保已经安装`Mocha`，如果没有安装Mocha，请`npm install -g mocha`

**STEP 4**: 修改用户名和密码

打开`login-verify.js`，找到以下两个变量，修改成自己的有户名和密码即可：
```javascript
var usrname = 'xxx';
var pwd = "xxxx";
```

**STEP 5**: 运行测试

在命令窗口中输入：
```shell
mocha login-verify.js
```

如果一切正常的话，将弹出一个浏览器，然后模拟用户登录效果；于此同时在命令行窗口获得下面的测试结果：

![运行结果](http://ww4.sinaimg.cn/mw690/514b710agw1eremsktc42j20is06oglh.jpg)
