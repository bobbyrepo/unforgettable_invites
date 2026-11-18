import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

// Let's check if there is diff-shot or baseline shot
const baselineShot = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/baselines/shot-1440-25.png';
if (fs.existsSync(baselineShot)) {
  console.log('Baseline shot-1440-25 exists!');
} else {
  console.log('Baseline shot does not exist');
}
