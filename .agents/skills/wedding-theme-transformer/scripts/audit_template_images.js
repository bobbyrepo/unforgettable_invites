/**
 * Audit Template Images & Codebase Placement Utility
 * Scans a wedding template folder, extracts image dimensions and formats,
 * correlates each image with HTML/CSS usage, and generates a structured audit report.
 */

const fs = require('fs');
const path = require('path');

function getDimensions(filePath) {
    try {
        const buf = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();

        // PNG Header
        if (ext === '.png' && buf.length >= 24) {
            return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), format: 'PNG' };
        }

        // WebP Header
        if (ext === '.webp' && buf.length >= 30) {
            const riff = buf.toString('ascii', 0, 4);
            const webp = buf.toString('ascii', 8, 12);
            if (riff === 'RIFF' && webp === 'WEBP') {
                const chunk = buf.toString('ascii', 12, 16);
                if (chunk === 'VP8X' && buf.length >= 30) {
                    const width = 1 + buf.readUIntLE(24, 3);
                    const height = 1 + buf.readUIntLE(27, 3);
                    return { width, height, format: 'WebP (Extended VP8X)' };
                }
                if (chunk === 'VP8 ' && buf.length >= 30) {
                    const width = buf.readUInt16LE(26) & 0x3fff;
                    const height = buf.readUInt16LE(28) & 0x3fff;
                    return { width, height, format: 'WebP (Lossy VP8)' };
                }
                if (chunk === 'VP8L' && buf.length >= 25) {
                    const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
                    const width = 1 + (((b1 & 0x3f) << 8) | b0);
                    const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
                    return { width, height, format: 'WebP (Lossless VP8L)' };
                }
            }
        }

        // JPEG (SOF0/SOF2 marker scan)
        if ((ext === '.jpg' || ext === '.jpeg') && buf.length >= 4) {
            let offset = 2;
            while (offset < buf.length) {
                if (buf[offset] !== 0xff) break;
                const marker = buf[offset + 1];
                if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker) && offset + 8 < buf.length) {
                    const height = buf.readUInt16BE(offset + 5);
                    const width = buf.readUInt16BE(offset + 7);
                    return { width, height, format: 'JPEG' };
                }
                const len = buf.readUInt16BE(offset + 2);
                offset += 2 + len;
            }
        }

        if (ext === '.svg') {
            return { width: 'Vector', height: 'Vector', format: 'SVG' };
        }
    } catch (e) {
        return { width: 'Unknown', height: 'Unknown', format: 'Error: ' + e.message };
    }
    return { width: 'Unknown', height: 'Unknown', format: 'Unknown' };
}

function auditTemplate(templateDir) {
    const imagesDir = path.join(templateDir, 'images');
    if (!fs.existsSync(imagesDir)) {
        console.error(`Images directory not found at: ${imagesDir}`);
        process.exit(1);
    }

    const htmlPath = path.join(templateDir, 'index.html');
    const htmlContent = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';

    const imageFiles = fs.readdirSync(imagesDir).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext);
    });

    console.log(`\n======================================================`);
    console.log(` TEMPLATE IMAGE AUDIT: ${path.basename(templateDir)}`);
    console.log(`======================================================\n`);
    console.log(`Total images scanned: ${imageFiles.length}\n`);

    const auditResults = [];

    imageFiles.forEach((file, idx) => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        const dim = getDimensions(filePath);
        const inHtml = htmlContent.includes(file);

        let role = 'Graphic Asset / Accent';
        if (typeof dim.width === 'number' && typeof dim.height === 'number') {
            const ratio = (dim.height / dim.width).toFixed(2);
            if (dim.height >= 3000 && dim.width >= 1000) {
                role = `Master Vertical Hero / Backdrop (Ratio 1:${ratio})`;
            } else if (dim.height >= 7000) {
                role = `Continuous Timeline Scroll Canvas (Ratio 1:${ratio})`;
            } else if (Math.abs(dim.width - 1200) < 50 && Math.abs(dim.height - 630) < 50) {
                role = `WhatsApp & Social Preview Card (16:9 Landscape)`;
            } else if (dim.height > dim.width * 2.5) {
                role = `Vertical Silk Banner / Flag Texture (Ratio 1:${ratio})`;
            } else if (Math.abs(dim.width - dim.height) < 20) {
                role = `Square Icon / Sanctum Deity Inset (1:1 Ratio)`;
            }
        }

        auditResults.push({
            index: idx + 1,
            fileName: file,
            resolution: (typeof dim.width === 'number') ? `${dim.width}x${dim.height}` : `${dim.width}`,
            format: dim.format,
            sizeKb: (stats.size / 1024).toFixed(1) + ' KB',
            referencedInHtml: inHtml,
            role: role
        });
    });

    // Print Markdown Table
    console.log('| # | File Name | Resolution (WxH) | Format | Size | Referenced in HTML | Primary Role |');
    console.log('| :-: | :--- | :---: | :---: | :---: | :---: | :--- |');
    auditResults.forEach(r => {
        console.log(`| ${r.index} | \`${r.fileName}\` | \`${r.resolution}\` | ${r.format} | ${r.sizeKb} | ${r.referencedInHtml ? '✅ Yes' : '⚠️ No'} | **${r.role}** |`);
    });

    // Write manifest JSON
    const manifestPath = path.join(templateDir, 'template_image_audit.json');
    fs.writeFileSync(manifestPath, JSON.stringify(auditResults, null, 2), 'utf8');
    console.log(`\nAudit manifest saved to: ${manifestPath}\n`);
}

const target = process.argv[2] || '.';
auditTemplate(path.resolve(target));
