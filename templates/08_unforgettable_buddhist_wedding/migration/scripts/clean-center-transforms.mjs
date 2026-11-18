import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const themeCssPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css/theme.css';

const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html, { sourceCodeLocationInfo: true });

const ops = [];

function walk(node) {
  if (node.attrs && node.sourceCodeLocation) {
    const styleAttr = node.attrs.find(a => a.name === 'style');
    const classAttr = node.attrs.find(a => a.name === 'class');
    
    if (styleAttr && node.sourceCodeLocation.attrs && node.sourceCodeLocation.attrs.style) {
      const styleVal = styleAttr.value.trim();
      let newClassToAdd = null;
      let newStyleVal = null;
      
      if (styleVal === 'transform:translateX(-50%)' || styleVal === 'transform: translateX(-50%)') {
        newClassToAdd = 'center-x';
        newStyleVal = '';
      } else if (styleVal === 'transform:translate(-50%, -50%)' || styleVal === 'transform: translate(-50%, -50%)' || styleVal === 'transform:translate(-50%,-50%)') {
        newClassToAdd = 'center-xy';
        newStyleVal = '';
      }
      
      if (newClassToAdd) {
        // We will remove style attribute and add class to class attribute
        if (classAttr && node.sourceCodeLocation.attrs.class) {
          const classLoc = node.sourceCodeLocation.attrs.class;
          const styleLoc = node.sourceCodeLocation.attrs.style;
          
          const currentClass = classAttr.value;
          const updatedClass = currentClass ? `${currentClass} ${newClassToAdd}` : newClassToAdd;
          
          ops.push({
            type: 'class_update',
            startOffset: classLoc.startOffset,
            endOffset: classLoc.endOffset,
            replacement: `class="${updatedClass}"`
          });
          
          // Remove style attribute
          ops.push({
            type: 'style_remove',
            startOffset: styleLoc.startOffset,
            endOffset: styleLoc.endOffset,
            replacement: ''
          });
        }
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

console.log(`Found ${ops.length / 2} transform centering elements to clean.`);

const isApply = process.argv.includes('--apply');

if (!isApply) {
  console.log('DRY RUN: Showing first 4 transformations:');
  const samples = ops.slice(0, 4);
  samples.forEach((op, i) => {
    console.log(`[${i + 1}] ${op.type} -> ${op.replacement || '(remove)'}`);
  });
  console.log('\nRun with --apply to apply.');
} else {
  // Sort ops descending so earlier offsets remain valid
  ops.sort((a, b) => b.startOffset - a.startOffset);
  
  let newHtml = html;
  for (const op of ops) {
    // If removing style, also clean any leftover double spaces
    let start = op.startOffset;
    let end = op.endOffset;
    if (op.type === 'style_remove') {
      // Look back for leading space
      if (start > 0 && newHtml[start - 1] === ' ') {
        start--;
      }
    }
    newHtml = newHtml.slice(0, start) + op.replacement + newHtml.slice(end);
  }
  
  fs.writeFileSync(htmlPath, newHtml, 'utf8');
  console.log(`Successfully applied ${ops.length / 2} transform cleanups to index.html!`);

  // Ensure .center-x and .center-xy are in theme.css
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');
  if (!themeCss.includes('.center-x {')) {
    const centerRules = `\n/* === Center Transforms (Extracted from inline styles) === */\n.center-x {\n  transform: translateX(-50%);\n}\n.center-xy {\n  transform: translate(-50%, -50%);\n}\n`;
    themeCss += centerRules;
    fs.writeFileSync(themeCssPath, themeCss, 'utf8');
    console.log('Added .center-x and .center-xy rules to theme.css');
  }
}
