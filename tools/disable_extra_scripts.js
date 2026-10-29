const fs = require('fs');
const htmlFile = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
let html = fs.readFileSync(htmlFile, 'utf8');

// Disable watermark-cleaner.js (it was running a recursive MutationObserver querySelectorAll loop on every frame!)
html = html.replace('<script src="./scripts/watermark-cleaner.js"></script>', '<!-- <script src="./scripts/watermark-cleaner.js"></script> -->');

// Disable tree-parallax.js (it was forcing synchronous reflow getComputedStyle on every scroll tick)
html = html.replace('<script src="./scripts/tree-parallax.js"></script>', '<!-- <script src="./scripts/tree-parallax.js"></script> -->');

// Disable flag-simulation.js
html = html.replace('<script src="./scripts/flag-simulation.js"></script>', '<!-- <script src="./scripts/flag-simulation.js"></script> -->');

// Disable css-flags.js
html = html.replace('<script src="./scripts/css-flags.js"></script>', '<!-- <script src="./scripts/css-flags.js"></script> -->');

fs.writeFileSync(htmlFile, html, 'utf8');
console.log('Disabled extra background scripts in Template 8');
