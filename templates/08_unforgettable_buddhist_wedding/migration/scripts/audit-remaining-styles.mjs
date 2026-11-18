import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html);

let totalInlineStyles = 0;
let textVariablesCount = 0;
let translateXCount = 0;
let appearAnimationCount = 0;
const styleFrequency = {};

function walk(node) {
  if (node.attrs) {
    const styleAttr = node.attrs.find(a => a.name === 'style');
    if (styleAttr) {
      totalInlineStyles++;
      const val = styleAttr.value;
      if (val.includes('--font-selector') || val.includes('--framer-font-family')) {
        textVariablesCount++;
      } else if (val === 'transform:translateX(-50%)' || val.trim() === 'transform:translateX(-50%)') {
        translateXCount++;
      } else if (val.includes('will-change:transform') || val.includes('opacity:0')) {
        appearAnimationCount++;
      }
      styleFrequency[val] = (styleFrequency[val] || 0) + 1;
    }
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      walk(child);
    }
  }
}

walk(doc);

console.log('Total inline styles remaining:', totalInlineStyles);
console.log('Text font variables styles:', textVariablesCount);
console.log('Exact transform:translateX(-50%) count:', translateXCount);
console.log('Appear animations (will-change / opacity:0):', appearAnimationCount);

const sorted = Object.entries(styleFrequency).sort((a, b) => b[1] - a[1]);
console.log('\nTop 10 most repeated inline styles:');
sorted.slice(0, 10).forEach(([style, count]) => {
  console.log(`[${count} times] ${style.slice(0, 120)}...`);
});
