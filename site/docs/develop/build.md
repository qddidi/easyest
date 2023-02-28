# 组件打包与发布

<br />
<br />

## 打包

> 执行`pnpm run easyest:build`即可完成打包,打包后的文件在目录`packages/easyest下`。当然如果你想修改命令脚本的话,可以在 easyest/package.json 中的 script 字段中修改

## 发布

发布之前你需要将项目关联一个 git 仓库,并且提交所有修改后执行`pnpm run publish:easyest`,此时会有一些提示如选择如何提升版本,是否发布,是否加个 tag 等等

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8e1b7c40484f49c999ba492303e2855c~tplv-k3u1fbpfcp-watermark.image?)

当然,如果你没有登录 npm 的话,会先让你登录 npm。注意发布之前要将`packages/easyest`下 package.json 中 name 字段改成自己组件库的名字
