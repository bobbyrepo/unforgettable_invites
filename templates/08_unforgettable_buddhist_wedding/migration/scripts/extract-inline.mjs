import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';

const ROOT = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const htmlPath = path.join(ROOT, 'index.html');

console.log('[extract-inline] Building extracted.css and review-list.json...');
const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html, { sourceCodeLocationInfo: true });

const MOTION_SET = new Set([
    'transform', 'translate', 'rotate', 'scale', 'opacity', 'will-change',
    'filter', 'backdrop-filter', 'perspective', 'clip-path', 'mask', 'mask-image'
]);

const extractedRules = [];
const reviewList = [];

function walk(node, pathStack = []) {
    if (node.nodeName && node.attrs) {
        const classAttr = node.attrs.find(a => a.name === 'class')?.value || '';
        const framerName = node.attrs.find(a => a.name === 'data-framer-name')?.value || null;
        const styleAttr = node.attrs.find(a => a.name === 'style');

        const framerClasses = classAttr.split(/\s+/).filter(c => c.startsWith('framer-'));

        if (styleAttr && styleAttr.value.trim()) {
            const decls = styleAttr.value.split(';').map(d => d.trim()).filter(Boolean);
            const greenDecls = [];

            decls.forEach(d => {
                const colonIdx = d.indexOf(':');
                if (colonIdx > 0) {
                    const prop = d.slice(0, colonIdx).trim().toLowerCase();
                    const val = d.slice(colonIdx + 1).trim();

                    if (MOTION_SET.has(prop)) {
                        reviewList.push({ path: pathStack.join('/'), prop, val, reason: 'MOTION' });
                    } else if (framerClasses.length === 0) {
                        reviewList.push({ path: pathStack.join('/'), prop, val, reason: 'NO_FRAMER_CLASS' });
                    } else if (d.includes('!important')) {
                        reviewList.push({ path: pathStack.join('/'), prop, val, reason: 'IMPORTANT' });
                    } else {
                        greenDecls.push({ prop, val });
                    }
                }
            });

            if (greenDecls.length > 0 && framerClasses.length > 0) {
                let selector = framerClasses.map(c => '.' + c).join('');
                if (framerName) {
                    selector += `[data-framer-name="${framerName}"]`;
                }
                extractedRules.push({
                    selector,
                    framerName,
                    tag: node.nodeName,
                    decls: greenDecls
                });
            }
        }
    }

    if (node.childNodes) {
        node.childNodes.forEach((child, idx) => walk(child, [...pathStack, idx]));
    }
}

walk(doc);

// Deduplicate rules by selector
const ruleMap = new Map();
extractedRules.forEach(r => {
    if (!ruleMap.has(r.selector)) {
        ruleMap.set(r.selector, { ...r, declMap: new Map() });
    }
    const existing = ruleMap.get(r.selector);
    r.decls.forEach(d => {
        if (!existing.declMap.has(d.prop)) {
            existing.declMap.set(d.prop, d.val);
        }
    });
});

let cssOutput = `/* ==========================================================================\n   EXTRACTED.CSS — STATIC INLINE STYLES EXTRACTED FROM HTML (RULE R7 PRESERVED)\n   ========================================================================== */\n\n`;

for (const [selector, data] of ruleMap.entries()) {
    cssOutput += `/* <${data.tag}> data-framer-name=${data.framerName || 'none'} */\n`;
    cssOutput += `${selector} {\n`;
    for (const [prop, val] of data.declMap.entries()) {
        cssOutput += `  ${prop}: ${val};\n`;
    }
    cssOutput += `}\n\n`;
}

fs.writeFileSync(path.join(ROOT, 'css/extracted.css'), cssOutput, 'utf8');
fs.writeFileSync(path.join(ROOT, 'migration/review-list.json'), JSON.stringify(reviewList, null, 2), 'utf8');

console.log(`[extract-inline] Unique CSS rules generated: ${ruleMap.size}`);
console.log(`[extract-inline] Review list items preserved inline: ${reviewList.length}`);
console.log(`[extract-inline] extracted.css written (${cssOutput.split('\n').length} lines)`);
