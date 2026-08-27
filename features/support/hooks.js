const { BeforeAll, AfterAll, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { spawn } = require('child_process');
const path = require('path');

setDefaultTimeout(120 * 1000);

const isWindows = process.platform === 'win32';

let serverProc;

const waitForServer = async (url, timeoutMs) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (e) {
      // Server not up yet; keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
};

BeforeAll(async function () {
  const projectRoot = path.resolve(__dirname, '../..');

  // Build the app with Vite. Node 20.12+ on Windows requires shell:true to spawn .cmd files.
  await new Promise((resolve, reject) => {
    const proc = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'build'], {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: isWindows,
    });
    proc.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Build failed with exit code ' + code));
    });
  });

  // Serve the built app (Vite's dist/) on port 5000, invoking serve's JS entry
  // point directly so no shell is involved and serverProc.kill() reliably stops it.
  // Read the entry point from serve's own manifest rather than hard-coding it,
  // since it moved in serve 14.
  const servePkg = require('serve/package.json');
  const serveJs = path.resolve(projectRoot, 'node_modules/serve', servePkg.bin.serve);
  serverProc = spawn(process.execPath, [serveJs, '-s', '-l', '5000', 'dist'], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  await waitForServer('http://localhost:5000/', 15000);
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
