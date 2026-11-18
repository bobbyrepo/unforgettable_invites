import fs from 'fs';

const html = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html', 'utf8');

function findBlocks(name) {
  console.log(`\n================== ${name} ==================`);
  let idx = 0;
  while ((idx = html.indexOf(name, idx)) !== -1) {
    const start = Math.max(0, idx - 150);
    const end = Math.min(html.length, idx + 450);
    console.log('--- FOUND AT ' + idx + ' ---');
    console.log(html.substring(start, end));
    idx += name.length;
  }
}

findBlocks('Meet the Couple Heading');
findBlocks('Countdown Heading');
findBlocks('Our families are excited');
