import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const themeCssPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css/theme.css';

const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html, { sourceCodeLocationInfo: true });

const ops = [];

function walk(node) {
  if (node.attrs) {
    const isWrapper = node.attrs.some(a => a.name === 'data-framer-background-image-wrapper' && a.value === 'true');
    if (isWrapper && node.sourceCodeLocation) {
      const imgChild = (node.childNodes || []).find(c => c.tagName === 'img');
      if (imgChild) {
        const srcAttr = imgChild.attrs.find(a => a.name === 'src')?.value || '';
        const altAttr = imgChild.attrs.find(a => a.name === 'alt')?.value || '';
        const styleAttr = imgChild.attrs.find(a => a.name === 'style')?.value || '';
        const isContain = styleAttr.includes('object-fit:contain');
        const imgClass = isContain ? 'bg-img contain' : 'bg-img';
        
        // Build clean img tag
        const cleanTag = `<img class="${imgClass}" src="${srcAttr}" loading="lazy" decoding="async" alt="${altAttr}">`;
        
        ops.push({
          startOffset: node.sourceCodeLocation.startOffset,
          endOffset: node.sourceCodeLocation.endOffset,
          replacement: cleanTag,
          src: srcAttr
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

console.log(`Found ${ops.length} background image wrappers to clean.`);

const isApply = process.argv.includes('--apply');

if (!isApply) {
  console.log('DRY RUN: Showing first 3 transformations:');
  ops.slice(0, 3).forEach((op, idx) => {
    const original = html.slice(op.startOffset, op.endOffset);
    console.log(`\n--- [${idx + 1}] Original (${original.length} chars) ---`);
    console.log(original.slice(0, 150) + '...[truncated]...' + original.slice(-50));
    console.log(`--- [${idx + 1}] Clean Replacement (${op.replacement.length} chars) ---`);
    console.log(op.replacement);
  });
  console.log('\nRun with --apply to apply changes.');
} else {
  // Sort ops descending so earlier offsets remain valid
  ops.sort((a, b) => b.startOffset - a.startOffset);
  
  let newHtml = html;
  for (const op of ops) {
    newHtml = newHtml.slice(0, op.startOffset) + op.replacement + newHtml.slice(op.endOffset);
  }
  
  fs.writeFileSync(htmlPath, newHtml, 'utf8');
  console.log(`Successfully applied ${ops.length} replacements to index.html!`);
  console.log(`HTML size reduced from ${html.length} to ${newHtml.length} bytes (saved ${html.length - newHtml.length} bytes / ~${Math.round((html.length - newHtml.length)/1024)} KB)!`);

  // Ensure .bg-img rule is in theme.css
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');
  if (!themeCss.includes('.bg-img {')) {
    const bgRule = `\n/* === Clean Card Background Images (Option 2) === */\n.bg-img {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  object-position: center;\n  border-radius: inherit;\n  pointer-events: none;\n}\n.bg-img.contain {\n  object-fit: contain;\n}\n`;
    themeCss += bgRule;
    fs.writeFileSync(themeCssPath, themeCss, 'utf8');
    console.log('Added .bg-img CSS rules to theme.css');
  }
}
