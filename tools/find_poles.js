const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/sahil/.gemini/antigravity/brain/8ed976e6-b334-475a-b552-dd6f6d3e780a/two_flags_test.png');

let offset = 8;
let ihdr = null;
const idatChunks = [];
while (offset < buf.length) {
  const length = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    ihdr = {
      width: buf.readUInt32BE(offset + 8),
      height: buf.readUInt32BE(offset + 12),
    };
  } else if (type === 'IDAT') {
    idatChunks.push(buf.subarray(offset + 8, offset + 8 + length));
  }
  offset += 12 + length;
}
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const w = ihdr.width;
const h = ihdr.height;

// Find finial tips of golden pillars (the sharp pointed tips that stick up into the sky)
// In the sky (which is blue: R<150, G<200, B>200), golden tips are distinct!
console.log('Searching for pillar top finials between Y=500 and Y=800...');
for (let x = Math.floor(w * 0.5); x < w; x += 5) {
  for (let y = 500; y < 800; y += 5) {
    const idx = (y * (w * 4 + 1)) + 1 + x * 4;
    const r = raw[idx], g = raw[idx+1], b = raw[idx+2];
    // Golden color tip surrounded by sky
    if (r > 180 && g > 120 && b < 100) {
      // Check if sky above it
      const aboveIdx = ((y - 20) * (w * 4 + 1)) + 1 + x * 4;
      const ar = raw[aboveIdx], ag = raw[aboveIdx+1], ab = raw[aboveIdx+2];
      if (ab > 180 && ar < 150) {
        console.log(`Pillar tip near X=${x} (${((x/w)*100).toFixed(1)}%), Y=${y}`);
        break;
      }
    }
  }
}
