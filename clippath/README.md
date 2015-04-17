## Clip-path动画

使用 Clip-path 制造的动画，其效果过渡较为好看。

<video src="##" controls="controls">
your browser does not support the video tag
</video>

### 源代码

入口JS文件： `app/script/`

### 打包

先执行 `npm install`

> 如果提示错误，请先更新依赖 `npm update`

在当前目录执行 `gulp` 即可，配置项在`gulpfile.js`中定义。

打包之后会生成目标文件夹`dist`


### 查看

启动本地服务器之后，访问`app/clippath.html`文件即可

编译之后会生成`dist`文件夹，也可以访问`dist/clippath.html`，效果是一样的