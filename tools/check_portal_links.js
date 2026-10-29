const fs = require('fs');
const html = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/portal.html', 'utf8');
const links = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
console.log('All links in portal.html:');
links.forEach(l => console.log(l));
