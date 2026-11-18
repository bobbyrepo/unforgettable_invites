import fs from 'fs';
import { PNG } from 'pngjs';

const data = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/baselines/shot-1440-full.png');
const png = PNG.sync.read(data);
console.log('Full PNG size:', png.width, png.height);

// Crop the top 900px of full baseline
const out = new PNG({ width: png.width, height: 900 });
for (let y = 0; y < 900; y++) {
  for (let x = 0; x < png.width; x++) {
    const srcIdx = (y * png.width + x) << 2;
    const destIdx = (y * png.width + x) << 2;
    out.data[destIdx] = png.data[srcIdx];
    out.data[destIdx + 1] = png.data[srcIdx + 1];
    out.data[destIdx + 2] = png.data[srcIdx + 2];
    out.data[destIdx + 3] = png.data[srcIdx + 3];
  }
}
fs.writeFileSync('C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/baseline_hero_scroll0.png', PNG.sync.write(out));
console.log('Saved baseline_hero_scroll0.png');
