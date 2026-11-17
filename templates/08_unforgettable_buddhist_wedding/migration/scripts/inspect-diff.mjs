import fs from 'node:fs';
const h1 = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/baselines/dom-393.html', 'utf8');
const h2 = fs.readFileSync('E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/migration/captures/test-baseline-diff/dom-393.html', 'utf8');
console.log('h1 len:', h1.length, 'h2 len:', h2.length);
for (let i = 0; i < Math.min(h1.length, h2.length); i++) {
    if (h1[i] !== h2[i]) {
        console.log('Diff at index', i);
        console.log('h1:', JSON.stringify(h1.slice(i - 20, i + 60)));
        console.log('h2:', JSON.stringify(h2.slice(i - 20, i + 60)));
        break;
    }
}
