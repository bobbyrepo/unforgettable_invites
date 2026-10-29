const fs = require('fs');
const path = require('path');

const templatesRoot = path.join(__dirname, '..', 'templates');
const templates = fs.readdirSync(templatesRoot);

console.log('--- Starting Deep Brand & Pricing Cleanser ---');

const titles = {
    '01_unforgettable_temple_grace': 'Temple Grace Gopuram | Unforgettable Invites',
    '02_unforgettable_radha_krishna': 'Radha Krishna Vrindavan | Unforgettable Invites',
    '03_unforgettable_pastel_elegance': 'Royal Pastel Luxury | Unforgettable Invites',
    '04_unforgettable_ayodhya_heritage': 'Ayodhya Sacred Heritage | Unforgettable Invites',
    '05_unforgettable_meenakshi_royal': 'Meenakshi Royal Sanctuary | Unforgettable Invites',
    '06_unforgettable_udaipur_palace': 'Udaipur Lake Palace | Unforgettable Invites',
    '07_unforgettable_ram_mandir': 'Sacred Ram Mandir Storybook | Unforgettable Invites',
    '08_unforgettable_buddhist_wedding': 'Mahabodhi Buddhist Serenity | Unforgettable Invites'
};

const brandReplacements = [
    [/Wedding Invitation Templates\s*–\s*Missing Piece/gi, 'Luxury Wedding Invitation | Unforgettable Invites'],
    [/The Artful Invites\s*\|\s*Wedding Invitation/gi, 'Luxury Wedding Invitation | Unforgettable Invites'],
    [/The Artful Invites/gi, 'Unforgettable Invites'],
    [/Missing Piece/gi, 'Unforgettable Invites'],
    [/missingpieceinvites\.com/gi, 'unforgettableinvites.com'],
    [/demo1artfulinvites\.framer\.website/gi, 'unforgettableinvites.com'],
    [/pehlakhat\.framer\.website/gi, 'unforgettableinvites.com'],
    [/Pehla\s*Khat/gi, 'Unforgettable Invites'],
    [/pehlakhat/gi, 'unforgettable_invites'],
    [/🏛️ Ram Mandir \(Pehlakhat\)/gi, '🏛️ Sacred Ram Mandir Storybook'],
    [/🦚 Radha Krishna \(Artful\)/gi, '🦚 Radha Krishna Vrindavan'],
    [/✨ Traditional Artful Demo/gi, '✨ Royal Pastel Luxury'],
    [/🌺 Meenaya South Heritage/gi, '🌺 Meenakshi Royal Sanctuary'],
    [/👑 City-3 Royal Palace/gi, '👑 Udaipur Lake Palace']
];

const cssHideBlock = `
<style id="unforgettable-pricing-eradicator">
/* Permanently eradicate all pricing pills, buy now buttons, and competitor cart links */
.framer-JT1sO,
.framer-149jzij,
.framer-v-149jzij,
.framer-1hoq8tr,
.framer-1bblg9p,
.framer-tabn6s,
[data-framer-name*="Floating button"],
[data-framer-name*="₹ 5999"],
[data-framer-name*="Buy Now"],
a[href*="rzp.io"],
a[href*="razorpay"],
a[href*="missingpiece"] {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
    position: absolute !important;
    top: -9999px !important;
    left: -9999px !important;
}
</style>
`;

templates.forEach(t => {
    const tDir = path.join(templatesRoot, t);
    if (!fs.statSync(tDir).isDirectory()) return;

    ['index.html', 'index_remote.html'].forEach(htmlFileName => {
        const htmlPath = path.join(tDir, htmlFileName);
        if (fs.existsSync(htmlPath)) {
            let html = fs.readFileSync(htmlPath, 'utf8');

            // Apply brand replacements
            brandReplacements.forEach(([pattern, replacement]) => {
                html = html.replace(pattern, replacement);
            });

            // Set custom title if available
            if (titles[t]) {
                html = html.replace(/<title>[^<]*<\/title>/i, `<title>${titles[t]}</title>`);
            }

            // Remove Razorpay links from SSR HTML directly
            html = html.replace(/<a[^>]*href=["']https:\/\/rzp\.io[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');

            // Inject CSS hide block before </head> if not already present
            if (!html.includes('unforgettable-pricing-eradicator')) {
                html = html.replace('</head>', cssHideBlock + '</head>');
            }

            fs.writeFileSync(htmlPath, html, 'utf8');
            console.log(`✓ Cleaned ${t}/${htmlFileName}`);
        }
    });

    // Also sanitize manifest.json if present
    const manifestPath = path.join(tDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
        let manifest = fs.readFileSync(manifestPath, 'utf8');
        brandReplacements.forEach(([pattern, replacement]) => {
            manifest = manifest.replace(pattern, replacement);
        });
        fs.writeFileSync(manifestPath, manifest, 'utf8');
    }

    // Sanitize scripts if any competitor strings are inside
    const scriptsDir = path.join(tDir, 'scripts');
    if (fs.existsSync(scriptsDir)) {
        fs.readdirSync(scriptsDir).forEach(s => {
            if (s.endsWith('.mjs') || s.endsWith('.js')) {
                const sPath = path.join(scriptsDir, s);
                let code = fs.readFileSync(sPath, 'utf8');
                let changed = false;

                // Replace competitor URLs and names
                if (code.includes('missingpiece') || code.includes('Missing Piece') || code.includes('artful') || code.includes('pehlakhat')) {
                    brandReplacements.forEach(([pattern, replacement]) => {
                        if (pattern.test(code)) {
                            code = code.replace(pattern, replacement);
                            changed = true;
                        }
                    });
                }

                // In 04, 05, 06 scripts, remove "Buy Now" and "₹ 5999" text from floating button bundle
                if (code.includes('Buy Now') || code.includes('₹ 5999') || code.includes('https://rzp.io')) {
                    code = code.replace(/https:\/\/rzp\.io\/rzp\/[a-zA-Z0-9_-]+/g, '#');
                    code = code.replace(/children:`Buy Now\s*`/g, 'children:``');
                    code = code.replace(/children:`₹\s*5999`/g, 'children:``');
                    changed = true;
                }

                if (changed) {
                    fs.writeFileSync(sPath, code, 'utf8');
                    console.log(`  ✓ Sanitized script ${t}/scripts/${s}`);
                }
            }
        });
    }
});

// Update portal.html as well
const portalPath = path.join(__dirname, '..', 'portal.html');
if (fs.existsSync(portalPath)) {
    let portal = fs.readFileSync(portalPath, 'utf8');
    brandReplacements.forEach(([pattern, replacement]) => {
        portal = portal.replace(pattern, replacement);
    });
    fs.writeFileSync(portalPath, portal, 'utf8');
    console.log('✓ portal.html sanitized');
}

console.log('--- Brand & Pricing Cleanser Finished Successfully! ---');
