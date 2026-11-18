import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html);

const fontMap = new Map();
let fontPresetCounter = 1;

function cleanFontVarString(styleStr) {
  // Extract key properties
  // e.g. --font-selector, --framer-font-family, --framer-font-size, --framer-font-weight, --framer-line-height, --framer-text-alignment, --framer-text-color
  return styleStr.trim();
}

function walk(node) {
  if (node.attrs) {
    const styleAttr = node.attrs.find(a => a.name === 'style');
    if (styleAttr && styleAttr.value.includes('--framer-font-family')) {
      const val = cleanFontVarString(styleAttr.value);
      if (!fontMap.has(val)) {
        // Generate a readable preset name
        let family = 'font';
        if (val.includes('Gotham Light')) family = 'gotham-light';
        else if (val.includes('IvyOra Display Medium')) family = 'ivyora-med';
        else if (val.includes('IvyOra Display Regular')) family = 'ivyora-reg';
        else if (val.includes('IvyOra Display Bold')) family = 'ivyora-bold';
        else if (val.includes('Brother Signature')) family = 'brother-sig';
        else if (val.includes('Miofarin')) family = 'miofarin';

        const sizeMatch = val.match(/--framer-font-size:([0-9.]+)px/);
        const size = sizeMatch ? Math.round(parseFloat(sizeMatch[1])) : 'auto';
        
        const className = `font-${family}-${size}-${fontPresetCounter++}`;
        fontMap.set(val, { className, style: val });
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

console.log(`Generated ${fontMap.size} font preset classes.`);
let sample = 0;
for (const [style, info] of fontMap.entries()) {
  if (sample++ < 10) {
    console.log(`.${info.className} -> ${style.slice(0, 100)}...`);
  }
}
