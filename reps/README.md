## 文件递归替换

简单的文件查找和替换命令行

业务场景：要将目录下所有的文件（js、CSS等等）中的'a.com'替换成'b.net'等。


思路是这样的：
 1. 首先将根据目标目录，生成镜像文件夹结构；此时只有文件夹，没有文件；
 2. 遍历这些文件，读取到内存中
 3. 使用[replace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)方法，替换字符串
 4. 输出到目标文件。


### 如何使用？

命令行格式：
```shell
reps origin [dest] [--old oldStr] [--new newStr] [--reg]
```
或：
```shell
reps origin dest --o oldStr --n newStr  [-r]
```

【参数解释】

 - `origin`：**必须**。表示要处理文件的文件夹
 - `dest`：**可选**。如果不传目标目录`dest`，则表示就地替换；
 - `--old -o`：**可选**。如果不传，则不替换；
 - `--new -n`: **可选**，默认值是空字符。
 - `--reg -r`: **可选**，表示是否是按正则方式匹配

`reps origin`：直接返回。

`reps origin dest` : 相当于递归拷贝文件夹，不作替换

`reps origin -o "a.com"` ： 相当于原地去除文件中所有的 `a.com`字样


【示例】

定位到`ori`所在的目录，运行命令：
```shell
reps tests/ori tests/dest --old a.com --new b.net
```
该语句的含义是，将`tests/ori`中所有文件内的'a.com'字符替换成'b.net'后，镜像到 `tests/dest` 目录（该目录如果不存在会自动创建）中，而原来的`tests/ori`文件夹内容不变。看上去，相当于将 文件夹 `ori` 重命名成`dest`。


【如何使用本示例】

 1. 切换到`bin/`目录下
 2. 正则示例：`node reps.js ../tests/ori ../go  -o '\d{2,3}' -n 'jscon' -r` 将会使用正则匹配；
 3. 非正则匹配示例：`node reps.js ../tests/ori ./go  -o 'jscon' -n 'boyc'`

