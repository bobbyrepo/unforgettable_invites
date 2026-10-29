const fs = require('fs');
const path = require('path');

// Read the studio snippet from tools/create_flag_studio.js
const studioFile = fs.readFileSync('tools/create_flag_studio.js', 'utf8');
const startIdx = studioFile.indexOf('<!-- =====================================================================');
const endIdx = studioFile.indexOf('`;', startIdx);
const studioHtml = studioFile.slice(startIdx, endIdx);

function injectStudio(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove old studio if present
    content = content.replace(/<!-- =+[\s\S]*?VISUAL FLAG STUDIO[\s\S]*?<\/script>/, '');

    // Insert right before </body>
    content = content.replace('</body>', studioHtml + '\n</body>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Injected Visual Flag Studio into', filePath);
}

injectStudio('templates/08_buddhist_wedding/index.html');
injectStudio('templates/08_buddhist_wedding/index_remote.html');
console.log('Done!');
