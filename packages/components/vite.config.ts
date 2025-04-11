import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { cssInsertPlugin } from "vite-plugins-easyest"
export default defineConfig({
    build: {
        //打包文件目录
        outDir: "es",
        cssCodeSplit: true,
        //minify: false,
        rollupOptions: {
            //忽略打包vue包
            external: ["vue", "element-plus"],
            input: ["index.ts"],
            output: [
                {
                    //打包格式
                    format: "es",
                    //打包后文件名
                    entryFileNames: "[name].mjs",
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    //使用命名导出模式，以允许外部工具使用 import 语句从你的库中导入特定的函数、类或变量。
                    exports: "named",
                    //配置打包根目录
                    dir: "./dist/es",

                },
                {
                    //打包格式
                    format: "cjs",
                    //打包后文件名
                    entryFileNames: "[name].js",
                    //让打包目录和我们目录对应
                    preserveModules: true,
                    exports: "named",
                    //配置打包根目录
                    dir: "./dist/lib",
                },
            ],
        },
        lib: {
            entry: "./index.ts",
        },
    },
    plugins: [vue(), dts({
        entryRoot: ".",
        outDir: ["./dist/types"],
        copyDtsFiles: true,
    }), cssInsertPlugin()
    ],
});
