import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const ROOT = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const layoutCssPath = path.join(ROOT, 'css/layout.css');

async function prettyPrint() {
    console.log('[pretty-print] Formatting layout.css with 2 spaces indentation...');
    let css = fs.readFileSync(layoutCssPath, 'utf8');

    // Protect any raw vendor tokens
    css = css.replace(/\{bing\}/g, '{/*bing*/}');

    const root = postcss.parse(css);

    // Format AST with 2 spaces
    function formatNode(node, indent = '') {
        const childIndent = indent + '  ';
        if (node.type === 'rule') {
            node.raws.before = '\n' + indent;
            node.raws.after = '\n' + indent;
            node.walkDecls(d => {
                d.raws.before = '\n' + childIndent;
                d.raws.between = ': ';
            });
        } else if (node.type === 'atrule') {
            node.raws.before = '\n\n' + indent;
            node.raws.after = '\n' + indent;
            if (node.nodes) {
                node.nodes.forEach(child => formatNode(child, childIndent));
            }
        }
    }

    root.nodes.forEach(n => formatNode(n, ''));

    let formatted = root.toString();
    formatted = formatted.replace(/\{\/\*bing\*\/\}/g, '{bing}');

    fs.writeFileSync(layoutCssPath, formatted, 'utf8');
    console.log('[pretty-print] layout.css formatted successfully! Lines:', formatted.split('\n').length);
}

prettyPrint().catch(err => {
    console.error('[pretty-print] Error:', err);
    process.exit(1);
});
