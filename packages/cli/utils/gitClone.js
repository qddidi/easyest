import download from 'download-git-repo';
import chalk from 'chalk';
import ora from 'ora';

export default (remote, name, option) => {
  const downSpinner = ora('正在下载模板...').start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, (err) => {
      if (err) {
        downSpinner.fail();
        console.log('err', chalk.red(err));
        reject(err);
        return;
      }
      downSpinner.succeed(chalk.green('模板下载成功！'));
      console.log(chalk.green(`cd ${name}\r\n`));
      console.log(chalk.blue('pnpm install\r\n'));
      console.log('pnpm run build:easyest\r\n');
      console.log('pnpm run easyest:dev\r\n');
      resolve();
    });
  });
};
