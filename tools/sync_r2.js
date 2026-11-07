const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Native zero-dependency .env.local loader
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID || 'fb6912bbc3e68db65cd483aee21885ae'}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '204da7da0e0389e76d16b5faa12448a7',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '6bff2711855825cd27bb81f21f130e2bd1e7ee5b550eb5ad42b6085ca266ff0c',
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'unforgettable-invites-assets';

const MIME_MAP = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mjs': 'application/javascript',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.html': 'text/html; charset=utf-8',
};

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

async function uploadSingleFile(filePath, customKey) {
  const baseDir = path.join(__dirname, '..');
  const relPath = customKey || path.relative(baseDir, filePath).replace(/\\/g, '/');
  const mime = getMime(filePath);
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: relPath,
    Body: fileContent,
    ContentType: mime,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3.send(command);
  console.log(`[R2 SYNC] Successfully uploaded: ${relPath} (${(fileContent.length / 1024).toFixed(1)} KB)`);
  return relPath;
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    // Ignore _archive and hidden/system folders
    if (file === '_archive' || file.startsWith('.')) return;
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      // Only sync real media assets and static resources (exclude source code)
      if (!['.tsx', '.ts', '.md', '.log', '.tmp'].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

async function syncAll() {
  console.log('--- Scanning templates for new / updated assets ---');
  const baseDir = path.join(__dirname, '..');
  const templatesDir = path.join(baseDir, 'templates');
  const files = getAllFiles(templatesDir);

  const cacheFile = path.join(__dirname, '.sync-cache.json');
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch (e) {
      cache = {};
    }
  }

  let uploadedCount = 0;
  for (const f of files) {
    const stat = fs.statSync(f);
    const mtime = stat.mtimeMs;
    const rel = path.relative(baseDir, f).replace(/\\/g, '/');

    if (!cache[rel] || cache[rel] < mtime) {
      try {
        await uploadSingleFile(f, rel);
        cache[rel] = mtime;
        uploadedCount++;
      } catch (err) {
        console.error(`Failed uploading ${rel}:`, err.message);
      }
    }
  }

  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`--- Sync Finished. ${uploadedCount} updated files uploaded to R2 ---`);
}

function watchMode() {
  const baseDir = path.join(__dirname, '..');
  const templatesDir = path.join(baseDir, 'templates');

  console.log(`[R2 WATCHER] Watching for template asset changes in: ${templatesDir}`);
  console.log('[R2 WATCHER] Any image/audio you save or replace will automatically upload to Cloudflare R2!');

  let debounceTimers = {};

  fs.watch(templatesDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const fullPath = path.join(templatesDir, filename);

    // Filter out temporary editor files, _archive, and source code files
    if (
      filename.includes('~') ||
      filename.endsWith('.tmp') ||
      filename.includes('_archive') ||
      filename.endsWith('.tsx') ||
      filename.endsWith('.ts') ||
      filename.endsWith('.md')
    ) return;

    if (debounceTimers[filename]) {
      clearTimeout(debounceTimers[filename]);
    }

    debounceTimers[filename] = setTimeout(async () => {
      delete debounceTimers[filename];
      if (fs.existsSync(fullPath) && !fs.statSync(fullPath).isDirectory()) {
        console.log(`[R2 WATCHER] Detected change: ${filename}`);
        try {
          await uploadSingleFile(fullPath);
        } catch (e) {
          console.error(`[R2 WATCHER] Error syncing ${filename}:`, e.message);
        }
      }
    }, 500);
  });
}

// CLI Execution Router
const args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
  watchMode();
} else if (args.length > 0 && fs.existsSync(args[0])) {
  uploadSingleFile(path.resolve(args[0])).catch(console.error);
} else {
  syncAll().catch(console.error);
}
