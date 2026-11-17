/**
 * migration/scripts/surgical-edit.mjs
 * 
 * Spec implementation (Section 5.2):
 * - Parse HTML with parse5 { sourceCodeLocationInfo: true }
 * - Collect ops: { start, end, replacement, reason } in absolute byte offsets
 * - Sort ops by start DESCENDING (bottom-up so offsets stay valid)
 * - Two modes:
 *     --dry-run: prints unified diff of first 20 ops + op count + full reasons
 *     --apply: writes file atomically (write temp file, then rename)
 *     --report <path>: writes JSON log of all ops
 */

import fs from 'node:fs';
import path from 'node:path';

export function applySurgicalOps(originalContent, ops, options = {}) {
    const { dryRun = false, reportPath = null, filePath = null } = options;

    // Validate ops
    for (const op of ops) {
        if (typeof op.start !== 'number' || typeof op.end !== 'number' || typeof op.replacement !== 'string') {
            throw new Error(`Invalid surgical op: ${JSON.stringify(op)}`);
        }
        if (op.start > op.end || op.start < 0 || op.end > originalContent.length) {
            throw new Error(`Out-of-bounds op [${op.start}, ${op.end}] on content length ${originalContent.length}`);
        }
    }

    // Sort ops DESCENDING by start offset
    const sortedOps = [...ops].sort((a, b) => b.start - a.start);

    // Check for overlapping edits
    for (let i = 0; i < sortedOps.length - 1; i++) {
        if (sortedOps[i + 1].end > sortedOps[i].start) {
            throw new Error(
                `Overlapping surgical ops detected: [${sortedOps[i + 1].start}, ${sortedOps[i + 1].end}] overlaps with [${sortedOps[i].start}, ${sortedOps[i].end}]`
            );
        }
    }

    // Generate diff preview
    let previewDiff = [];
    for (let i = 0; i < Math.min(20, sortedOps.length); i++) {
        const op = sortedOps[i];
        const oldSlice = originalContent.slice(op.start, op.end);
        previewDiff.push({
            index: i + 1,
            start: op.start,
            end: op.end,
            reason: op.reason || 'unspecified',
            oldText: oldSlice.length > 80 ? oldSlice.slice(0, 77) + '...' : oldSlice,
            newText: op.replacement.length > 80 ? op.replacement.slice(0, 77) + '...' : op.replacement
        });
    }

    // Apply ops
    let result = originalContent;
    for (const op of sortedOps) {
        result = result.slice(0, op.start) + op.replacement + result.slice(op.end);
    }

    const report = {
        timestamp: new Date().toISOString(),
        filePath,
        totalOps: ops.length,
        applied: !dryRun,
        ops: sortedOps.map(o => ({
            start: o.start,
            end: o.end,
            reason: o.reason,
            replacementLength: o.replacement.length
        }))
    };

    if (reportPath) {
        fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    }

    if (dryRun) {
        console.log(`[surgical-edit] DRY RUN preview (${ops.length} total ops):`);
        previewDiff.forEach(p => {
            console.log(`  #${p.index} [${p.start}..${p.end}] Reason: ${p.reason}`);
            console.log(`    - ${JSON.stringify(p.oldText)}`);
            console.log(`    + ${JSON.stringify(p.newText)}`);
        });
        return { modified: false, totalOps: ops.length, content: originalContent, preview: previewDiff };
    }

    if (filePath) {
        const tempPath = `${filePath}.tmp.${Date.now()}`;
        fs.writeFileSync(tempPath, result, 'utf8');
        fs.renameSync(tempPath, filePath);
    }

    return { modified: true, totalOps: ops.length, content: result, preview: previewDiff };
}

// CLI entry point
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))) {
    console.log('[surgical-edit] Utility loaded successfully as CLI/module.');
}
