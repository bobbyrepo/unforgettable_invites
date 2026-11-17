import fs from 'node:fs';
import path from 'node:path';

const SCRIPTS_DIR = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/scripts';

console.log('[merge-parallax] Creating consolidated parallax.js without unifying loops...');

const treeCode = fs.readFileSync(path.join(SCRIPTS_DIR, 'tree-parallax.js'), 'utf8');
const skyCode = fs.readFileSync(path.join(SCRIPTS_DIR, 'sky-parallax.js'), 'utf8');

const combined = `/**\n * CONSOLIDATED PARALLAX ENGINE (Tree Parallax + Sky Parallax)\n * Exact original implementations concatenated verbatim (Track 5)\n */\n\n/* === PART 1: TREE PARALLAX === */\n` + treeCode + `\n\n/* === PART 2: SKY PARALLAX === */\n` + skyCode;

fs.writeFileSync(path.join(SCRIPTS_DIR, 'parallax.js'), combined, 'utf8');
console.log('parallax.js generated successfully! Lines:', combined.split('\n').length);
