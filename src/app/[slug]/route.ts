import { NextRequest } from 'next/server';
import { getInviteBySlug } from '@/lib/storage';
import { renderTemplateHTML } from '@/lib/template-engine';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const invite = await getInviteBySlug(params.slug);

  if (!invite) {
    return new Response('Wedding Invitation Not Found', { status: 404 });
  }

  const html = renderTemplateHTML(invite);

  if (!html) {
    return new Response(`Template Not Found`, { status: 404 });
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
