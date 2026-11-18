import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html);

let differentFilesCount = 0;
let totalSrcsets = 0;

function walk(node) {
  if (node.tagName === 'img') {
    const srcset = node.attrs?.find(a => a.name === 'srcset')?.value;
    const src = node.attrs?.find(a => a.name === 'src')?.value;
    if (srcset) {
      totalSrcsets++;
      const entries = srcset.split(',').map(s => s.trim().split(' ')[0]);
      const uniqueEntries = new Set(entries);
      if (uniqueEntries.size > 1) {
        differentFilesCount++;
        console.log('Found different files in srcset:', { src, uniqueEntries: Array.from(uniqueEntries) });
      }
    }
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      walk(child);
    }
  }
}

walk(doc);

console.log('Total img with srcset:', totalSrcsets);
console.log('Srcsets with truly different file names:', differentFilesCount);
