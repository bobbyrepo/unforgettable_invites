import fs from 'fs';

const css = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/css/fonts.css', 'utf8');
const fontFaces = [];
const regex = /@font-face\s*\{([^}]+)\}/g;
let m;
while ((m = regex.exec(css)) !== null) {
  const block = m[1];
  const family = block.match(/font-family:\s*["']?([^"';]+)["']?/)?.[1]?.trim();
  const weight = block.match(/font-weight:\s*([^;]+)/)?.[1]?.trim();
  const src = block.match(/src:\s*([^;]+)/)?.[1]?.trim();
  fontFaces.push({ family, weight, src });
}

console.log('Font faces count:', fontFaces.length);
console.log('Unique families:', Array.from(new Set(fontFaces.map(f => `${f.family} (weight: ${f.weight})`))));
