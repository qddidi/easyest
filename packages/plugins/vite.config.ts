import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';
export default defineConfig({
    build: {
        //打包文件目录
        outDir: "es",
        rollupOptions: {

            input: ["index.ts"],
            output: [
                {
                    //打包格式
                    format: "es",
                    //打包后文件名
                    entryFileNames: "[name].mjs",
                    //让打包目录和我们目录对应
                    preserveModules: true,
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
    plugins: [dts({
        entryRoot: ".",
        outDir: ["./dist/types"]
    })

    ],
});
