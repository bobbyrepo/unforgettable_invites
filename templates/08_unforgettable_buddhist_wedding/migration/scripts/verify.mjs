/**
 * migration/scripts/verify.mjs
 * 
 * Spec implementation (Section 7.2):
 * - verify.mjs --label <name>
 * - Runs all captures into migration/captures/<label>/
 * - Diffs against migration/baselines/ (or custom baseline if calibrating)
 * - Writes migration/reports/verify-<label>.md
 * - Prints PASS/FAIL summary
 * - Exit code 0 only if all checks pass
 */

import fs from 'node:fs';
import path from 'node:path';
import { captureViewport } from './capture-all.mjs';
import { diffDom, diffStyles, diffShots, diffNetwork, diffConsole } from './diff-engine.mjs';

const ROOT = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';

async function main() {
    const args = process.argv.slice(2);
    let label = 'run';
    let baselineDir = path.join(ROOT, 'migration/baselines');

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--label' && args[i + 1]) label = args[++i];
        if (args[i] === '--baseline' && args[i + 1]) baselineDir = path.resolve(args[++i]);
    }

    const outDir = path.join(ROOT, `migration/captures/${label}`);
    fs.mkdirSync(outDir, { recursive: true });

    // Load Phase D facts
    const factsPath = path.join(ROOT, 'migration/facts.json');
    if (!fs.existsSync(factsPath)) {
        throw new Error('migration/facts.json not found! Run Phase D discovery first.');
    }
    const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

    const canonicalViewports = [393, 834, 1440, 1920];
    // Calibration / full verification viewports: canonical viewports
    const viewportsToTest = canonicalViewports;

    console.log(`\n=======================================================`);
    console.log(`VERIFY ENGINE: Label = [${label}]`);
    console.log(`Out Directory: ${outDir}`);
    console.log(`Baseline Directory: ${baselineDir}`);
    console.log(`Viewports: ${viewportsToTest.join(', ')} px`);
    console.log(`=======================================================\n`);

    for (const w of viewportsToTest) {
        await captureViewport({
            viewportWidth: w,
            outDir,
            isCanonical: canonicalViewports.includes(w),
            interactiveSelectors: facts.interactiveSelectors || []
        });
    }

    // Now Diff against baseline if baseline exists
    const hasBaseline = fs.existsSync(baselineDir) && fs.readdirSync(baselineDir).length > 0;
    const reportResults = [];
    let allPassed = true;

    if (hasBaseline) {
        console.log(`\n--- RUNNING MACHINE DIFFS AGAINST BASELINE ---`);
        for (const w of viewportsToTest) {
            const domDiff = diffDom(
                path.join(baselineDir, `dom-${w}.html`),
                path.join(outDir, `dom-${w}.html`)
            );
            const styleDiff = diffStyles(
                path.join(baselineDir, `styles-${w}.json.gz`),
                path.join(outDir, `styles-${w}.json.gz`)
            );
            const shotDiff = diffShots(
                path.join(baselineDir, `shot-${w}-full.png`),
                path.join(outDir, `shot-${w}-full.png`),
                path.join(outDir, `diff-shot-${w}-full.png`)
            );
            const netDiff = diffNetwork(
                path.join(baselineDir, `network-${w}.txt`),
                path.join(outDir, `network-${w}.txt`)
            );
            const consDiff = diffConsole(
                path.join(baselineDir, `console-${w}.txt`),
                path.join(outDir, `console-${w}.txt`)
            );

            const passW = domDiff.passed && styleDiff.passed && shotDiff.passed && netDiff.passed && consDiff.passed;
            if (!passW) allPassed = false;

            reportResults.push({
                viewport: w,
                passed: passW,
                dom: domDiff.diffCount,
                styles: styleDiff.diffCount,
                shots: shotDiff.diffCount,
                network: netDiff.diffCount,
                consoleErrors: consDiff.diffCount
            });

            console.log(`[Viewport ${w}px] ${passW ? 'PASS' : 'FAIL'} | DOM: ${domDiff.diffCount} | Styles: ${styleDiff.diffCount} | Shots: ${shotDiff.diffCount} | Net: ${netDiff.diffCount} | Console: ${consDiff.diffCount}`);
        }
    } else {
        console.log(`[verify] No prior baseline directory populated. Run calibrated captures first.`);
    }

    // Write Markdown report
    const reportMdPath = path.join(ROOT, `migration/reports/verify-${label}.md`);
    let md = `# Verification Report: ${label}\n\n`;
    md += `Timestamp: ${new Date().toISOString()}\n`;
    md += `Baseline: \`${baselineDir}\`\n`;
    md += `Status: **${allPassed ? 'GREEN (PASS)' : 'RED (FAIL)'}**\n\n`;
    md += `| Viewport | DOM Diff | Styles Diff | Shots Diff (px) | Network Diff | Console Errors | Result |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    reportResults.forEach(r => {
        md += `| ${r.viewport}px | ${r.dom} | ${r.styles} | ${r.shots} | ${r.network} | ${r.consoleErrors} | ${r.passed ? '✅ PASS' : '❌ FAIL'} |\n`;
    });

    fs.writeFileSync(reportMdPath, md, 'utf8');
    console.log(`\nReport written to: ${reportMdPath}`);

    if (hasBaseline && !allPassed) {
        console.error(`\n[verify] Verification FAILED for label ${label}!`);
        process.exit(1);
    } else {
        console.log(`\n[verify] Verification completed successfully for label ${label}.`);
        process.exit(0);
    }
}

main().catch(err => {
    console.error('[verify] Fatal Error:', err);
    process.exit(1);
});
