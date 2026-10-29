const fs = require('fs');
const file = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Remove hideEditorBar script (it had MutationObserver on document.body)
const idx1 = html.indexOf('function hideEditorBar()');
if (idx1 !== -1) {
    const startScript = html.lastIndexOf('<script>', idx1);
    const endScript = html.indexOf('</script>', idx1) + 9;
    html = html.substring(0, startScript) + html.substring(endScript);
    console.log('✓ Removed hideEditorBar MutationObserver');
}

// 2. Remove hideFramerBadge script (it had MutationObserver on document.body)
const idx2 = html.indexOf('function hideFramerBadge()');
if (idx2 !== -1) {
    const startScript = html.lastIndexOf('<script>', idx2);
    const endScript = html.indexOf('</script>', idx2) + 9;
    html = html.substring(0, startScript) + html.substring(endScript);
    console.log('✓ Removed hideFramerBadge MutationObserver');
}

// 3. Remove bestfreecdn third-party script
const idx3 = html.indexOf('bestfreecdn.com');
if (idx3 !== -1) {
    const startScript = html.lastIndexOf('<script', idx3);
    const endScript = html.indexOf('</script>', idx3) + 9;
    html = html.substring(0, startScript) + html.substring(endScript);
    console.log('✓ Removed bestfreecdn tracker script');
}

fs.writeFileSync(file, html, 'utf8');
console.log('--- Index.html is now 100% clean of background DOM listeners! ---');
