const fs = require('fs');
const path = require('path');

const tmplDir = path.join(__dirname, '..', 'templates', '08_unforgettable_buddhist_wedding');
const sectionsDir = path.join(tmplDir, 'sections');
const outputPath = path.join(tmplDir, 'modular.html');
const indexHtml = fs.readFileSync(path.join(tmplDir, 'index.html'), 'utf8');

// Master 4 Core Sections matching exact Framer architecture
const sectionFiles = [
    '01-hero.html',
    '02-timeline.html',
    '03-meet-couple.html',
    '04-location-countdown.html'
];

const widgetFiles = [
    'widget-audio.html',
    'widget-switcher.html'
];

// Extract Framer runtime appear engine from index.html (lines 11242 to 11268)
const indexLines = indexHtml.split('\n');
const framerEngine = indexLines.slice(11241, 11268).join('\n');

function assemble() {
    let sectionsContent = '';
    for (const file of sectionFiles) {
        const filePath = path.join(sectionsDir, file);
        if (fs.existsSync(filePath)) {
            sectionsContent += `\n<!-- === SECTION: ${file} === -->\n` + fs.readFileSync(filePath, 'utf8') + `\n<!-- === END SECTION: ${file} === -->\n`;
        } else {
            console.warn(`Warning: Section file not found: ${file}`);
        }
    }

    let widgetsContent = '';
    for (const file of widgetFiles) {
        const filePath = path.join(sectionsDir, file);
        if (fs.existsSync(filePath)) {
            widgetsContent += `\n<!-- === WIDGET: ${file} === -->\n` + fs.readFileSync(filePath, 'utf8') + `\n<!-- === END WIDGET: ${file} === -->\n`;
        }
    }

    const templateHTML = `<!DOCTYPE html>
<!-- Made in Framer · framer.com -->
<html dir="ltr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Maya &amp; Siddharth | Sacred Buddhist Wedding Invitation</title>
    <meta name="description"
        content="A sacred and sublime Buddhist wedding invitation inspired by the serene enlightenment of Bodh Gaya Mahabodhi Temple and the sacred Bodhi Tree. 🪷☸️ ">
    <link href="./images/default-favicon-light.v1.webp" rel="icon" media="(prefers-color-scheme: light)">
    <link href="./images/default-favicon-dark.v1.webp" rel="icon" media="(prefers-color-scheme: dark)">

    <!-- High-Priority Scenic Asset Preloads -->
    <link rel="preload" as="image" href="./images/Right flag.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Left Flag.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Alcove_Backdrop_Mobile.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Trees_Desktop.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Message_Frame_Mobile.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Message_Frame_Desktop.webp" fetchpriority="high">

    <!-- Master Stylesheet (Imports typography, breakpoints, framer-core, overrides) -->
    <link rel="stylesheet" href="./css/main.css">
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
</head>

<body>
    <!-- Floating Serenity Widgets (Audio & Navigation) -->
    ${widgetsContent}

    <!-- Master Modular Framer Container -->
    <div id="main"
        data-framer-hydrate-v2="{&quot;routeId&quot;:&quot;augiA20Il&quot;,&quot;localeId&quot;:&quot;default&quot;,&quot;breakpoints&quot;:[{&quot;hash&quot;:&quot;flz1ju&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1920px)&quot;},{&quot;hash&quot;:&quot;vlymnr&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1728px) and (max-width: 1919.98px)&quot;},{&quot;hash&quot;:&quot;bsay70&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1559px) and (max-width: 1727.98px)&quot;},{&quot;hash&quot;:&quot;72rtr7&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1349px) and (max-width: 1558.98px)&quot;},{&quot;hash&quot;:&quot;1b8a3mn&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1280px) and (max-width: 1348.98px)&quot;},{&quot;hash&quot;:&quot;1tc0fsl&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 960px) and (max-width: 1279.98px)&quot;},{&quot;hash&quot;:&quot;k2tod6&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 834px) and (max-width: 959.98px)&quot;},{&quot;hash&quot;:&quot;11v2ks5&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 768px) and (max-width: 833.98px)&quot;},{&quot;hash&quot;:&quot;sdmwty&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 430px) and (max-width: 767.98px)&quot;},{&quot;hash&quot;:&quot;1kglzlv&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 412px) and (max-width: 429.98px)&quot;},{&quot;hash&quot;:&quot;zeltxf&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 393px) and (max-width: 411.98px)&quot;},{&quot;hash&quot;:&quot;1cx7v4z&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 390px) and (max-width: 392.98px)&quot;},{&quot;hash&quot;:&quot;1tqqkff&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 375px) and (max-width: 389.98px)&quot;},{&quot;hash&quot;:&quot;7902is&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 360px) and (max-width: 374.98px)&quot;},{&quot;hash&quot;:&quot;1kw8tgm&quot;,&quot;mediaQuery&quot;:&quot;(max-width: 359.98px)&quot;}]}"
        data-framer-ssr-released-at="2026-10-16T08:56:29.327Z" data-framer-page-optimized-at="2026-10-19T08:03:59.722Z"
        data-framer-generated-page>
        <div data-framer-root class="framer-SNM3S framer-72rtr7" style="min-height:100vh;width:auto">
            <div class="framer-11g1igv-container" data-framer-name="Smooth Scroll (utility)" name="Smooth Scroll (utility)">
                <div class="ssr-variant"><div></div></div>
            </div>
            <div class="framer-rweuzc hidden-72rtr7 hidden-1b8a3mn hidden-bsay70 hidden-flz1ju hidden-vlymnr hidden-k2tod6 hidden-11v2ks5 hidden-1tc0fsl" data-framer-name="393">
                ${sectionsContent}
            </div>
        </div>
    </div>

    <!-- Master Framer Appear & Animation Engine -->
    ${framerEngine}

    <!-- Active Runtime Scripts -->
    <script src="./scripts/audio-player.js"></script>
    <script src="./scripts/tree-parallax.js"></script>
    <script src="./scripts/flag-simulation.js"></script>
    <script src="./content/wedding-content.js"></script>
    <script src="./scripts/content-manager.js"></script>
    <script src="./scripts/section4-flow.js"></script>
</body>
</html>`;

    fs.writeFileSync(outputPath, templateHTML, 'utf8');
    console.log(`[${new Date().toLocaleTimeString()}] Successfully assembled modular.html with 4 core sections & Framer engine!`);
}

assemble();

if (process.argv.includes('--watch')) {
    console.log('Watching templates/08_unforgettable_buddhist_wedding/sections for changes...');
    let timeout = null;
    fs.watch(sectionsDir, (eventType, filename) => {
        if (filename && filename.endsWith('.html')) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                console.log(`Detected change in ${filename}, re-assembling...`);
                assemble();
            }, 100);
        }
    });
}
