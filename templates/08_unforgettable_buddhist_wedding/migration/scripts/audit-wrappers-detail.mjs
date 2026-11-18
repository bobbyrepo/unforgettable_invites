import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html);

let wrapperCount = 0;
let nonImgChildrenCount = 0;
let multipleChildrenCount = 0;
const uniqueImgStyles = new Set();
const uniqueWrapperStyles = new Set();

function walk(node) {
  if (node.attrs) {
    const isWrapper = node.attrs.some(a => a.name === 'data-framer-background-image-wrapper' && a.value === 'true');
    if (isWrapper) {
      wrapperCount++;
      const children = (node.childNodes || []).filter(c => c.nodeName !== '#text' || c.value?.trim());
      if (children.length > 1) multipleChildrenCount++;
      children.forEach(c => {
        if (c.tagName !== 'img') nonImgChildrenCount++;
        else {
          const style = c.attrs?.find(a => a.name === 'style')?.value || 'NONE';
          uniqueImgStyles.add(style);
        }
      });
      const wrapperStyle = node.attrs.find(a => a.name === 'style')?.value || 'NONE';
      uniqueWrapperStyles.add(wrapperStyle);
    }
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      walk(child);
    }
  }
}

walk(doc);

console.log('Total wrappers:', wrapperCount);
console.log('Multiple children count:', multipleChildrenCount);
console.log('Non-img children count:', nonImgChildrenCount);
console.log('Unique wrapper styles:', Array.from(uniqueWrapperStyles));
console.log('Unique img styles count:', uniqueImgStyles.size);
console.log('Unique img styles sample:', Array.from(uniqueImgStyles).slice(0, 5));
