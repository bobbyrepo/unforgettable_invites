import { NextRequest } from 'next/server';
import { MASTER_TEMPLATES } from '@/config/templates';
import { renderTemplateHTML } from '@/lib/template-engine';

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

  // 2. Direct Static Asset Fallback -> Redirect directly to Cloudflare R2 CDN
  const r2Base = process.env.NEXT_PUBLIC_R2_URL || 'https://pub-9df949e18be24d52a5ae719c1edfe88c.r2.dev';
  const assetUrl = `${r2Base.replace(/\/$/, '')}/templates/${params.path.join('/')}`;
  return Response.redirect(assetUrl, 307);
}
