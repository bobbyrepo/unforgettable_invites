import fs from 'fs';

const html = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html', 'utf8');

const matches = html.match(/style="[^"]*"/g) || [];
console.log('Total inline style attributes remaining:', matches.length);

const stylesMap = {};
matches.forEach(s => {
  stylesMap[s] = (stylesMap[s] || 0) + 1;
});

const sorted = Object.entries(stylesMap).sort((a,b) => b[1] - a[1]);
console.log('\nTop 25 remaining inline styles:');
sorted.slice(0, 25).forEach(([style, count]) => console.log(`${count}x: ${style}`));
