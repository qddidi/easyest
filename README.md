本篇文章将介绍如何在组件库中开发一个组件,其中包括

- 如何本地实时调试组件
- 如何让组件库支持全局引入
- 如何在 setup 语法糖下给组件命名
- 如何开发一个组件

## 目录结构

在`packages`目录下新建`components`和`utils`两个包,其中`components`就是我们组件存放的位置,而`utils`包则是存放一些公共的方法之类的。分别在两个文件下执行`pnpm init`,并将它们的包名改为`@easyest/components`和`@easyest/utils`

```
{
  "name": "@easyest/components",
  "version": "1.0.0",
  "description": "",
  "main": "index.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

在`components`目录下新建`src`目录用于存放所有组件,最终目录结构为

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e98805dab4b14132918f33c368128c3d~tplv-k3u1fbpfcp-watermark.image?)

当然这只是目前的结构,后面会进行调整,因为还有样式,测试等文件目录

## 测试组件

在`button.vue`文件中写一个简单的按钮

```js
<template>
  <button>测试按钮</button>
</template>
```

然后在`button/index.ts`将其导出

```js
import Button from "./button.vue";
export { Button };
export default Button;
```

因为我们后面会有很多组件的,比如 Icon,Upload,Select 等,所以我们需要在`components/src/index.ts`集中导出所有组件

```js
export * from "./button";
```

最后在`components/index.ts`导出所有组件提供给外部使用

```js
export * from "./src/index";
```

接下来我们在上篇文章中搭建的 play 项目中进行一个测试,首先在 paly 项目中本地安装`@easyest/components`(组件库包名,后续发布可以自己修改名字)

```
pnpm add @easyest/components
```

然后再`app.vue`中引用`Button`

```js
<template>
  <div>
    <Button />
  </div>
</template>
<script lang="ts" setup>
import { Button } from "@easyest/components";
</script>
```

启动项目便可以看到 Button 组件了,并且修改 Button 组件也会有热更新的效果

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5124c876ded9435db318f228a48eeef0~tplv-k3u1fbpfcp-watermark.image?)

## app.use 全局挂载组件

有的时候我们使用组件的时候想要直直接使用 app.use()挂载整个组件库,其实使用 app.use()的时候它会调用传入参数的 install 方法,因此首先我们给每个组件添加一个 install 方法,然后再导出整个组件库,我们将 button/index.ts 改为

```js
import _Button from "./button.vue";
import type { App, Plugin } from "vue";
type SFCWithInstall<T> = T & Plugin;
const withInstall = <T>(comp: T) => {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    const name = (comp as any).name;
    //注册组件
    app.component(name, comp as SFCWithInstall<T>);
  };
  return comp as SFCWithInstall<T>;
};
export const Button = withInstall(_Button);
export default Button;

```

components/index.ts 修改为

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

此时我们需要给`button.vue`一个`name:ea-button`好在全局挂载的时候作为组件名使用

```html
<template>
  <button>测试按钮</button>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    name: "ea-button",
    setup() {
      return {};
    },
  });
</script>
```

这时候在`play/main.ts`中全局挂载组件库

```js
import { createApp } from "vue";
import App from "./app.vue";
import easyest from "@easyest/components";
const app = createApp(App);
app.use(easyest);
app.mount("#app");
```

app.vue 中使用`ea-button`组件,然后就会发现组件库挂载成功了

```js
<template>
  <div>
    <ea-button />
  </div>
</template>
<script lang="ts" setup></script>

```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5124c876ded9435db318f228a48eeef0~tplv-k3u1fbpfcp-watermark.image?)

## 使用 setup 语法

我们都知道,使用 setup 语法进行 Vue 组件的开发是非常方便的,但是会有一个问题,就是当我们使用 setup 语法时该怎么给组件命名呢?

其实有两种解决方法,一个是再写一个`script`标签命名,比如`input.vue`

```js
<template>
  <button>测试按钮</button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ea-button"
});
</script>
<script lang="ts" setup></script>

```

这种方式显然是比较奇怪的

第二种方式就是使用插件`unplugin-vue-define-options`解决,在测试环境中,我们需要把它配置在 play 项目中

首先全局安装`unplugin-vue-define-options`,因为这个插件后面打包配置也需要用到,注意安装版本,最新版本安装会提示错误

```
pnpm add unplugin-vue-define-options@0.12.2  -D -w
```

然后在`play/vite.config.ts`引入该插件

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import DefineOptions from "unplugin-vue-define-options/vite";
export default defineConfig({
  plugins: [vue(), DefineOptions()],
});
```

此时我们便可以直接使用`defineOptions`函数定义组件名了

```js
<template>
  <button>测试按钮</button>
</template>

<script lang="ts" setup>
defineOptions({ name: "ea-button" });
</script>

```

## 组件开发

我们都知道一个组件需要接受一些参数来实现不同效果,比如 Button 组件就需要接收`type`、`size`、`round`等属性,这里我们暂且只接收一个属性`type`来开发一个简单的 Button 组件。

我们可以根据传入的不同`type`来赋予 Button 组件不同类名

```js
// button.vue
<template>
  <button class="ea-button" :class="buttonStyle"><slot /></button>
</template>

<script lang="ts" setup>
import "./style/index.less";
import { computed } from "vue";
defineOptions({ name: "ea-button" });
type ButtonProps = {
  type?: string;
};
const buttonProps = defineProps<ButtonProps>();

const buttonStyle = computed(() => {
  return { [`ea-button--${buttonProps.type}`]: buttonProps.type };
});
</script>

```

这里引入了样式文件,在 button 目录下新建 style 文件夹来存放 Button 组件的样式

`src/button/style/index.less`如下

```css
.ea-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.ea-button.ea-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;

  &:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
}
```

此时在 app.vue 中引入 Button 组件就可以看到想要的效果了

```js
<template>
  <div>
    <Button type="primary">主要按钮</Button>
  </div>
</template>
<script lang="ts" setup>
import { Button } from "@easyest/components";
</script>

```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/166cc240ca7e4975a73a71ec1d0a3e8d~tplv-k3u1fbpfcp-watermark.image?)

由于组件的开发可能涉及的内容比较多,这里就不详细展开,但是大致情况就是这样,后续会专门对一些常用组件进行开发。
