import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

interface FlagCoord {
  x: number;   // % of artwork width
  y: number;   // % of artwork height (fluid)
  scale: number;
}

type TierMap = Record<string, Record<string, FlagCoord>>;

const FLAG_IDS = ['r1', 'r2', 'r3', 'r4', 'l1', 'l2', 'l3', 'l4'];
const DEFAULT_BOUNDARIES: (number | null)[] = [null, 1558, 1280, 960, 768];

interface Tier {
  id: string;
  index: number;
  max: number | null;
  min: number;
  isLast: boolean;
  label: string;
}

function buildTiers(boundaries: (number | null)[]): Tier[] {
  return boundaries.map((max, i) => {
    const min = i + 1 < boundaries.length ? (boundaries[i + 1] as number) : 0;
    const isLast = i === boundaries.length - 1;
    let label: string;
    if (max === null) label = `>= ${min}px`;
    else if (isLast) label = `< ${max}px`;
    else label = `${min}px - ${max - 1}px`;
    return { id: max === null ? 'inf' : String(max), index: i, max, min, isLast, label };
  });
}

function tierQuery(tier: Tier): string {
  if (tier.max === null) return `@media (min-width: ${tier.min}px)`;
  const maxPx = (tier.max - 0.02).toFixed(2);
  return tier.isLast
    ? `@media (max-width: ${maxPx}px)`
    : `@media (min-width: ${tier.min}px) and (max-width: ${maxPx}px)`;
}

function generateResponsiveCSS(data: TierMap, boundaries: (number | null)[], seeded?: string[]): string {
  const tiers = buildTiers(boundaries);
  const isSeeded = (tier: Tier) =>
    !seeded || seeded.length === 0 || seeded.indexOf(tier.id) !== -1;

  function buildVars(tier: Tier, indent: string): string {
    const tierData = data[tier.id] || {};
    let out = '';
    FLAG_IDS.forEach(id => {
      const coord = tierData[id] || { x: 50, y: 60, scale: 0.25 };
      out += `${indent}--flag-${id}-x: ${Number(coord.x).toFixed(1)}%;\n`;
      out += `${indent}--flag-${id}-y: ${Number(coord.y).toFixed(1)}%;\n`;
      out += `${indent}--flag-${id}-scale: ${Number(coord.scale).toFixed(2)};\n`;
    });
    return out;
  }

  let css = `/* === FLAG STUDIO OVERRIDES (auto-generated) === */
/* Every width band edited in Visual Flag Studio. Y is a % of the artwork
   (Temple) height, so flags stay glued to the image at any viewport width.
   Bands: ${tiers.map(t => t.label).join('  |  ')} */

`;

  for (let i = 0; i < tiers.length; i++) {
    const t = tiers[i];
    if (!isSeeded(t)) continue;
    css += `/* ${t.label} */
${tierQuery(t)} {
    :root {
${buildVars(t, '        ')}
    }
}

`;
  }

  css += '/* === END FLAG STUDIO OVERRIDES === */\n';

  return css;
}

function normaliseBoundaries(input: unknown): (number | null)[] {
  if (!Array.isArray(input) || input.length < 2) return DEFAULT_BOUNDARIES.slice();

  const cleaned: (number | null)[] = [null];
  input
    .slice(1)
    .map(v => Math.round(Number(v)))
    .filter(v => Number.isFinite(v) && v > 0 && v < 20000)
    .forEach(v => {
      if (cleaned.indexOf(v) === -1) cleaned.push(v);
    });

  cleaned.sort((a, b) => {
    if (a === null) return -1;
    if (b === null) return 1;
    return b - a;
  });

  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data: TierMap = body.data || body;
    const boundaries = normaliseBoundaries(body.boundaries);
    const seeded: string[] | undefined = Array.isArray(body.seeded) ? body.seeded : undefined;

    const cssPath = path.join(
      process.cwd(),
      'templates',
      '08_unforgettable_buddhist_wedding',
      'css',
      'flags.css'
    );
    const backupCssPath = 'E:/Unforgettable Invites/Template Backup/08_unforgettable_buddhist_wedding/css/flags.css';

    if (!fs.existsSync(cssPath)) {
      return NextResponse.json({ success: false, error: 'flags.css not found' }, { status: 404 });
    }

    let cssContent = fs.readFileSync(cssPath, 'utf8');

    const newResponsiveCSS = generateResponsiveCSS(data, boundaries, seeded);

    // The authored responsive block stays untouched (it is the baseline for
    // bands that were never opened). Studio bands live in their own block at
    // the end of the file so they win by source order.
    const overrideRegex = /\/\* === FLAG STUDIO OVERRIDES \(auto-generated\) === \*\/[\s\S]*?\/\* === END FLAG STUDIO OVERRIDES === \*\/\n?/;

    if (overrideRegex.test(cssContent)) {
      cssContent = cssContent.replace(overrideRegex, newResponsiveCSS);
    } else {
      cssContent = cssContent.trimEnd() + '\n\n' + newResponsiveCSS;
    }

    fs.writeFileSync(cssPath, cssContent, 'utf8');

    // Sync to backup if directory exists
    try {
      if (fs.existsSync(path.dirname(backupCssPath))) {
        fs.writeFileSync(backupCssPath, cssContent, 'utf8');
      }
    } catch (e) {
      console.warn('Backup sync note:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully updated responsive flags.css',
      bands: buildTiers(boundaries).map(t => t.label),
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error saving flags:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
