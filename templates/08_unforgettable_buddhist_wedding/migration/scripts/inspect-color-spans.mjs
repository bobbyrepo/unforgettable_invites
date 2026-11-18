import fs from 'fs';

const html = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html', 'utf8');

const target = 'style="color:rgb(95, 37, 15)"';
let idx = html.indexOf(target);
while (idx !== -1) {
  console.log('--- FOUND AT ' + idx + ' ---');
  console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + 150)));
  idx = html.indexOf(target, idx + target.length + 100000); // sample across the file
}
