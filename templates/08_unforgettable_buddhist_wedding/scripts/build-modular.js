const fs = require('fs');
const path = require('path');

const baseDir = 'E:\\Unforgettable_Invites\\Web_Templates\\templates\\08_unforgettable_buddhist_wedding';

function readSec(sub, file) {
    const p = path.join(baseDir, 'sections', sub, file);
    return fs.readFileSync(p, 'utf8').trim();
}

function buildModular() {
    console.log('[Builder] Assembling modular architecture...');

    // Read all modular components
    const mHero = readSec('mobile', '01-hero.html');
    const mTimeline = readSec('mobile', '02-timeline.html');
    const mMeet = readSec('mobile', '03-meet-couple.html');
    const mLoc = readSec('mobile', '04-location-countdown.html');

    const dHero = readSec('desktop', '01-hero.html');
    const dTimeline = readSec('desktop', '02-timeline.html');
    const dMeet = readSec('desktop', '03-meet-couple.html');
    const dLoc = readSec('desktop', '04-location-countdown.html');

    const tHero = readSec('tablet', '01-hero.html');
    const tTimeline = readSec('tablet', '02-timeline.html');
    const tMeet = readSec('tablet', '03-meet-couple.html');
    const tLoc = readSec('tablet', '04-location-countdown.html');

    const wAudio = fs.readFileSync(path.join(baseDir, 'sections', 'widget-audio.html'), 'utf8').trim();
    const wSwitcher = fs.readFileSync(path.join(baseDir, 'sections', 'widget-switcher.html'), 'utf8').trim();

    const modularHtml = `<!DOCTYPE html>
<!-- Unforgettable Invites — Buddhist Wedding Modular Architecture -->
<html dir="ltr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Maya &amp; Siddharth | Sacred Buddhist Wedding Invitation</title>
    <meta name="description"
        content="A sacred and sublime Buddhist wedding invitation inspired by the serene enlightenment of Bodh Gaya Mahabodhi Temple and the sacred Bodhi Tree. 🪷☸️">
    <link href="./images/default-favicon-light.v1.webp" rel="icon" media="(prefers-color-scheme: light)">
    <link href="./images/default-favicon-dark.v1.webp" rel="icon" media="(prefers-color-scheme: dark)">

    <!-- High-Priority Scenic Asset Preloads -->
    <link rel="preload" as="image" href="./images/Right flag.webp" fetchpriority="high" crossorigin="anonymous">
    <link rel="preload" as="image" href="./images/Left Flag.webp" fetchpriority="high" crossorigin="anonymous">
    <link rel="preload" as="image" href="./images/Alcove_Backdrop_Mobile.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Trees_Desktop.webp" fetchpriority="high" media="(min-width: 1280px)">
    <link rel="preload" as="image" href="./images/Message_Frame_Mobile.webp" fetchpriority="high">
    <link rel="preload" as="image" href="./images/Message_Frame_Desktop.webp" fetchpriority="high" media="(min-width: 1280px)">

    <!-- Master Modular Stylesheet -->
    <link rel="stylesheet" href="./css/main.css">
    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
</head>

<body>
    <!-- Floating Serenity Widgets (Audio & Navigation) -->
    ${wAudio}
    ${wSwitcher}

    <!-- Master Scaled Canvas: Preserves Framer layout classes with 100% fidelity -->
    <div id="main"
        data-framer-hydrate-v2="{&quot;routeId&quot;:&quot;augiA20Il&quot;,&quot;localeId&quot;:&quot;default&quot;,&quot;breakpoints&quot;:[{&quot;hash&quot;:&quot;flz1ju&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1920px)&quot;},{&quot;hash&quot;:&quot;vlymnr&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1728px) and (max-width: 1919.98px)&quot;},{&quot;hash&quot;:&quot;bsay70&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1559px) and (max-width: 1727.98px)&quot;},{&quot;hash&quot;:&quot;72rtr7&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1349px) and (max-width: 1558.98px)&quot;},{&quot;hash&quot;:&quot;1b8a3mn&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 1280px) and (max-width: 1348.98px)&quot;},{&quot;hash&quot;:&quot;1tc0fsl&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 960px) and (max-width: 1279.98px)&quot;},{&quot;hash&quot;:&quot;k2tod6&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 834px) and (max-width: 959.98px)&quot;},{&quot;hash&quot;:&quot;11v2ks5&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 768px) and (max-width: 833.98px)&quot;},{&quot;hash&quot;:&quot;sdmwty&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 430px) and (max-width: 767.98px)&quot;},{&quot;hash&quot;:&quot;1kglzlv&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 412px) and (max-width: 429.98px)&quot;},{&quot;hash&quot;:&quot;zeltxf&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 393px) and (max-width: 411.98px)&quot;},{&quot;hash&quot;:&quot;1cx7v4z&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 390px) and (max-width: 392.98px)&quot;},{&quot;hash&quot;:&quot;1tqqkff&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 375px) and (max-width: 389.98px)&quot;},{&quot;hash&quot;:&quot;7902is&quot;,&quot;mediaQuery&quot;:&quot;(min-width: 360px) and (max-width: 374.98px)&quot;},{&quot;hash&quot;:&quot;1kw8tgm&quot;,&quot;mediaQuery&quot;:&quot;(max-width: 359.98px)&quot;}]}"
        data-framer-ssr-released-at="2026-10-16T08:56:29.327Z" data-framer-page-optimized-at="2026-10-19T08:03:59.722Z"
        data-framer-generated-page>
        <div data-framer-root class="framer-SNM3S framer-72rtr7" style="min-height: 100vh; width: auto;">
            <div class="framer-11g1igv-container" data-framer-name="Smooth Scroll (utility)" name="Smooth Scroll (utility)">
                <div class="ssr-variant"><div></div></div>
            </div>

            <!-- ================================================================= -->
            <!-- 1. MOBILE CANVA (Viewport < 768px: Mobile 393)                   -->
            <!-- ================================================================= -->
            <div class="framer-rweuzc hidden-72rtr7 hidden-1b8a3mn hidden-bsay70 hidden-flz1ju hidden-vlymnr hidden-k2tod6 hidden-11v2ks5 hidden-1tc0fsl"
                data-framer-name="393">
                <!-- Mobile Section 02: Wedding Timeline -->
                ${mTimeline}

                <!-- Mobile Section 01: Hero & Invitation -->
                ${mHero}

                <!-- Mobile Section 03: Meet the Couple -->
                ${mMeet}

                <!-- Mobile Section 04: Location & Countdown -->
                ${mLoc}
            </div>

            <!-- ================================================================= -->
            <!-- 2. DESKTOP CANVA (Viewport >= 1280px: Main Desktop)              -->
            <!-- ================================================================= -->
            <div class="framer-kmaf13 hidden-sdmwty hidden-zeltxf hidden-1cx7v4z hidden-7902is hidden-1kw8tgm hidden-1kglzlv hidden-k2tod6 hidden-1tqqkff hidden-11v2ks5 hidden-1tc0fsl"
                data-framer-name="Main">
                <!-- Desktop Section 04: Location & Countdown -->
                ${dLoc}

                <!-- Desktop Section 03: Meet the Couple -->
                ${dMeet}

                <!-- Desktop Section 02: Wedding Timeline -->
                ${dTimeline}

                <!-- Desktop Section 01: Hero & Invitation -->
                ${dHero}
            </div>

            <!-- ================================================================= -->
            <!-- 3. TABLET CANVA (Viewport 768px - 1279px: Tablet)                -->
            <!-- ================================================================= -->
            <div class="framer-1uvujcp hidden-72rtr7 hidden-1b8a3mn hidden-bsay70 hidden-flz1ju hidden-vlymnr hidden-sdmwty hidden-zeltxf hidden-1cx7v4z hidden-7902is hidden-1kw8tgm hidden-1kglzlv hidden-1tqqkff"
                data-framer-name="393">
                <!-- Tablet Section 02: Wedding Timeline -->
                ${tTimeline}

                <!-- Tablet Section 01: Hero & Invitation -->
                ${tHero}

                <!-- Tablet Section 03: Meet the Couple -->
                ${tMeet}

                <!-- Tablet Section 04: Location & Countdown -->
                ${tLoc}
            </div>
        </div>
        <div id="overlay"></div>
    </div>

    <!-- Master Framer Appear & Animation Engine (Spring Physics & Easing) -->
    <script src="./scripts/framer-animator.js"></script>

    <!-- Master Framer Hydration Runtime -->
    <script type="module" async data-framer-bundle="main" fetchpriority="low" src="./scripts/script_main.BNALTGIK.mjs"></script>

    <!-- Master Interactive Scripts & Physics Engines -->
    <script src="./scripts/watermark-cleaner.js"></script>
    <script src="./scripts/audio-player.js"></script>
    <script src="./scripts/tree-parallax.js"></script>
    <script src="./scripts/flag-simulation.js"></script>
    <script src="./scripts/flag-studio.js"></script>
    <script src="./scripts/css-flags.js"></script>
    <script src="./content/wedding-content.js"></script>
    <script src="./scripts/content-manager.js"></script>
    <script src="./scripts/section4-flow.js"></script>
</body>

</html>`;

    const outPath = path.join(baseDir, 'modular.html');
    fs.writeFileSync(outPath, modularHtml, 'utf8');
    console.log(`[Builder] Successfully generated "${outPath}" (${modularHtml.length} characters)`);
}

buildModular();
