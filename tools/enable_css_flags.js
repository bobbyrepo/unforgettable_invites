const fs = require('fs');
const file = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace('<!-- <script src="./scripts/css-flags.js"></script> -->', '<script src="./scripts/css-flags.js"></script>');
fs.writeFileSync(file, html, 'utf8');
console.log('✓ css-flags.js is now ACTIVE with the hardware SVG silk ripple filter!');
