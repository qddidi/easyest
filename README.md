## 使用 glup 打包组件库并实现按需加载

当我们使用 Vite 库模式打包的时候,vite 会将样式文件全部打包到同一个文件中,这样的话我们每次都要全量引入所有样式文件做不到按需引入的效果。所以打包的时候我们可以不让 vite 打包样式文件,样式文件将使用 gulp 进行打包。那么本篇文章将介绍如何使用 gulp 打包样式文件,以及如何按需加载样式文件。

## 自动按需引入插件

现在很多组件库的按需引入都是借助插件来解决的,比如`ElementPlus`是使用`unplugin-vue-components`和`unplugin-auto-import`,这两个插件可以实现

```js
import { Button } from "easyest";

//相当于
import "easyest/es/src/button/style/index.css";
import "easyest/es/src/button/index.mjs";
```

从而实现按需引入,这里不再过多展开这些插件的使用,因为本篇文章的重点不在这里,感兴趣的可以直接去查询使用方式[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)

## 删除打包文件

我们都知道,在打包之前是需要将前面打包的文件删除的,所以需要先写一个删除函数。在此之前,我们先在 components 新建一个 script 文件夹用于存放我们的脚本相关内容,script 下的 build 文件夹里的内容则是本篇文章要介绍的打包相关内容。

在 script/utils 中新建 paths.ts 用于维护组件库路径,记得先安装

```
pnpm add @types/node -D -w
```

```js
import { resolve } from "path";

//组件库根目录
export const componentPath = resolve(__dirname, "../../");

//pkg根目录
export const pkgPath = resolve(__dirname, "../../../");
```

删除打包目录函数可以放在 bulid/utils 中的 delpath.ts,注意这里因为打包后的 easyest 包是我们最终要发布的包,所以我们需要将`package.json`和`README.md`保留下来

```js
import fs from "fs";
import { resolve } from "path";
import { pkgPath } from "./paths";
//保留的文件
const stayFile = ["package.json", "README.md"];

const delPath = async (path: string) => {
  let files: string[] = [];

  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);

    files.forEach(async (file) => {
      let curPath = resolve(path, file);

      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        if (file != "node_modules") await delPath(curPath);
      } else {
        // delete file
        if (!stayFile.includes(file)) {
          fs.unlinkSync(curPath);
        }
      }
    });

    if (path != `${pkgPath}/easyest`) fs.rmdirSync(path);
  }
};
export default delPath;
```

## 使用 gulp

我们需要使用 ts 以及新的 es6 语法，而 gulp 是不支持的，所以我们需要安装一些依赖使得 gulp 支持这些,其中 sucras 让我们执行 gulp 可以使用最新语法并且支持 ts

```
pnpm i gulp @types/gulp sucrase -D -w
```

在 build/index.ts 来执行删除流程

```js
import delPath from "../utils/delpath";
import { series, parallel } from "gulp";
import { pkgPath } from "../utils/paths";
//删除easyest

export const removeDist = () => {
  return delPath(`${pkgPath}/easyest`);
};

export default series(async () => removeDist());
```

在根目录 easyest/package.json 添加脚本

```
  "scripts": {
    "build:easyest": "gulp -f packages/components/script/build/index.ts"
  },
```

根目录下执行`pnpm run build:easyest`就会发现 easyest 下的文件被删除了

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/027589fe7c3047f3b39622a647c4140b~tplv-k3u1fbpfcp-watermark.image?)

删除完之后就可以开始打包样式了

## gulp 打包样式

因为我们用的是 less 写的样式,所以需要安装`gulp-less`,同时在安装一个自动补全 css 前缀插件`gulp-autoprefixer`以及它们对应的上面文件

```
pnpm add gulp-less @types/gulp-less gulp-autoprefixer @types/gulp-autoprefixer -D -w
```

然后写一个打包样式的函数,这里使用到了 gulp 的`dest`和`src`函数,不知道什么意思的乐意看上一篇文章 gulp 的介绍

```js
//打包样式
export const buildStyle = () => {
  return src(`${componentPath}/src/**/style/**.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(dest(`${pkgPath}/easyest/lib/src`))
    .pipe(dest(`${pkgPath}/easyest/es/src`));
};
```

## 打包组件

最后再写一个打包组件的函数,这里需要写一个执行命令的工具函数,在 utils/run.ts

```js
import { spawn } from "child_process";

export default async (command: string, path: string) => {
  //cmd表示命令，args代表参数，如 rm -rf  rm就是命令，-rf就为参数
  const [cmd, ...args] = command.split(" ");
  return new Promise((resolve, reject) => {
    const app = spawn(cmd, args, {
      cwd: path, //执行命令的路径
      stdio: "inherit", //输出共享给父进程
      shell: true, //mac不需要开启，windows下git base需要开启支持
    });
    //执行完毕关闭并resolve
    app.on("close", resolve);
  });
};
```

然后引入 run 函数

```js
//打包组件
export const buildComponent = async () => {
  run("pnpm run build", componentPath);
};
```

因为打包样式和打包组件可以并行,所以最后`build/index.ts`为

```js
import delPath from "../utils/delpath";
import { series, parallel, src, dest } from "gulp";
import { pkgPath, componentPath } from "../utils/paths";
import less from "gulp-less";
import autoprefixer from "gulp-autoprefixer";
import run from "../utils/run";
//删除dist

export const removeDist = () => {
  return delPath(`${pkgPath}/easyest`);
};

//打包样式
export const buildStyle = () => {
  return src(`${componentPath}/src/**/style/**.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(dest(`${pkgPath}/easyest/lib/src`))
    .pipe(dest(`${pkgPath}/easyest/es/src`));
};

//打包组件
export const buildComponent = async () => {
  run("pnpm run build", componentPath);
};
export default series(
  async () => removeDist(),
  parallel(
    async () => buildStyle(),
    async () => buildComponent()
  )
);
```

最后 vite 打包的时候忽略 less 文件,components/vite.config.ts

```
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import DefineOptions from "unplugin-vue-define-options/vite";
export default defineConfig({
  build: {
    //打包文件目录
    outDir: "es",
    //压缩
    //minify: false,
    rollupOptions: {
      //忽略打包vue和.less文件
      external: ["vue", /\.less/],
      ...
  }

});

```

为了更好的看打包后的效果,我们可以再写一个简单的 Icon 组件,目录如下

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f37bca594ed4f7ba505a4d55a5c2cb4~tplv-k3u1fbpfcp-watermark.image?)

最后根目录执行`pnpm run build`,即可完成打包

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40e1c9de9f7442a09bc9e4a38b3c3a2c~tplv-k3u1fbpfcp-watermark.image?)

由于 vite 打包忽略了 less 文件打包,所以打包后的文件遇到.less 文件的引入会自动跳过,所以引入代码没变

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/003a6183179f41fd91de46f1549c9810~tplv-k3u1fbpfcp-watermark.image?)

但是我们已经将 less 文件打包成 css 文件了,所以我们需要将代码中的`.less`换成`.css`

在 components/vite.config.ts 中的 plugins 中新增

```js
 plugins: [
    vue(),
    DefineOptions(),
    dts({
      entryRoot: "./src",
      outputDir: ["../easyest/es/src", "../easyest/lib/src"],
      //指定使用的tsconfig.json为我们整个项目根目录下,如果不配置,你也可以在components下新建tsconfig.json
      tsConfigFilePath: "../../tsconfig.json",
    }),
    {
      name: "style",
      generateBundle(config, bundle) {
        //这里可以获取打包后的文件目录以及代码code
        const keys = Object.keys(bundle);

        for (const key of keys) {
          const bundler: any = bundle[key as any];
          //rollup内置方法,将所有输出文件code中的.less换成.css,因为我们当时没有打包less文件

          this.emitFile({
            type: "asset",
            fileName: key, //文件名名不变
            source: bundler.code.replace(/\.less/g, ".css"),
          });
        }
      },
    },
  ],
```

此时执行`pnpm run build:easyest`,然后再看打包后文件引入

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3192432089994bf08f5736e9051c47a3~tplv-k3u1fbpfcp-watermark.image?)

此时`.less`已经被替换成了`.css`,打包完毕,接下来要做的就是发布了,下篇文章将介绍如何发布一个组件库,欢迎点赞+关注!
