import fs from 'node:fs';
import path from 'node:path';
import { applySurgicalOps } from './surgical-edit.mjs';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const targetStr = '<script src="./scripts/tree-parallax.js"></script>\n    <script src="./scripts/sky-parallax.js"></script>';
const start = html.indexOf(targetStr);

if (start === -1) {
    console.error('Target string not found in index.html!');
    process.exit(1);
}

const end = start + targetStr.length;
const replacement = '<script src="./scripts/parallax.js"></script>';

const ops = [{
    start,
    end,
    replacement,
    reason: 'Track 5: replace tree-parallax and sky-parallax with consolidated parallax.js'
}];

// Apply atomically
applySurgicalOps(html, ops, {
    dryRun: false,
    filePath: htmlPath,
    reportPath: 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/reports/surgical-track5.json'
});

console.log('Successfully updated index.html to load parallax.js!');
