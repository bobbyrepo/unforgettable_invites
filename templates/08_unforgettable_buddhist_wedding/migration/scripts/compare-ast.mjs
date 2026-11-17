import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const ROOT = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const layoutCssPath = path.join(ROOT, 'css/layout.css');

function extractNormalizedAst(root) {
    const entries = [];
    root.walk(node => {
        if (node.type === 'rule') {
            const decls = [];
            node.walkDecls(d => {
                decls.push([d.prop, d.value.trim(), Boolean(d.important)]);
            });
            entries.push({
                type: 'rule',
                selector: node.selector.trim(),
                decls
            });
        } else if (node.type === 'atrule') {
            entries.push({
                type: 'atrule',
                name: node.name,
                params: node.params.trim()
            });
        }
    });
    return entries;
}

async function run() {
    console.log('[compare-ast] Reading original framer-core.css and current layout.css...');
    const originalCss = fs.readFileSync(path.join(ROOT, 'css/framer-core.css'), 'utf8');
    const layoutCss = fs.readFileSync(layoutCssPath, 'utf8');

    // Safe parse: handle any non-standard vendor identifiers
    function safeParse(css) {
        return postcss.parse(css.replace(/\{bing\}/g, '{}'));
    }

    const astOrig = safeParse(originalCss);
    const astLayout = safeParse(layoutCss);

    const normOrig = extractNormalizedAst(astOrig);
    const normLayout = extractNormalizedAst(astLayout);

    console.log(`[compare-ast] Original rules/at-rules: ${normOrig.length} | Layout rules/at-rules: ${normLayout.length}`);

    if (normOrig.length !== normLayout.length) {
        console.error('[compare-ast] AST length mismatch!');
        process.exit(1);
    }

    const origJson = JSON.stringify(normOrig);
    const layoutJson = JSON.stringify(normLayout);

    if (origJson === layoutJson) {
        console.log('✅ [compare-ast] ASTs are 100% IDENTICAL and EQUIVALENT.');
        process.exit(0);
    } else {
        console.error('❌ [compare-ast] AST content mismatch detected!');
        process.exit(1);
    }
}

run().catch(err => {
    console.error('[compare-ast] Error:', err);
    process.exit(1);
});
