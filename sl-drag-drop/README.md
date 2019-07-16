## 概览

本示例改写自 [Drag n Drop with React hooks](https://codesandbox.io/s/3x04qwj6vm)

使用 React hooks 实现 HTML5 的 drag&drop 能力

## 如何本地开发？

### 本地调试


首先从 git 仓库拉取代码，安装依赖项：
```shell
git clone https://github.com/one-gourd/sl-drag-drop.git

npm install

## 安装 peerDependencies 依赖包
npm install ide-lib-utils@0.x ide-lib-base-component@0.x ide-lib-engine@0.x ette@0.x ette-proxy@0.x ette-router@0.x antd@3.x mobx@4.x mobx-react@5.x mobx-react-lite@1.x mobx-state-tree@3.10.x react@16.x styled-components@4.x.x react-dom@16.x
```

需要安装 `ide-cli` 工具： `npm install -g ide-component-cli`

运行以下命令后，访问 demo 地址： http://localhost:9000
```shell
npm run dev
```

也可访问 [storybook](https://github.com/storybooks/storybook) 参考具体的使用案例：http://localhost:9001/
```shell
npm run storybook
```


### 打包发布

普通的 npm 发布即可，记得发布前需要手动打包：

```shell
npm run build && npm publish
```


