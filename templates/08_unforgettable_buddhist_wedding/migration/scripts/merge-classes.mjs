import fs from 'fs';

const htmlPath = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// Find all HTML tags that have multiple class attributes and merge them
// e.g. <div class="a" ... class="b"> -> <div class="a b" ...>
html = html.replace(/<([a-zA-Z0-9\-]+)([^>]+)>/g, (fullTag, tagName, attrs) => {
  const classMatches = [...attrs.matchAll(/\bclass="([^"]*)"/g)];
  if (classMatches.length > 1) {
    const combinedClasses = classMatches.map(m => m[1].trim()).filter(Boolean).join(' ');
    // Remove all class attributes from attrs
    let cleanAttrs = attrs.replace(/\bclass="[^"]*"/g, '').replace(/\s+/g, ' ').trim();
    return `<${tagName} class="${combinedClasses}" ${cleanAttrs}>`;
  }
  return fullTag;
});

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully merged all duplicate class attributes!');
