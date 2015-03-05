## 视差卷轴

![效果图](https://lh3.googleusercontent.com/-ln9_cU20UII/VPgpGY2xDtI/AAAAAAAACU4/hMNZlJVcHGw/s144/parallax.JPG)


使用CommonJS方式组织代码，由于使用require方式，因此要查看代码需启动本地服务器。


### 源代码

入口JS文件： app/script/

### 打包

先执行 `npm install`

> 如果提示错误，请先更新依赖 `npm update`

在当前目录执行 `gulp` 即可，配置项在`gulpfile.js`中定义。

打包之后会生成目标文件夹`dist`


### 查看

启动本地服务器之后，访问`app/welcome.html`文件即可

编译之后会生成`dist`文件夹，也可以访问`dist/welcome.html`，效果是一样的


