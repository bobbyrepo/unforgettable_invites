import fs from 'fs';
import zlib from 'zlib';

const gz = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/baselines/styles-1440.json.gz');
const json = zlib.gunzipSync(gz).toString('utf8');
const styles = JSON.parse(json);

// styles is an object with xpath or selector keys or array
console.log('Is array?', Array.isArray(styles));
console.log('Keys count:', Object.keys(styles).length);

for (const [key, val] of Object.entries(styles)) {
  const t = val.text || '';
  if (key.includes('Maya') || key.includes('Siddharth') || t.includes('Maya') || t.includes('Siddharth')) {
    console.log(key, {
      fontFamily: val.fontFamily,
      fontWeight: val.fontWeight,
      fontSize: val.fontSize,
      color: val.color,
      text: val.text
    });
  }
}
