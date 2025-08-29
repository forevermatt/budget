const { BeforeAll, AfterAll, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { spawn } = require('child_process');
const path = require('path');

setDefaultTimeout(120 * 1000);

let serverProc;

BeforeAll(async function () {
  // Build the app
  await new Promise((resolve, reject) => {
    const proc = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'build'], {
      cwd: path.resolve(__dirname, '../../..'),
      stdio: 'inherit',
    });
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Build failed with exit code ' + code));
    });
  });

  // Start static server on port 5000
  serverProc = spawn(path.resolve(__dirname, '../../../node_modules/.bin/serve'), ['-s', '-l', '5000', '.'], {
    cwd: path.resolve(__dirname, '../../..'),
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
