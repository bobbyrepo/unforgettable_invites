const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 5050;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const compressExtensions = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg']);

const server = http.createServer((req, res) => {
    // API endpoint for live visual flag positioning & scaling persistence
    if (req.url === '/api/save-flags' || req.url.startsWith('/api/save-flags')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    console.log('[API /save-flags] Received save request:', data);

                    const targetFiles = [
                        path.join(__dirname, 'templates', '08_buddhist_wedding', 'css', 'flags.css'),
                        path.join(__dirname, 'templates', '08_buddhist_wedding', 'index.html'),
                        path.join(__dirname, 'templates', '08_buddhist_wedding', 'index_remote.html')
                    ];
                    targetFiles.forEach(file => {
                        if (!fs.existsSync(file)) return;
                        let content = fs.readFileSync(file, 'utf8');

                        // Replace CSS variables everywhere in the file
                        for (const [key, val] of Object.entries(data)) {
                            const regex = new RegExp(key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ':\\s*[^;]+;', 'g');
                            content = content.replace(regex, `${key}: ${val};`);
                        }

                        // Also update initial JS state in antigravity-visual-flag-studio-script if present
                        ['r1', 'r2', 'r3', 'r4', 'l1', 'l2', 'l3', 'l4'].forEach(id => {
                            if (data['--flag-' + id + '-x']) {
                                const x = parseFloat(data['--flag-' + id + '-x']);
                                const y = parseFloat(data['--flag-' + id + '-y']);
                                const s = parseFloat(data['--flag-' + id + '-scale']);
                                const re = new RegExp(id + ':\\s*\\{\\s*x:\\s*[^,]+,\\s*y:\\s*[^,]+,\\s*scale:\\s*[^,]+');
                                content = content.replace(re, `${id}: { x: ${x}, y: ${y}, scale: ${s}`);
                            }
                        });

                        fs.writeFileSync(file, content, 'utf8');
                        console.log('[API /save-flags] Successfully saved to:', file);
                    });

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, saved: data }));
                } catch (err) {
                    console.error('[API /save-flags] Error:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                }
            });
            return;
        }
    }

    // API endpoint for reading and writing client configurations (invites.config.json)
    if (req.url === '/api/clients' || req.url.startsWith('/api/clients')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            return res.end();
        }

        const configPath = path.join(__dirname, 'invites.config.json');

        if (req.method === 'GET') {
            let data = {};
            if (fs.existsSync(configPath)) {
                try { data = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (e) {}
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(data));
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const client = JSON.parse(body);
                    let allClients = {};
                    if (fs.existsSync(configPath)) {
                        try { allClients = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (e) {}
                    }
                    if (client.slug) {
                        allClients[client.slug] = client;
                        fs.writeFileSync(configPath, JSON.stringify(allClients, null, 2), 'utf8');
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, client }));
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err.message }));
                }
            });
            return;
        }
    }

    let safeUrl = req.url.split('?')[0];
    try {
        safeUrl = decodeURIComponent(safeUrl);
    } catch (e) {
        // Fallback to unescaped url if malformed
    }

    // Direct route for Studio Builder
    if (safeUrl === '/studio' || safeUrl === '/builder') {
        safeUrl = '/studio.html';
    }

    // Direct slug route for clients (/aarav-saisha -> template)
    if (safeUrl !== '/' && !safeUrl.includes('.') && !safeUrl.startsWith('/templates') && !safeUrl.startsWith('/api')) {
        const potentialSlug = safeUrl.replace(/^\//, '');
        const configPath = path.join(__dirname, 'invites.config.json');
        if (fs.existsSync(configPath)) {
            try {
                const clients = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (clients[potentialSlug]) {
                    const tmpl = clients[potentialSlug].template || '08_unforgettable_buddhist_wedding';
                    res.writeHead(302, { 'Location': `/templates/${tmpl}/?client=${potentialSlug}` });
                    return res.end();
                }
            } catch (e) {}
        }
    }
    let filePath = path.join(__dirname, safeUrl === '/' ? 'portal.html' : safeUrl);

    // Redirect directories without trailing slash to ensure relative paths (e.g. ./images/) resolve correctly
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        if (!req.url.split('?')[0].endsWith('/')) {
            const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
            res.writeHead(301, { 'Location': req.url.split('?')[0] + '/' + query });
            return res.end();
        }
        filePath = path.join(filePath, 'index.html');
    }

    // Smart extension fallback for swapped images (.webp <-> .png <-> .jpg)
    if (!fs.existsSync(filePath)) {
        const extname = path.extname(filePath).toLowerCase();
        if (extname === '.webp') {
            const altPng = filePath.replace(/\.webp$/i, '.png');
            const altJpg = filePath.replace(/\.webp$/i, '.jpg');
            if (fs.existsSync(altPng)) filePath = altPng;
            else if (fs.existsSync(altJpg)) filePath = altJpg;
        } else if (extname === '.png') {
            const altWebp = filePath.replace(/\.png$/i, '.webp');
            if (fs.existsSync(altWebp)) filePath = altWebp;
        }
    }

    // Only route non-asset SPA routes to portal.html; return 404 for missing static assets
    if (!fs.existsSync(filePath)) {
        const extname = path.extname(filePath).toLowerCase();
        if (mimeTypes[extname]) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Asset Not Found: ' + safeUrl);
        }
        filePath = path.join(__dirname, 'portal.html');
    }

    let stat;
    try {
        stat = fs.statSync(filePath);
    } catch (e) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // CORS & Performance Headers (Instant Development Reloading)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache, must-revalidate'
    };

    const etag = `"${stat.size}-${stat.mtimeMs}"`;
    headers['ETag'] = etag;

    // Check If-None-Match (304 Not Modified)
    if (req.headers['if-none-match'] === etag) {
        res.writeHead(304, headers);
        return res.end();
    }

    // Handle Range Requests for Audio/Video Streaming (Instant Mobile Playback)
    const range = req.headers.range;
    if (range && (ext === '.mp3' || ext === '.mp4')) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;

        headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
        headers['Content-Length'] = chunksize;
        res.writeHead(206, headers);

        const fileStream = fs.createReadStream(filePath, { start, end });
        return fileStream.pipe(res);
    }

    // Handle Gzip Compression for HTML, JS, CSS, JSON
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (compressExtensions.has(ext) && acceptEncoding.includes('gzip')) {
        headers['Content-Encoding'] = 'gzip';
        res.writeHead(200, headers);
        const rawStream = fs.createReadStream(filePath);
        const gzipStream = zlib.createGzip({ level: 6 });
        return rawStream.pipe(gzipStream).pipe(res);
    }

    // Standard Direct Streaming
    headers['Content-Length'] = stat.size;
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`High-Performance Streaming Server active!`);
    console.log(`💻 Local Desktop : http://localhost:${PORT}/studio`);
    console.log(`📱 Mobile Wi-Fi : http://192.168.1.9:${PORT}/studio`);
    console.log(`🪷 Mobile Invite : http://192.168.1.9:${PORT}/templates/08_unforgettable_buddhist_wedding/?client=aarav-saisha`);
});
