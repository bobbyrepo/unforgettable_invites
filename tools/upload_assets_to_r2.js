const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://fb6912bbc3e68db65cd483aee21885ae.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: '204da7da0e0389e76d16b5faa12448a7',
    secretAccessKey: '6bff2711855825cd27bb81f21f130e2bd1e7ee5b550eb5ad42b6085ca266ff0c',
  },
});

const BUCKET_NAME = 'unforgettable-invites-assets';

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
  '.txt': 'text/plain; charset=utf-8',
};

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function uploadFile(filePath, s3Key) {
  const mime = getMime(filePath);
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key.replace(/\\/g, '/'),
    Body: fileContent,
    ContentType: mime,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3.send(command);
}

async function runUpload() {
  console.log('--- Starting Cloudflare R2 Batch Asset Sync ---');
  const baseDir = path.join(__dirname, '..');

  const templatesDir = path.join(baseDir, 'templates');
  const assetsDir = path.join(baseDir, 'assets');

  const allFiles = [];

  if (fs.existsSync(templatesDir)) {
    const templateFiles = getAllFiles(templatesDir);
    templateFiles.forEach((f) => {
      const rel = path.relative(baseDir, f);
      allFiles.push({ local: f, remote: rel });
    });
  }

  if (fs.existsSync(assetsDir)) {
    const assetFiles = getAllFiles(assetsDir);
    assetFiles.forEach((f) => {
      const rel = path.relative(baseDir, f);
      allFiles.push({ local: f, remote: rel });
    });
  }

  console.log(`Found ${allFiles.length} files to sync to Cloudflare R2.`);

  const CONCURRENCY = 15;
  let index = 0;
  let successCount = 0;
  let errorCount = 0;

  async function worker() {
    while (index < allFiles.length) {
      const current = allFiles[index++];
      try {
        await uploadFile(current.local, current.remote);
        successCount++;
        if (successCount % 50 === 0 || successCount === allFiles.length) {
          console.log(`Progress: ${successCount}/${allFiles.length} files uploaded...`);
        }
      } catch (err) {
        errorCount++;
        console.error(`Failed uploading ${current.remote}:`, err.message);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log('==========================================');
  console.log(`Upload Complete!`);
  console.log(`Successfully uploaded: ${successCount} files`);
  console.log(`Failed uploads: ${errorCount} files`);
  console.log(`Public Dev URL Base: https://pub-9df949e18be24d52a5ae719c1edfe88c.r2.dev`);
  console.log('==========================================');
}

runUpload().catch(console.error);
