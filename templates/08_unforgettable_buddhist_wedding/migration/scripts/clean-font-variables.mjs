import fs from 'fs';
import * as parse5 from 'parse5';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const themeCssPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css/theme.css';

const html = fs.readFileSync(htmlPath, 'utf8');
const doc = parse5.parse(html, { sourceCodeLocationInfo: true });

// Map unique styles to preset info
const fontMap = new Map();
let presetId = 1;

function getOrSetPreset(styleStr) {
  const trimmed = styleStr.trim();
  if (fontMap.has(trimmed)) {
    return fontMap.get(trimmed);
  }
  
  let fontName = 'custom';
  if (trimmed.includes('Gotham Light')) fontName = 'gotham';
  else if (trimmed.includes('IvyOra Display Medium')) fontName = 'ivyora-med';
  else if (trimmed.includes('IvyOra Display Regular')) fontName = 'ivyora-reg';
  else if (trimmed.includes('IvyOra Display Bold')) fontName = 'ivyora-bold';
  else if (trimmed.includes('Brother Signature')) fontName = 'brother';
  else if (trimmed.includes('Miofarin')) fontName = 'miofarin';
  
  const sizeMatch = trimmed.match(/--framer-font-size:([0-9.]+)px/);
  const size = sizeMatch ? Math.round(parseFloat(sizeMatch[1])) : 'auto';
  
  const className = `tp-${fontName}-${size}-${presetId++}`;
  const info = { className, styleStr: trimmed };
  fontMap.set(trimmed, info);
  return info;
}

const ops = [];

function walk(node) {
  if (node.attrs && node.sourceCodeLocation && node.sourceCodeLocation.attrs) {
    const styleAttr = node.attrs.find(a => a.name === 'style');
    const classAttr = node.attrs.find(a => a.name === 'class');
    
    if (styleAttr && styleAttr.value.includes('--framer-font-family') && node.sourceCodeLocation.attrs.style) {
      const styleLoc = node.sourceCodeLocation.attrs.style;
      const preset = getOrSetPreset(styleAttr.value);
      
      if (classAttr && node.sourceCodeLocation.attrs.class) {
        const classLoc = node.sourceCodeLocation.attrs.class;
        const currentClass = classAttr.value;
        const updatedClass = currentClass ? `${currentClass} ${preset.className}` : preset.className;
        
        ops.push({
          type: 'class_update',
          startOffset: classLoc.startOffset,
          endOffset: classLoc.endOffset,
          replacement: `class="${updatedClass}"`
        });
        
        ops.push({
          type: 'style_remove',
          startOffset: styleLoc.startOffset,
          endOffset: styleLoc.endOffset,
          replacement: ''
        });
      } else {
        // Element has style but no class attribute; replace style with class
        ops.push({
          type: 'style_to_class',
          startOffset: styleLoc.startOffset,
          endOffset: styleLoc.endOffset,
          replacement: `class="${preset.className}"`
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

console.log(`Found ${fontMap.size} unique font presets across ${ops.filter(o => o.type !== 'class_update').length} text elements.`);

const isApply = process.argv.includes('--apply');

if (!isApply) {
  console.log('\nDRY RUN: Showing first 4 element changes:');
  const sampleOps = ops.slice(0, 4);
  sampleOps.forEach((op, idx) => {
    console.log(`[${idx + 1}] ${op.type} -> ${op.replacement || '(remove)'}`);
  });
  console.log('\nRun with --apply to apply changes.');
} else {
  // Sort ops descending
  ops.sort((a, b) => b.startOffset - a.startOffset);
  
  let newHtml = html;
  for (const op of ops) {
    let start = op.startOffset;
    let end = op.endOffset;
    if (op.type === 'style_remove') {
      if (start > 0 && newHtml[start - 1] === ' ') {
        start--;
      }
    }
    newHtml = newHtml.slice(0, start) + op.replacement + newHtml.slice(end);
  }
  
  fs.writeFileSync(htmlPath, newHtml, 'utf8');
  console.log(`Applied font style extractions to index.html!`);
  
  // Build CSS rules for all presets
  let cssRules = '\n/* === Extracted Typography Presets === */\n';
  for (const [rawStyle, info] of fontMap.entries()) {
    // rawStyle has format: prop:val;prop:val
    const props = rawStyle.split(';').map(p => p.trim()).filter(Boolean);
    cssRules += `.${info.className} {\n`;
    for (const p of props) {
      cssRules += `  ${p};\n`;
    }
    cssRules += `}\n`;
  }
  
  let themeCss = fs.readFileSync(themeCssPath, 'utf8');
  themeCss += cssRules;
  fs.writeFileSync(themeCssPath, themeCss, 'utf8');
  console.log(`Added ${fontMap.size} typography rules to theme.css!`);
}
