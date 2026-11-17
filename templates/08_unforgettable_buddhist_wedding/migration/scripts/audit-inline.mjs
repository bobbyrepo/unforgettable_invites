import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';

const ROOT = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const htmlPath = path.join(ROOT, 'index.html');

console.log('[audit-inline] Parsing index.html for static inline styles...');
const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html, { sourceCodeLocationInfo: true });

const MOTION_SET = new Set([
    'transform', 'translate', 'rotate', 'scale', 'opacity', 'will-change',
    'filter', 'backdrop-filter', 'perspective', 'clip-path', 'mask', 'mask-image'
]);

let totalStyleAttrs = 0;
let totalDecls = 0;
let extractableDecls = 0;
let motionDecls = 0;

function walk(node) {
    if (node.nodeName && node.attrs) {
        const styleAttr = node.attrs.find(a => a.name === 'style');
        if (styleAttr && styleAttr.value.trim()) {
            totalStyleAttrs++;
            const decls = styleAttr.value.split(';').map(d => d.trim()).filter(Boolean);
            decls.forEach(d => {
                totalDecls++;
                const colonIdx = d.indexOf(':');
                if (colonIdx > 0) {
                    const prop = d.slice(0, colonIdx).trim().toLowerCase();
                    if (MOTION_SET.has(prop)) {
                        motionDecls++;
                    } else {
                        extractableDecls++;
                    }
                }
            });
        }
    }
    if (node.childNodes) {
        node.childNodes.forEach(walk);
    }
}

walk(doc);

console.log(`[audit-inline] Total style attributes found: ${totalStyleAttrs}`);
console.log(`[audit-inline] Total declarations: ${totalDecls}`);
console.log(`[audit-inline] Motion declarations (MUST STAY INLINE per Rule R7): ${motionDecls}`);
console.log(`[audit-inline] Static extractable declarations: ${extractableDecls}`);
