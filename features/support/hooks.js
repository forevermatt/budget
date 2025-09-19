const { BeforeAll, AfterAll, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { spawn } = require('child_process');
const path = require('path');

setDefaultTimeout(120 * 1000);

let serverProc;

BeforeAll(async function () {
  const projectRoot = path.resolve(__dirname, '../..');

  // Build the app
  await new Promise((resolve, reject) => {
    const proc = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'build'], {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Build failed with exit code ' + code));
    });
  });

  // Start static server on port 5000
  const serveBin = path.resolve(projectRoot, 'node_modules/.bin/serve');
  serverProc = spawn(serveBin, ['-s', '-l', '5000', '.'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  // Wait briefly for server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));
});

After(async function () {
  if (typeof this.close === 'function') {
    await this.close();
  }
});

AfterAll(async function () {
  if (serverProc) {
    serverProc.kill();
  }
});
