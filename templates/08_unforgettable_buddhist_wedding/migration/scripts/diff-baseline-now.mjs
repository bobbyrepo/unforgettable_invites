import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const img1 = PNG.sync.read(fs.readFileSync('C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/baseline_first_900px.png'));
const img2 = PNG.sync.read(fs.readFileSync('C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/live_verification_now.png'));

const diff = new PNG({ width: img1.width, height: img1.height });
const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.1 });

console.log('Number of different pixels:', numDiffPixels);
fs.writeFileSync('C:/Users/sahil/.gemini/antigravity/brain/65e98c4c-69c2-4b1c-b05f-2598938d5a18/diff_baseline_vs_now.png', PNG.sync.write(diff));
