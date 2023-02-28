# 组件开发

<br />
<br />

组件开发写在目录`components/src`下,比如`button`组件目录如下

```
-- components
  -- src
     -- button
        -- style 样式文件
        -- button.vue 组件主要逻辑
        -- index.ts 导出组件
     -- index.ts 导出全部组件
  -- index.ts 组件库入口文件

```

button.vue 开发示例

```vue
<template>
  <button class="ea-button" :class="buttonStyle"><slot /></button>
</template>

<script lang="ts" setup>
import "./style/index.less";
import { computed } from "vue";
//组件命名
defineOptions({ name: "ea-button" });
type ButtonProps = {
  type?: string;
  size?: string;
};
const buttonProps = defineProps<ButtonProps>();

const buttonStyle = computed(() => {
  return { [`ea-button--${buttonProps.type}`]: buttonProps.type };
});
</script>
```

导出组件示例(button/index.ts)

```js
import _Button from "./button.vue";
import { withInstall } from "@easyest/utils";
export const Button = withInstall(_Button);
export default Button;
```

导出全部组件(src/index.ts)

```js
export * from "./button";
export * from "./xx";
```

组件库入口文件(components/index.ts)

```js
import * as components from "./src/index";
export * from "./src/index";
import { App } from "vue";

export default {
  install: (app: App) => {
    for (let c in components) {
      app.use(components[c]);
    }
  },
};
```
