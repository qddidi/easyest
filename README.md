# Easyest 组件库

## 介绍

Easyest 是面向企业级的 Vue3 组件库解决方案，基于 Monorepo 架构与 Vite6 构建，提供开箱即用的组件开发套件。

## 特性

- 使用 TypeScript 开发
- Vite 6 构建工具
- 完善的类型提示
- 支持组件按需导入

## 开发构建

```bash
# 安装pnpm
npm install pnpm -g

# 安装依赖
pnpm install

# 启动开发环境
pnpm play:dev

# 构建组件库
pnpm build:lib

# 发布组件库(支持版本自增，默认是patch)
pnpm publish:lib components

# 发布组件库(指定patch major minor版本)
pnpm publish:lib components patch(可选)

# 发布其它包如plugins
pnpm publish:lib plugins patch(可选)

# 发布所有包
pnpm publish:lib all patch(可选)

```

## 引入外部依赖

如需引入外部依赖,需要在`components/vite.config.ts`文件中配置`external`属性,例如:

```js
rollupOptions: {
  //忽略打包
  external: ["vue", "element-plus"];
}
```

这样就不会进行二次打包,否则会出现其它错误问题

## 本地开发

组件开发在 `packages/components/src` 目录下,请严格按照示例目录进行开发,如果需要本地测试需要将`packages/components/package.json`中的

```js
  {
    "main": "./dist/lib/index.js",
    "module": "./dist/es/index.mjs",
    "types": "./dist/types/index.d.ts",
  }
```

修改为指向打包前的文件

```js
 {
  "main": "index.ts",
  //下面两个注掉
  //"module": "./src/index.mjs",
  //"types": "./src/index.d.ts",
 }
```

## 组件库使用(发布成功后)

```bash
# 安装组件库
npm install easyest
```

```js
//按需引入组件
import { Button } from "easyest";

//全局引入组件(main.ts)
import { createApp } from "vue";
import App from "./app.vue";
import easyestplus from "easyestplus";
const app = createApp(App);
app.use(easyestplus);
app.mount("#app");

//使用全局组件
<EButton a="1" />;
```

## 全局导入类型提示

如需全局组件提示,需要配置项目`tsconfig.json`文件,添加如下配置

```json
 "compilerOptions": {
    "types": ["easyestplus/dist/types/components"],
 }
```

## 贡献指南

1. Fork 仓库 (https://github.com/qddidi/easyest)
2. 创建 feature 分支
3. 提交代码变更
4. 发起 Pull Request
