const fs = require('fs');
const path = require('path');

const tmplDir = path.join(__dirname, '..', 'templates', '08_unforgettable_buddhist_wedding');
const sectionsDir = path.join(tmplDir, 'sections');
const outputPath = path.join(tmplDir, 'modular.html');

const sectionFiles = [
    '01-hero.html',
    '02-countdown.html',
    '03-story.html',
    '04-gallery.html',
    '05-timeline.html',
    '06-location.html',
    '07-footer.html'
];

const widgetFiles = [
    'widget-audio.html',
    'widget-switcher.html'
];

function assemble() {
    let sectionsContent = '';
    for (const file of sectionFiles) {
        const filePath = path.join(sectionsDir, file);
        if (fs.existsSync(filePath)) {
            sectionsContent += `\n<!-- === COMPONENT START: ${file} === -->\n` + fs.readFileSync(filePath, 'utf8') + `\n<!-- === COMPONENT END: ${file} === -->\n`;
        }
    }

    let widgetsContent = '';
    for (const file of widgetFiles) {
        const filePath = path.join(sectionsDir, file);
        if (fs.existsSync(filePath)) {
            widgetsContent += `\n<!-- === WIDGET START: ${file} === -->\n` + fs.readFileSync(filePath, 'utf8') + `\n<!-- === WIDGET END: ${file} === -->\n`;
        }
    }

    const templateHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maya &amp; Siddharth | Sacred Buddhist Wedding Invitation</title>
    
    <!-- Preconnect & Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Modular CSS Orchestration -->
    <link rel="stylesheet" href="./css/main.css">
    <link rel="stylesheet" href="./css/fonts.css">
    <link rel="stylesheet" href="./css/flags.css">
    <link rel="stylesheet" href="./css/audio-player.css">
    <link rel="stylesheet" href="./css/sections/01-hero.css">
    <link rel="stylesheet" href="./css/sections/02-countdown.css">
    <link rel="stylesheet" href="./css/sections/03-story.css">
    <link rel="stylesheet" href="./css/sections/04-gallery.css">
    <link rel="stylesheet" href="./css/sections/05-timeline.css">
    <link rel="stylesheet" href="./css/sections/06-location.css">
    <link rel="stylesheet" href="./css/sections/07-footer.css">
    
    <!-- Preload High-Priority Scenic WebP Assets -->
    <link rel="preload" as="image" href="./images/Arch_Frame_Mobile.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Temple_Mobile.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Blessing_Emblem_Mobile.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Trees_Desktop.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Cloud_Mobile.webp" fetchpriority="high">
</head>
<body class="buddhist-theme-body">
    <!-- Floating Serenity Widgets (Audio & Navigation) -->
    ${widgetsContent}

    <!-- Master Modular Wedding Invitation Container -->
    <main id="modular-wedding-app" class="modular-wedding-wrapper">
        ${sectionsContent}
    </main>

    <!-- Modular Vanilla Scripts -->
    <script src="./scripts/audio-player.js"></script>
    <script src="./scripts/flag-simulation.js"></script>
    <script src="./scripts/tree-parallax.js"></script>
    <script src="./scripts/section4-flow.js"></script>
</body>
</html>`;

    fs.writeFileSync(outputPath, templateHTML, 'utf8');
    console.log(`[${new Date().toLocaleTimeString()}] Successfully assembled modular.html from modular sections!`);
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
