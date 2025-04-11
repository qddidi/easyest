import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import semver from 'semver';
import { execSync } from 'child_process';

// 获取当前文件目录路径 (ESM 模块规范写法)
const __dirname = dirname(fileURLToPath(import.meta.url));

// 定义版本升级类型
type ReleaseType = 'major' | 'minor' | 'patch';

// 定义 package.json 文件结构接口
interface Package {
    name: string;
    version: string;
    [key: string]: any;  // 允许其他任意属性
}

// 配置需要版本控制的包路径,可以根据实际情况扩展
const PACKAGE_PATHS = {
    components: join(__dirname, '../components/package.json'), // 组件库包
    plugins: join(__dirname, '../plugins/package.json')        // 插件包
} as const;

// 定义合法的包名称类型
type PackageName = keyof typeof PACKAGE_PATHS | 'all';

/**
 * 版本更新核心逻辑
 * @param pkgName - 要更新的包名或'all'更新全部
 * @param releaseType - 版本升级类型
 */
function updateVersion(pkgName: PackageName, releaseType: ReleaseType = 'patch'): void {
    // 确定要更新的目标包路径
    const targets = pkgName === 'all'
        ? Object.values(PACKAGE_PATHS)   // 全部包
        : [PACKAGE_PATHS[pkgName]];      // 指定单个包

    // 遍历处理每个包
    targets.forEach(pkgPath => {
        const pkg: Package = JSON.parse(readFileSync(pkgPath, 'utf8'));
        const newVersion = semver.inc(pkg.version, releaseType);

        if (!newVersion) {
            throw new Error(`Invalid version: ${pkg.version}`);
        }

        const updatedPkg = { ...pkg, version: newVersion };
        writeFileSync(pkgPath, JSON.stringify(updatedPkg, null, 2) + '\n');
        console.log(`Updated ${pkg.name} to v${newVersion}`);
    });

    // 新增发布逻辑

    targets.forEach(pkgPath => {
        const pkg: Package = JSON.parse(readFileSync(pkgPath, 'utf8'));
        const pkgDir = dirname(pkgPath);
        console.log(`\nPublishing ${pkg.name}...`);

        try {
            execSync(`pnpm publish --access public --no-git-checks`, {
                cwd: pkgDir,
                stdio: 'inherit'
            });
        } catch (e) {
            console.error(`Publish failed for ${pkg.name}:`, e);
            process.exit(1);
        }
    });

}



// 解析命令行参数
const [pkgName, releaseType] = process.argv.slice(2); // 获取第3、4个参数
const validPackages = Object.keys(PACKAGE_PATHS).concat('all'); // 合法包名列表

// 参数有效性校验
if (!pkgName || !validPackages.includes(pkgName as any)) {
    // 显示用法帮助信息
    console.log(`Usage: ts-node version-bump.ts <package|all> [releaseType]`);
    console.log(`Example:`);
    console.log(`  ts-node version-bump.ts components major`);  // 主要版本升级示例
    console.log(`  ts-node version-bump.ts all patch`);          // 全局补丁版本升级示例
    process.exit(1); // 非正常退出
}

try {
    updateVersion(pkgName as PackageName, (releaseType as ReleaseType) || 'patch');
    console.log('Version bump completed!');
    // 在参数校验后添加发布提示
    console.log('Version bump completed!');
    console.log('Publish success!');
} catch (error) {
    console.error('Version bump failed:', error);
    process.exit(1);
}