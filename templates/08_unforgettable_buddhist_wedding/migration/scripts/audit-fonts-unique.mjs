import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html);

const fontSets = new Map();

function walk(node) {
  if (node.attrs) {
    const styleAttr = node.attrs.find(a => a.name === 'style');
    if (styleAttr && styleAttr.value.includes('--framer-font-family')) {
      const val = styleAttr.value;
      fontSets.set(val, (fontSets.get(val) || 0) + 1);
    }
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      walk(child);
    }
  }
}

walk(doc);

console.log('Total unique typography combinations:', fontSets.size);
const sorted = Array.from(fontSets.entries()).sort((a, b) => b[1] - a[1]);
sorted.forEach(([style, count], idx) => {
  console.log(`\n[Type ${idx + 1}] (${count} elements):`);
  console.log(style);
});
