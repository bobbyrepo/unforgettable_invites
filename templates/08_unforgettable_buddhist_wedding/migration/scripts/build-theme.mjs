import fs from 'node:fs';
import path from 'node:path';

const CSS_DIR = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css';

const overrides = fs.readFileSync(path.join(CSS_DIR, 'overrides.css'), 'utf8');
const controls = fs.readFileSync(path.join(CSS_DIR, 'controls.css'), 'utf8');
const content = fs.readFileSync(path.join(CSS_DIR, 'content.css'), 'utf8');

const heroSectionPath = path.join(CSS_DIR, 'sections/01-hero.css');
const heroSection = fs.existsSync(heroSectionPath) ? fs.readFileSync(heroSectionPath, 'utf8') : '';

let themeContent = `/* ==========================================================================\n   THEME.CSS — CONSOLIDATED OVERRIDES, CONTROLS, CONTENT & SECTIONS\n   ========================================================================== */\n\n`;
themeContent += `/* --- 1. OVERRIDES --- */\n` + overrides + `\n\n`;
themeContent += `/* --- 2. CONTROLS --- */\n` + controls + `\n\n`;
themeContent += `/* --- 3. CONTENT INJECTIONS --- */\n` + content + `\n\n`;
if (heroSection) {
    themeContent += `/* --- 4. SECTION 01 HERO --- */\n` + heroSection + `\n\n`;
}

fs.writeFileSync(path.join(CSS_DIR, 'theme.css'), themeContent, 'utf8');
console.log('theme.css generated successfully! Length:', themeContent.length);
