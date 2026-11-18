import fs from 'fs';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const themePath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css/theme.css';

let html = fs.readFileSync(htmlPath, 'utf8');
let theme = fs.readFileSync(themePath, 'utf8');

const initialStylesCount = (html.match(/style="[^"]*"/g) || []).length;
console.log(`Starting Phase 2 with ${initialStylesCount} inline styles.`);

// 1. Add Phase 2 CSS classes to theme.css
const phase2Css = `
/* ==========================================================================
   PHASE 2 COMPONENT CLASSES (FORM & COLLAGE GALLERY)
   ========================================================================== */

select, option {
  color: rgb(95, 37, 15);
}

/* Collage Gallery */
.collage-box {
  width: 160px;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.collage-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.collage-label {
  margin-top: 8px;
  text-align: center;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
  opacity: 0;
  filter: blur(4px);
}

/* RSVP Form Elements */
.rsvp-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgb(224, 224, 224);
  background: rgb(255, 255, 255);
  color: rgb(95, 37, 15);
  font-size: 14px;
  font-family: inherit;
  outline: none;
}

.rsvp-select-trigger {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgb(224, 224, 224);
  background: rgb(255, 255, 255);
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.rsvp-submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgb(37, 211, 102);
  color: rgb(255, 255, 255);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: not-allowed;
  opacity: 0.5;
}

.rsvp-row {
  display: flex;
  gap: 10px;
}

.rsvp-col {
  position: relative;
  flex: 1;
  min-width: 0;
}

.rsvp-title {
  font-size: 17px;
  font-weight: 700;
  color: rgb(95, 37, 15);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-clip {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caret-icon {
  flex-shrink: 0;
  margin-left: 6px;
  transform: none;
  transition: transform 0.15s ease;
}

/* Generic Layout / Transform utilities */
.center-y {
  transform: translateY(-50%);
}

.center-x-rot180 {
  transform: translateX(-50%) rotate(180deg);
}

.anim-hidden-none {
  will-change: transform;
  opacity: 0;
  transform: none;
}
`;

if (!theme.includes('.collage-box')) {
  theme += '\n' + phase2Css;
  fs.writeFileSync(themePath, theme, 'utf8');
  console.log('Appended Phase 2 CSS to theme.css');
}

// 2. Strip style="color:rgb(95, 37, 15)" from option tags
const initialOptions = (html.match(/<option[^>]*style="color:rgb\(95,\s*37,\s*15\)"/g) || []).length;
html = html.replace(/(<option[^>]*?)\s+style="color:rgb\(95,\s*37,\s*15\)"/g, '$1');
console.log(`Stripped color style from ${initialOptions} <option> tags.`);

// 3. Helper to replace style with class
function replaceStyleWithClass(htmlStr, styleExact, className) {
  const withClassRegex = new RegExp(`class="([^"]*)"\\s+style="${escapeRegExp(styleExact)}"`, 'g');
  htmlStr = htmlStr.replace(withClassRegex, (match, existingClasses) => `class="${existingClasses} ${className}"`);

  const styleFirstRegex = new RegExp(`style="${escapeRegExp(styleExact)}"\\s+class="([^"]*)"`, 'g');
  htmlStr = htmlStr.replace(styleFirstRegex, (match, existingClasses) => `class="${existingClasses} ${className}"`);

  const bareStyleRegex = new RegExp(`style="${escapeRegExp(styleExact)}"`, 'g');
  htmlStr = htmlStr.replace(bareStyleRegex, `class="${className}"`);

  return htmlStr;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 4. Collage
html = replaceStyleWithClass(html, 'width:160px;height:160px;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.15)', 'collage-box');
html = replaceStyleWithClass(html, 'width:100%;height:100%;object-fit:cover;display:block', 'collage-img');
html = replaceStyleWithClass(html, 'margin-top:8px;text-align:center;color:rgb(255, 255, 255);text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;opacity:0;filter:blur(4px)', 'collage-label');

// 5. RSVP form
html = replaceStyleWithClass(html, 'width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid rgb(224, 224, 224);background:rgb(255, 255, 255);color:rgb(95, 37, 15);font-size:14px;font-family:inherit;outline:none', 'rsvp-input');
html = replaceStyleWithClass(html, 'width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid rgb(224, 224, 224);background:rgb(255, 255, 255);color:rgba(0,0,0,0.4);font-size:14px;font-family:inherit;outline:none;text-align:left;display:flex;align-items:center;justify-content:space-between;cursor:pointer', 'rsvp-select-trigger');
html = replaceStyleWithClass(html, 'display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;padding:14px 16px;border-radius:14px;background:rgb(37, 211, 102);color:rgb(255, 255, 255);font-size:15px;font-weight:700;text-decoration:none;cursor:not-allowed;opacity:0.5', 'rsvp-submit-btn');
html = replaceStyleWithClass(html, 'display:flex;gap:10px', 'rsvp-row');
html = replaceStyleWithClass(html, 'position:relative;flex:1;min-width:0', 'rsvp-col');
html = replaceStyleWithClass(html, 'font-size:17px;font-weight:700;color:rgb(95, 37, 15);text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis', 'rsvp-title');
html = replaceStyleWithClass(html, 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap', 'ellipsis-clip');
html = replaceStyleWithClass(html, 'flex-shrink:0;margin-left:6px;transform:none;transition:transform 0.15s ease', 'caret-icon');
html = replaceStyleWithClass(html, 'transform:translateY(-50%)', 'center-y');
html = replaceStyleWithClass(html, 'transform:translateX(-50%) rotate(180deg)', 'center-x-rot180');
html = replaceStyleWithClass(html, 'will-change:transform;opacity:0;transform:none', 'anim-hidden-none');

// 6. Merge any duplicate class attributes on same tag
html = html.replace(/<([a-zA-Z0-9\-]+)([^>]+)>/g, (fullTag, tagName, attrs) => {
  const classMatches = [...attrs.matchAll(/\bclass="([^"]*)"/g)];
  if (classMatches.length > 1) {
    const combinedClasses = classMatches.map(m => m[1].trim()).filter(Boolean).join(' ');
    let cleanAttrs = attrs.replace(/\bclass="[^"]*"/g, '').replace(/\s+/g, ' ').trim();
    return `<${tagName} class="${combinedClasses}" ${cleanAttrs}>`;
  }
  return fullTag;
});

fs.writeFileSync(htmlPath, html, 'utf8');

const finalStylesCount = (html.match(/style="[^"]*"/g) || []).length;
console.log(`\n🎉 Phase 2 Complete!`);
console.log(`Styles reduced from ${initialStylesCount} to ${finalStylesCount} (-${initialStylesCount - finalStylesCount} removed).`);
