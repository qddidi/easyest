# 全局组件引入

<br />
<br />

> 如果你的组件库要支持全局组件的提示,可以在文件 src/components.d.ts 中写入我们开发的组件

```js
import * as components from "./index";
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    EaButton: typeof components.Button;
    EaIcon: typeof components.Icon;
  }
}
export {};

```

> 同时在使用我们组件库的时候需要用户在`tsconfig.json`中配置`types:["easyest/lib/src/components"]`当然这里根据你的组件库命名决定

```js
{
  "compilerOptions": {
    ...
    "types": ["easyest/lib/src/components"]
  }
}
```
