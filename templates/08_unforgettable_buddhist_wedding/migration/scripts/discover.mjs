import fs from 'node:fs';
import path from 'node:path';
import * as parse5 from 'parse5';
import postcss from 'postcss';

const ROOT = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';

async function runDiscovery() {
    console.log('[discovery] Running Phase D discovery...');
    const facts = {
        timestamp: new Date().toISOString(),
        inventory: {},
        headOrder: { stylesheets: [], scripts: [] },
        breakpointBoundaries: [],
        interactiveSelectors: [],
        targetDirectories: [],
        deviations: []
    };

    // D1: Inventory
    function scanDir(dir) {
        let entries = [];
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const f of files) {
            if (f.name === 'node_modules' || f.name === '.git') continue;
            const full = path.join(dir, f.name);
            if (f.isDirectory()) {
                entries = entries.concat(scanDir(full));
            } else {
                const stat = fs.statSync(full);
                let lineCount = null;
                if (/\.(html|css|js|mjs|json|md)$/i.test(f.name)) {
                    try {
                        const content = fs.readFileSync(full, 'utf8');
                        lineCount = content.split('\n').length;
                    } catch (e) {}
                }
                entries.push({
                    relPath: path.relative(ROOT, full).replace(/\\/g, '/'),
                    sizeBytes: stat.size,
                    lines: lineCount
                });
            }
        }
        return entries;
    }
    facts.inventory = scanDir(ROOT);

    // D2: Head Order & Scripts from index.html
    const htmlPath = path.join(ROOT, 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const doc = parse5.parse(htmlContent, { sourceCodeLocationInfo: true });

    function findNodes(node, matchFn, acc = []) {
        if (matchFn(node)) acc.push(node);
        if (node.childNodes) {
            for (const c of node.childNodes) findNodes(c, matchFn, acc);
        }
        return acc;
    }

    const links = findNodes(doc, n => n.nodeName === 'link' && n.attrs?.some(a => a.name === 'rel' && a.value === 'stylesheet'));
    facts.headOrder.stylesheets = links.map(l => {
        const href = l.attrs.find(a => a.name === 'href')?.value;
        const media = l.attrs.find(a => a.name === 'media')?.value || null;
        const disabled = l.attrs.some(a => a.name === 'disabled');
        return { href, media, disabled, loc: l.sourceCodeLocation?.startOffset };
    });

    const scripts = findNodes(doc, n => n.nodeName === 'script');
    facts.headOrder.scripts = scripts.map(s => {
        const src = s.attrs?.find(a => a.name === 'src')?.value || null;
        const type = s.attrs?.find(a => a.name === 'type')?.value || 'classic';
        const isAsync = s.attrs?.some(a => a.name === 'async') || false;
        const isDefer = s.attrs?.some(a => a.name === 'defer') || false;
        const id = s.attrs?.find(a => a.name === 'id')?.value || null;
        return {
            src,
            type,
            async: isAsync,
            defer: isDefer,
            id,
            startOffset: s.sourceCodeLocation?.startOffset,
            endOffset: s.sourceCodeLocation?.endOffset,
            startLine: s.sourceCodeLocation?.startLine
        };
    });

    // D3: Breakpoint boundaries
    const bpFiles = ['css/breakpoints.css', 'css/framer-core.css'];
    const bpSet = new Set();
    for (const rel of bpFiles) {
        const full = path.join(ROOT, rel);
        if (fs.existsSync(full)) {
            const css = fs.readFileSync(full, 'utf8');
            try {
                const root = postcss.parse(css);
                root.walkAtRules('media', rule => {
                    const matches = rule.params.match(/\b\d+(\.\d+)?px\b/g);
                    if (matches) {
                        for (const m of matches) {
                            const val = Math.round(parseFloat(m));
                            if (val >= 200 && val <= 3000) bpSet.add(val);
                        }
                    }
                });
            } catch (err) {
                // Safe fallback regex for media queries if CSS contains legacy non-standard snippets
                const mediaMatches = css.matchAll(/@media[^{]+\{/g);
                for (const mm of mediaMatches) {
                    const pxMatches = mm[0].match(/\b\d+(\.\d+)?px\b/g);
                    if (pxMatches) {
                        for (const m of pxMatches) {
                            const val = Math.round(parseFloat(m));
                            if (val >= 200 && val <= 3000) bpSet.add(val);
                        }
                    }
                }
                facts.deviations.push({
                    file: rel,
                    issue: 'postcss parse error',
                    details: err.message
                });
            }
        }
    }
    facts.breakpointBoundaries = Array.from(bpSet).sort((a, b) => a - b);

    // D4: Interactive elements
    const customJsFiles = [
        'scripts/audio-player.js',
        'scripts/content-manager.js',
        'scripts/group-manager.js',
        'scripts/sky-parallax.js',
        'scripts/tree-parallax.js',
        'scripts/section4-flow.js'
    ];
    const selectors = new Set();
    selectors.add('#buddhist-audio-controller');
    selectors.add('#template-select-dropdown');
    selectors.add('[data-framer-name="Photo Gallery"]');
    for (const rel of customJsFiles) {
        const p = path.join(ROOT, rel);
        if (fs.existsSync(p)) {
            const code = fs.readFileSync(p, 'utf8');
            const matches = code.matchAll(/(?:querySelector(?:All)?|getElementById)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g);
            for (const m of matches) {
                if (m[1] && !m[1].includes('${')) {
                    selectors.add(m[1].startsWith('#') || m[1].startsWith('.') || m[1].startsWith('[') ? m[1] : '#' + m[1]);
                }
            }
        }
    }
    facts.interactiveSelectors = Array.from(selectors);

    // D5: Target directories discovery
    const templatesDir = path.resolve(ROOT, '..');
    const candidateDirs = fs.readdirSync(templatesDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => path.join(templatesDir, d.name));

    facts.targetDirectories = candidateDirs.map(d => ({
        path: d.replace(/\\/g, '/'),
        hasIndexHtml: fs.existsSync(path.join(d, 'index.html')),
        hasContentJson: fs.existsSync(path.join(d, 'content.json'))
    })).filter(t => t.hasIndexHtml);

    // Write facts
    const factsPath = path.join(ROOT, 'migration/FACTS.md');
    let md = `# Migration Facts & Ground Truth (Phase D)\n\n`;
    md += `Generated: ${facts.timestamp}\n\n`;
    md += `## D1 Inventory Summary\n`;
    md += `- Total files: ${facts.inventory.length}\n`;
    md += `- HTML: index.html (${htmlContent.split('\n').length} lines)\n\n`;

    md += `## D2 Head Order & Stylesheets\n`;
    facts.headOrder.stylesheets.forEach((s, idx) => {
        md += `${idx + 1}. \`${s.href}\` (media: ${s.media || 'none'}, disabled: ${s.disabled})\n`;
    });

    md += `\n## D2 Script Inventory (${facts.headOrder.scripts.length} tags)\n`;
    facts.headOrder.scripts.forEach((s, idx) => {
        md += `${idx + 1}. [L${s.startLine}] ${s.src ? 'src: `' + s.src + '`' : 'inline (id: ' + s.id + ')'} (type: ${s.type}, async: ${s.async}, defer: ${s.defer})\n`;
    });

    md += `\n## D3 Breakpoint Boundaries (${facts.breakpointBoundaries.length} boundaries)\n`;
    md += `${facts.breakpointBoundaries.join(', ')} px\n\n`;

    md += `## D4 Interactive Selectors\n`;
    facts.interactiveSelectors.forEach(sel => {
        md += `- \`${sel}\`\n`;
    });

    md += `\n## D5 Target Directories Found (${facts.targetDirectories.length})\n`;
    facts.targetDirectories.forEach(t => {
        md += `- \`${t.path}\` (index.html: ${t.hasIndexHtml}, content.json: ${t.hasContentJson})\n`;
    });

    fs.writeFileSync(factsPath, md, 'utf8');
    fs.writeFileSync(path.join(ROOT, 'migration/facts.json'), JSON.stringify(facts, null, 2), 'utf8');
    console.log(`[discovery] FACTS.md written successfully to ${factsPath}`);
}

runDiscovery().catch(err => {
    console.error('[discovery] Error:', err);
    process.exit(1);
});
