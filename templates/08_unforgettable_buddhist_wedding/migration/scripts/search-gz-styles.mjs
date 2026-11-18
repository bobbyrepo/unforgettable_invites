import fs from 'fs';
import zlib from 'zlib';

const gz = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/baselines/styles-1440.json.gz');
const styles = JSON.parse(zlib.gunzipSync(gz).toString('utf8'));

const entries = Object.entries(styles);
console.log('Sample key:', entries[0][0]);
console.log('Sample val:', entries[0][1]);

// Search for any entry where val has fontFamily with Miofarin or font-weight
const matches = entries.filter(([k, v]) => JSON.stringify(v).includes('Miofarin'));
console.log('Miofarin matches in baseline:', matches.length);
matches.slice(0, 5).forEach(([k, v]) => console.log(k, v));
