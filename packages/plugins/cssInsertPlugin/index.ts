
const cssInsertPlugin = () => {
    return {
        name: "css-insert",
        generateBundle(options: any, bundle: any) {
            const isCJS = options.format === 'cjs';
            const keys = Object.keys(bundle);

            keys.forEach((key) => {
                const chunk = bundle[key];
                // 仅当 CSS 文件存在时处理
                if (chunk.fileName.endsWith('style/index.css')) {
                    const importStatement = isCJS
                        ? `require("./style/index.css")`
                        : `import "./style/index.css"`;
                    const importGenerate = isCJS
                        ? `index.vue.js`
                        : `index.vue.mjs`;
                    const vuePath = chunk.fileName.replace('style/index.css', importGenerate);
                    if (bundle?.[vuePath]) {
                        bundle[vuePath].code = `${importStatement};\n${bundle[vuePath].code}`;
                    }

                }

            });
        }
    };
};

export { cssInsertPlugin };