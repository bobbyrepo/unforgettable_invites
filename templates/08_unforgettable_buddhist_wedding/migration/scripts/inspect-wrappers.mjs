import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const doc = parse5.parse(html);
let wrapperCount = 0;
const parentClasses = new Set();
const sampleSnippets = [];

function walk(node) {
  if (node.attrs) {
    const isWrapper = node.attrs.some(a => a.name === 'data-framer-background-image-wrapper' && a.value === 'true');
    if (isWrapper) {
      wrapperCount++;
      // find parent class
      if (node.parentNode && node.parentNode.attrs) {
        const classAttr = node.parentNode.attrs.find(a => a.name === 'class');
        if (classAttr) {
          parentClasses.add(classAttr.value);
        }
      }
      if (sampleSnippets.length < 5) {
        sampleSnippets.push({
          parentTag: node.parentNode?.tagName,
          parentClass: node.parentNode?.attrs?.find(a => a.name === 'class')?.value,
          wrapperAttrs: node.attrs.map(a => a.name),
          childTags: node.childNodes?.filter(c => c.tagName).map(c => c.tagName)
        });
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

console.log('Total wrappers:', wrapperCount);
console.log('Parent classes count:', parentClasses.size);
console.log('Sample parent classes:', Array.from(parentClasses).slice(0, 10));
console.log('Samples:', JSON.stringify(sampleSnippets, null, 2));
