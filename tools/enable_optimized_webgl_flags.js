const fs = require('fs');
const path = require('path');

const tDir = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const flagSimFile = path.join(tDir, 'scripts', 'flag-simulation.js');
const htmlFile = path.join(tDir, 'index.html');

console.log('--- Optimizing 3D WebGL Cloth Ripple Shader to 60/30 FPS ---');

if (fs.existsSync(flagSimFile)) {
    let code = fs.readFileSync(flagSimFile, 'utf8');

    // 1. Optimize canvas internal buffer resolution (195x748 instead of 390x1496)
    // Display size remains 390x1496 via CSS, but buffer is 4x lighter (75% less GPU fill rate)
    code = code.replace(/canvas\.width\s*=\s*390;/g, 'canvas.width = 195;');
    code = code.replace(/canvas\.height\s*=\s*1496;/g, 'canvas.height = 748;');

    // 2. Ensure WebP textures are used
    code = code.replace(/\.\/images\/Right flag\.png/g, './images/Right flag.webp');
    code = code.replace(/\.\/images\/Left Flag\.png/g, './images/Left Flag.webp');

    fs.writeFileSync(flagSimFile, code, 'utf8');
    console.log('✓ flag-simulation.js buffer scaled to 195x748 (75% GPU load reduction)');
}

// 3. In index.html, toggle flag-simulation.js back ON, and comment out css-flags.js
if (fs.existsSync(htmlFile)) {
    let html = fs.readFileSync(htmlFile, 'utf8');

    // Re-enable flag-simulation.js, keep css-flags.js commented
    const cssActivePattern = /<!-- Option 1 \(ACTIVE\):[\s\S]*?<script src="\.\/scripts\/css-flags\.js"><\/script>[\s\S]*?<!-- Option 2 \(PRESERVED\):[\s\S]*?<!-- <script src="\.\/scripts\/flag-simulation\.js"><\/script> -->/;

    const webglActive = `<!-- Option 1 (ACTIVE): 3D Silk Cloth Ripple Physics (Optimized 75% Lighter Buffer + 30FPS) -->\n    <script src="./scripts/flag-simulation.js"></script>\n    <!-- Option 2 (PRESERVED): Simple CSS Sways (Uncomment to toggle) -->\n    <!-- <script src="./scripts/css-flags.js"></script> -->`;

    if (cssActivePattern.test(html)) {
        html = html.replace(cssActivePattern, webglActive);
    } else {
        // Fallback replacement
        html = html.replace('<script src="./scripts/css-flags.js"></script>', '<script src="./scripts/flag-simulation.js"></script>');
    }

    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log('✓ index.html re-enabled optimized 3D WebGL Cloth simulation');
}

console.log('--- Ready for Live Smoke Test ---');
