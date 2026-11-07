const { spawn } = require('child_process');
const path = require('path');

let child = null;
let shuttingDown = false;

function startNext() {
  if (shuttingDown) return;

  const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
  console.log(`[Supervisor] Starting Next.js production server via ${nextBin}...`);

  child = spawn(process.execPath, [nextBin, 'start', '-H', '0.0.0.0', '-p', '3000'], {
    cwd: __dirname,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, NODE_ENV: 'production' }
  });

  child.on('exit', (code, signal) => {
    console.log(`[Supervisor] Next.js exited with code ${code}, signal ${signal}`);
    child = null;
    if (!shuttingDown) {
      console.log('[Supervisor] Restarting Next.js in 1 second...');
      setTimeout(startNext, 1000);
    }
  });

  child.on('error', (err) => {
    console.error('[Supervisor] Failed to spawn Next.js:', err);
  });
}

process.on('SIGINT', () => {
  shuttingDown = true;
  if (child) child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  shuttingDown = true;
  if (child) child.kill('SIGTERM');
  process.exit(0);
});

startNext();
