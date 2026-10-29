const fs = require('fs');
const path = require('path');

const tDir = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const htmlFile = path.join(tDir, 'index.html');
const cssFile = path.join(tDir, 'css', 'flags.css');

console.log('--- Injecting High-Performance SVG Silk Ripple Filter ---');

// 1. Inject the SVG Silk Ripple filter into index.html
let html = fs.readFileSync(htmlFile, 'utf8');

const svgFilterBlock = `
<!-- =========================================================================
     HARDWARE-ACCELERATED SVG SILK CLOTH RIPPLE FILTER (Zero WebGL Lag)
     ========================================================================= -->
<svg width="0" height="0" style="position:absolute;pointer-events:none;opacity:0;" aria-hidden="true">
  <defs>
    <filter id="buddhist-silk-ripple-right" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" result="noise" seed="3">
        <animate attributeName="baseFrequency" dur="4.2s" values="0.012 0.035; 0.018 0.055; 0.012 0.035" repeatCount="indefinite" />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
    </filter>

    <filter id="buddhist-silk-ripple-left" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.014 0.038" numOctaves="2" result="noise" seed="7">
        <animate attributeName="baseFrequency" dur="4.6s" values="0.014 0.038; 0.020 0.060; 0.014 0.038" repeatCount="indefinite" />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>
`;

if (!html.includes('id="buddhist-silk-ripple-right"')) {
    html = html.replace('</body>', svgFilterBlock + '\n</body>');
}

// Ensure css-flags.js is active
html = html.replace('<!-- <script src="./scripts/css-flags.js"></script> -->', '<script src="./scripts/css-flags.js"></script>');
fs.writeFileSync(htmlFile, html, 'utf8');
console.log('✓ Injected SVG Silk Ripple filter into index.html');

// 2. Update css/flags.css to apply the ripple filter along with 3D wave keyframes
let css = fs.readFileSync(cssFile, 'utf8');

const rippleStyles = `
/* Silk Cloth Ripple Distortion + 3D Sway */
.buddhist-flag-wave-right {
    filter: url(#buddhist-silk-ripple-right)
            drop-shadow(0px 6px 16px rgba(180, 120, 20, 0.08))
            saturate(var(--flag-saturation, 0.82))
            brightness(var(--flag-brightness-filter, 0.96)) !important;
    transform-origin: 0% 12% !important;
    animation: flagWaveRight 4.2s ease-in-out infinite alternate !important;
    will-change: transform;
}

.buddhist-flag-wave-left {
    filter: url(#buddhist-silk-ripple-left)
            drop-shadow(0px 6px 16px rgba(180, 120, 20, 0.08))
            saturate(var(--flag-saturation, 0.82))
            brightness(var(--flag-brightness-filter, 0.96)) !important;
    transform-origin: 100% 12% !important;
    animation: flagWaveLeft 4.6s ease-in-out infinite alternate !important;
    will-change: transform;
}
`;

if (!css.includes('buddhist-silk-ripple-right')) {
    css += rippleStyles;
    fs.writeFileSync(cssFile, css, 'utf8');
    console.log('✓ Applied ripple filter to flags.css');
}

console.log('--- High-Performance Silk Rippling Active! ---');
