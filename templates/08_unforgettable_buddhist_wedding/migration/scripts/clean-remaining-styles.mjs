import fs from 'fs';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
const themePath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css/theme.css';

let html = fs.readFileSync(htmlPath, 'utf8');
let theme = fs.readFileSync(themePath, 'utf8');

const initialLength = html.length;
const initialStylesCount = (html.match(/style="[^"]*"/g) || []).length;
console.log(`Starting with ${initialStylesCount} inline styles (${initialLength} bytes).`);

// 1. Add new utility / component classes to theme.css
const newCssRules = `
/* ==========================================================================
   EXTRACTED UTILITY & COMPONENT STYLES (CLEANUP FROM INLINE ATTRIBUTES)
   ========================================================================== */

/* Word-by-word reveal */
.word-reveal {
  display: inline-block;
  color: rgb(95, 37, 15);
  text-transform: none;
  text-decoration: none;
  transition: color 0.3s linear;
  will-change: color;
  margin-right: 0.25em;
}

/* Common animation initial states */
.anim-fade-up-24 {
  will-change: transform;
  opacity: 0;
  transform: translateX(-50%) translateY(24px);
}

.anim-fade-up-56-center {
  will-change: transform;
  opacity: 0;
  transform: translateX(-50%) translateY(56px) scale(0.94);
}

.anim-fade-up-56 {
  will-change: transform;
  opacity: 0;
  transform: translateY(56px) scale(0.94);
}

.anim-center-scale {
  will-change: transform;
  opacity: 0;
  transform: translateX(-50%) scale(0.9);
}

.anim-slide-left-48 {
  will-change: transform;
  opacity: 0;
  transform: translateX(-48px);
}

/* Countdown components */
.countdown-digit-box {
  position: relative;
  height: 45.1px;
  width: 26.65px;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.countdown-digit-num {
  font-size: 41px;
  line-height: 1;
  color: rgb(221, 164, 93);
  position: absolute;
  font-family: "Inter", sans-serif;
  font-weight: inherit;
  opacity: 1;
  filter: blur(0px);
  transform: none;
}

.countdown-unit-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 6px;
  text-align: center;
  color: rgb(136, 136, 136);
  font-family: "Inter", sans-serif;
}

.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
}
`;

if (!theme.includes('.word-reveal')) {
  theme += '\n' + newCssRules;
  fs.writeFileSync(themePath, theme, 'utf8');
  console.log('Appended new utility classes to theme.css');
}

// 2. Helper to add class to tag
function replaceStyleWithClass(htmlStr, styleExact, className) {
  // Replace: class="..." style="exact" -> class="... className"
  const withClassRegex = new RegExp(`class="([^"]*)"\\s+style="${escapeRegExp(styleExact)}"`, 'g');
  htmlStr = htmlStr.replace(withClassRegex, (match, existingClasses) => {
    return `class="${existingClasses} ${className}"`;
  });

  // Replace: style="exact" class="..." -> class="... className"
  const styleFirstRegex = new RegExp(`style="${escapeRegExp(styleExact)}"\\s+class="([^"]*)"`, 'g');
  htmlStr = htmlStr.replace(styleFirstRegex, (match, existingClasses) => {
    return `class="${existingClasses} ${className}"`;
  });

  // Replace: <tag style="exact" -> <tag class="className"
  const bareStyleRegex = new RegExp(`style="${escapeRegExp(styleExact)}"`, 'g');
  htmlStr = htmlStr.replace(bareStyleRegex, `class="${className}"`);

  return htmlStr;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 3. Strip redundant span color styles: style="color:rgb(95, 37, 15)"
// On spans, if they already have class, remove style="color:rgb(95, 37, 15)"
const redundantColorRegex = /<span([^>]*)\s+style="color:rgb\(95,\s*37,\s*15\)"([^>]*)>/g;
html = html.replace(redundantColorRegex, '<span$1$2>');
// If style was first: <span style="color:rgb(95, 37, 15)" ...>
const redundantColorFirstRegex = /<span\s+style="color:rgb\(95,\s*37,\s*15\)"([^>]*)>/g;
html = html.replace(redundantColorFirstRegex, '<span$1>');

// 4. Word-by-word reveal
const wordRevealStyle = 'display:inline-block;color:rgb(95, 37, 15);text-transform:none;text-decoration:none;transition:color 0.3s linear;will-change:color;margin-right:0.25em';
html = replaceStyleWithClass(html, wordRevealStyle, 'word-reveal');

// 5. Animations
html = replaceStyleWithClass(html, 'will-change:transform;opacity:0;transform:translateX(-50%) translateY(24px)', 'anim-fade-up-24');
html = replaceStyleWithClass(html, 'will-change:transform;opacity:0;transform:translateX(-50%) translateY(56px) scale(0.94)', 'anim-fade-up-56-center');
html = replaceStyleWithClass(html, 'will-change:transform;opacity:0;transform:translateY(56px) scale(0.94)', 'anim-fade-up-56');
html = replaceStyleWithClass(html, 'will-change:transform;opacity:0;transform:translateX(-50%) scale(0.9)', 'anim-center-scale');
html = replaceStyleWithClass(html, 'will-change:transform;opacity:0;transform:translateX(-48px)', 'anim-slide-left-48');

// 6. Countdown components
html = replaceStyleWithClass(html, 'position:relative;height:45.1px;width:26.650000000000002px;overflow:hidden;display:flex;justify-content:center', 'countdown-digit-box');
html = replaceStyleWithClass(html, 'font-size:41px;line-height:1;color:rgb(221, 164, 93);position:absolute;font-family:&quot;Inter&quot;, sans-serif;font-weight:inherit;opacity:1;filter:blur(0px);transform:none', 'countdown-digit-num');
html = replaceStyleWithClass(html, 'font-size:10px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-top:6px;text-align:center;color:rgb(136, 136, 136);font-family:&quot;Inter&quot;, sans-serif', 'countdown-unit-label');
html = replaceStyleWithClass(html, 'display:flex;flex-direction:column;align-items:center', 'flex-col-center');
html = replaceStyleWithClass(html, 'display:flex;justify-content:center', 'flex-center');

fs.writeFileSync(htmlPath, html, 'utf8');

const finalLength = html.length;
const finalStylesCount = (html.match(/style="[^"]*"/g) || []).length;
console.log(`\n✅ Finished cleanup!`);
console.log(`Styles reduced from ${initialStylesCount} to ${finalStylesCount} (-${initialStylesCount - finalStylesCount} removed).`);
console.log(`File size reduced from ${(initialLength / 1024).toFixed(1)} KB to ${(finalLength / 1024).toFixed(1)} KB (-${((initialLength - finalLength) / 1024).toFixed(1)} KB).`);
