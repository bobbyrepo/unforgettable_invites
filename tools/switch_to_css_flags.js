const fs = require('fs');
const path = require('path');

const tDir = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const flagsCssFile = path.join(tDir, 'css', 'flags.css');
const htmlFile = path.join(tDir, 'index.html');

console.log('--- Applying CSS 3D Flag Animation ---');

// 1. Append keyframes to flags.css
if (fs.existsSync(flagsCssFile)) {
    let css = fs.readFileSync(flagsCssFile, 'utf8');
    const keyframes = `
/* =========================================================================
   HIGH-PERFORMANCE 60FPS CSS 3D FLAG WAVE ANIMATIONS (Zero GPU/CPU Lag)
   ========================================================================= */
@keyframes flagWaveRight {
    0% {
        transform: perspective(850px) rotateY(0deg) skewY(0deg) scaleX(1);
    }
    25% {
        transform: perspective(850px) rotateY(-6.5deg) skewY(1deg) scaleX(0.98);
    }
    50% {
        transform: perspective(850px) rotateY(4deg) skewY(-0.8deg) scaleX(0.99);
    }
    75% {
        transform: perspective(850px) rotateY(-4.5deg) skewY(0.8deg) scaleX(0.98);
    }
    100% {
        transform: perspective(850px) rotateY(0deg) skewY(0deg) scaleX(1);
    }
}

@keyframes flagWaveLeft {
    0% {
        transform: perspective(850px) rotateY(0deg) skewY(0deg) scaleX(1);
    }
    25% {
        transform: perspective(850px) rotateY(6.5deg) skewY(-1deg) scaleX(0.98);
    }
    50% {
        transform: perspective(850px) rotateY(-4deg) skewY(0.8deg) scaleX(0.99);
    }
    75% {
        transform: perspective(850px) rotateY(4.5deg) skewY(-0.8deg) scaleX(0.98);
    }
    100% {
        transform: perspective(850px) rotateY(0deg) skewY(0deg) scaleX(1);
    }
}

.buddhist-flag-wave-right {
    transform-origin: 0% 12% !important;
    animation: flagWaveRight 4.2s ease-in-out infinite alternate !important;
    will-change: transform;
}

.buddhist-flag-wave-left {
    transform-origin: 100% 12% !important;
    animation: flagWaveLeft 4.5s ease-in-out infinite alternate !important;
    will-change: transform;
}
`;

    if (!css.includes('flagWaveRight')) {
        css += keyframes;
        fs.writeFileSync(flagsCssFile, css, 'utf8');
        console.log('✓ Added CSS keyframes to flags.css');
    }
}

// 2. Update index.html to use css-flags.js and preserve flag-simulation.js commented out
if (fs.existsSync(htmlFile)) {
    let html = fs.readFileSync(htmlFile, 'utf8');

    // Replace flag-simulation.js script tag with css-flags.js, keeping simulation commented out
    const oldTag = '<script src="./scripts/flag-simulation.js"></script>';
    const newTags = `<!-- Option 1 (ACTIVE): High-Performance CSS 3D Flag Animation (Silky Smooth 60 FPS) -->\n    <script src="./scripts/css-flags.js"></script>\n    <!-- Option 2 (PRESERVED): Heavy WebGL 3D Cloth Physics Simulation (Uncomment to re-enable) -->\n    <!-- <script src="./scripts/flag-simulation.js"></script> -->`;

    if (html.includes(oldTag)) {
        html = html.replace(oldTag, newTags);
        fs.writeFileSync(htmlFile, html, 'utf8');
        console.log('✓ index.html switched to css-flags.js (flag-simulation.js preserved in comments)');
    } else {
        console.log('Script tag already updated or using custom tag');
    }
}

console.log('--- CSS 3D Flags Active! ---');
