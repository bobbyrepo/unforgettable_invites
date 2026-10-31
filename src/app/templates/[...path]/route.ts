import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { MASTER_TEMPLATES } from '@/config/templates';
import { renderTemplateHTML } from '@/lib/template-engine';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const [templateId, ...subPath] = params.path;

  // 1. Template Demo Renderer (/templates/:templateId or /templates/:templateId/index.html)
  if (subPath.length === 0 || (subPath.length === 1 && subPath[0] === 'index.html')) {
    const template = MASTER_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      return new Response(`Template "${templateId}" not found in master catalog.`, { status: 404 });
    }

    const demoInvite = {
      id: `demo-${template.id}`,
      slug: `demo-${template.id}`,
      templateId: template.id,
      couple: {
        groom: { name: template.defaultCouple.groom },
        bride: { name: template.defaultCouple.bride },
      },
      events: [
        {
          venueAddress: template.defaultCouple.city || 'Pune, Maharashtra',
        },
      ],
      status: 'ACTIVE' as const,
    };

    const html = renderTemplateHTML(demoInvite as any);
    if (!html) {
      return new Response(`Template file for "${templateId}" not found.`, { status: 404 });
    }

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // 2. Direct Static Asset Serving:
  // First check if asset exists on local disk (instant response, zero latency, zero CORS restrictions)
  const localDiskPath = path.join(process.cwd(), 'templates', ...params.path);
  if (fs.existsSync(localDiskPath) && fs.statSync(localDiskPath).isFile()) {
    const fileBuffer = fs.readFileSync(localDiskPath);
    const ext = path.extname(localDiskPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // 3. Fallback: Proxy directly from Cloudflare R2 with explicit CORS headers
  const r2Base = process.env.NEXT_PUBLIC_R2_URL || 'https://pub-9df949e18be24d52a5ae719c1edfe88c.r2.dev';
  const assetUrl = `${r2Base.replace(/\/$/, '')}/templates/${params.path.join('/')}`;

  try {
    const r2Res = await fetch(assetUrl);
    if (!r2Res.ok) {
      return new Response(`Asset not found: ${params.path.join('/')}`, { status: r2Res.status });
    }

    const blob = await r2Res.arrayBuffer();
    const ext = path.extname(params.path[params.path.length - 1]).toLowerCase();
    const contentType = r2Res.headers.get('content-type') || MIME_TYPES[ext] || 'application/octet-stream';

    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    return new Response(`Failed to fetch asset from R2: ${err.message}`, { status: 502 });
  }
}
