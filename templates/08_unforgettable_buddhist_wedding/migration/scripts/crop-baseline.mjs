import fs from 'fs';
import { PNG } from 'pngjs';

// Crop function for PNG
function cropPng(srcPath, destPath, clip) {
  const data = fs.readFileSync(srcPath);
  const png = PNG.sync.read(data);
  const out = new PNG({ width: clip.width, height: clip.height });

  for (let y = 0; y < clip.height; y++) {
    for (let x = 0; x < clip.width; x++) {
      const srcIdx = ((clip.y + y) * png.width + (clip.x + x)) << 2;
      const destIdx = (y * clip.width + x) << 2;
      out.data[destIdx] = png.data[srcIdx];
      out.data[destIdx + 1] = png.data[srcIdx + 1];
      out.data[destIdx + 2] = png.data[srcIdx + 2];
      out.data[destIdx + 3] = png.data[srcIdx + 3];
    }
  }
  fs.writeFileSync(destPath, PNG.sync.write(out));
}

// Hero names clip on 1440
// Maya is around x: 300..1000, y: 150..650
const clip = { x: 350, y: 180, width: 740, height: 500 };
cropPng('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/baselines/viewport-1440/capture.png',
        'C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/baseline_hero_crop.png', clip);

console.log('BASELINE_CROP_SAVED');
