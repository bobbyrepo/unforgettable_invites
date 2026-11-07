import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
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

const ASSET_ALIASES: Record<string, string> = {
  'lKVzZvE9zjHal1zLmfO4koCjo.webp': 'Temple_Desktop.png',
  'Vmh2DwpF7PAgb69W6NahdCwGidA.webp': 'Temple_Mobile.png',
  'Trees.webp': 'Trees_Desktop.png',
  'XEME29GdiyV3RDHfslzLVTpFP1g.webp': 'Arch_Frame_Desktop.png',
  'Zrnq96rxcNCLdk4Yaz94Dup5Q.webp': 'Arch_Frame_Mobile.png',
  'IxbRblgZX2YiN0xuANY2jX4Excg.webp': 'Alcove_Backdrop_Desktop.png',
  'ctlwo5LpuBk9eskYOT9Z2MD8wso.webp': 'Alcove_Backdrop_Mobile.png',
  'VSWKtKY9anp40BO4QazdQK473tQ.webp': 'Pillar_Colonnade_Desktop.png',
  'vo85LJWiG7KY5sTcDsBhG1aEc.webp': 'Pillar_Colonnade_Mobile.png',
  'TUkRvFIUDwblbb4eewkBlJzZwJw.webp': 'Event_Frame_Pillar.png',
  'E3n3YL5RKanyoBxca5PLxMtx3rk.webp': 'Event_Badge_Medallion.png',
  'k4akBbaSTVmqriBl2MhXD6MXOyg.webp': 'Event_Numeral_Badge.webp',
  'Faqdd7FNeFyJ6ps5vdLeS54Co.webp': 'Timeline_Divider_Flourish.png',
  'q34vGrlWel2dWqX5zDNWJQDl9k.webp': 'Story_Backdrop_Desktop.png',
  'hUKMKAtrpqFCDTXl35Y5yuIjRw.webp': 'Story_Backdrop_Mobile.png',
  'bV5rTKtXbSKvnQpg3vwzhWFRfzs.webp': 'Message_Frame_Desktop.png',
  'nGPy0RPGbGwAd8w8op4XKveKWM.webp': 'Message_Frame_Mobile.png',
  'fXdVaVM1Iocp7HSsFNQd7A9zHrw.webp': 'Location_Canvas_Desktop.webp',
  'cuJqbfW35i2RRVw2Q3Vaix9WO8I.webp': 'Location_Canvas_Mobile.webp',
  'HRENeallVVOHG1sTSUCePuUH4.webp': 'Timeline_Canvas_Desktop.webp',
  'Ta8VvaJo4SZuTcgz4N8iLLSsLE.webp': 'Timeline_Canvas_Mobile.webp',
  'ECYGxlUfN1A1OmbaiTl8iogMeVk.webp': 'Countdown_Frame_Desktop.png',
  'LDGCqdzKnQ5ErPPOpHZbdl96s.webp': 'Countdown_Frame_Mobile.webp',
  'fh6rhHrxI1397e5fR1HuT0QU.webp': 'Countdown_Divider_Desktop.webp',
  'T7c0PLf2sfUhiq0SlGf4frlVQMA.webp': 'Countdown_Divider_Mobile.webp',
  'DIljN6CZ5Ok94fYAeNVQ4nSQOEo.webp': 'Countdown_Ornament_Desktop.webp',
  '7Jr9KCHDFL5pwPFZFeisN44Yzi4.webp': 'Countdown_Ornament_Mobile.webp',
  'qTQEkBOwp9swndaRzxYt0TOx8U.webp': 'Blessing_Emblem_Desktop.png',
  '5FVM3OmFePuLZFoKyYpESSXgaE.webp': 'Blessing_Emblem_Mobile.png',
  '4cA2HUMDhUokZACwYXNtj8gs8Os.webp': 'Invocation_Text_Desktop.webp',
  'kJ6ukGxpOPVxnwLybHzfIL3VtkM.webp': 'Invocation_Text_Mobile.webp',
  'DRFRG6BredDwQiJY7bR0l7zYMs.webp': 'Benediction_Line_Desktop.webp',
  'dRCMDT9ufGWEZehulDCNdJpwaLs.webp': 'Benediction_Line_Mobile.webp',
  'BYAsD8Youh2KSQp1YWLBPEg8U.webp': 'Sky_Desktop.webp',
  'ELVgHUKqtqAl9gf1nwbYhSeTg.webp': 'Sky_Mobile.webp',
  'WAxILXJh5vxiTnOtbAVwuxo0PsQ.webp': 'Mountain_Desktop.webp',
  'jv9Y5c65dupWuUvOrLUvDm6o.webp': 'Mountain_Mobile.webp',
  'w2VucNwOfPZvxA8ibgdnaWF7T4.webp': 'Cloud_Desktop.png',
  'qTlCAkdnbuZVEx4RAWSlgsGHX0.webp': 'Cloud_Mobile.png',
  'dh5fZvEiBieci19vHLxfPJc5QAI.webp': 'Sun_Desktop.webp',
  'CAJYZSTyHrLw4D8Gxv3UGjFaMg.webp': 'Sun_Mobile.webp',
  'pyLtbhSLIRf4NHAy72amY2aW58.webp': 'Peacock_Trim_Ornament.png',
  'ciPCtoLf1PEnCNBnsx6boOBPU.webp': 'Mandala_Rosette_Ornament.webp',
  'UmHP4DGOVhAoz2Wx4tcMvgZoBc.webp': 'Mandala_Corner_Accent.webp',
  'gt4WrIeOxcZz1kQLQ9ovWBkpc.webp': 'Pillar_Bracket_Right.png',
  'dU6QWYOyKfqMfHH3mCT84Z3dAJE.webp': 'Pillar_Bracket_Left.png',
  'lsI4FJ0BeiT9e8FhL5WYmPRlnyY.webp': 'Pillar_Bracket_Right.png',
  'BETBi0AtFY20asJ3PfAMAFe8g.webp': 'Bell_Floral_Chain.png',
  'XegR81dMLWk0YMirVBF6rsfAs3Y.webp': 'Bell_Long_Chain.png',
  'svYNfrgA0JSnowyYTfnNW2qkvHY.webp': 'Bell_Long_Chain.png',
  'EUPxZZrFKaWt9CBkczGVfDOj1c.webp': 'Icon_Hashtag.webp',
  'KrRp2Koc5I3NO7nOduBFAoCVlQ.webp': 'Icon_Weather.webp',
  'hjcRmZcFhVMnmuu2IHPnk7pOudQ.webp': 'Icon_Staff.webp',
  '5uWzJVw11PDVfozRAkpivVBUPw.webp': 'Icon_Parking.webp',
};

const TRANSPARENT_1X1_WEBP = Buffer.from(
  'UklGRhoAAABXRUJQVlA4TA4AAAAvAAAAAAcQEf0PRET/Aw==',
  'base64'
);

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const [templateId, ...subPath] = params.path;

  // Handle accidental root images resolution (e.g. from missing trailing slash)
  if (templateId === 'images' && subPath.length > 0) {
    const fallbackPath = path.join(process.cwd(), 'templates', '08_unforgettable_buddhist_wedding', 'images', ...subPath);
    if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile()) {
      const fileBuffer = fs.readFileSync(fallbackPath);
      const ext = path.extname(fallbackPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      });
    }
  }

  // 1. Template Demo Renderer (/templates/:templateId or /templates/:templateId/index.html)
  if (subPath.length === 0 || (subPath.length === 1 && subPath[0] === 'index.html')) {
    // Ensure trailing slash so relative paths (./images/...) resolve cleanly on mobile browsers
    if (subPath.length === 0 && !request.nextUrl.pathname.endsWith('/')) {
      return NextResponse.redirect(new URL(`${request.nextUrl.pathname}/`, request.url), 308);
    }

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
  let localDiskPath = path.join(process.cwd(), 'templates', ...params.path);

  // First check legacy alias map (e.g. hashed names to human-readable names)
  const reqFileName = path.basename(localDiskPath);
  if (ASSET_ALIASES[reqFileName]) {
    localDiskPath = path.join(path.dirname(localDiskPath), ASSET_ALIASES[reqFileName]);
  }

  // Intercept any deleted decorative assets so they never 404
  const reqBaseName = path.basename(localDiskPath);
  if (
    reqBaseName.includes('Mandala_Corner_Accent') ||
    reqBaseName.includes('Mandala_Rosette_Ornament') ||
    reqBaseName === 'UmHP4DGOVhAoz2Wx4tcMvgZoBc.webp' ||
    reqBaseName === 'ciPCtoLf1PEnCNBnsx6boOBPU.webp'
  ) {
    return new Response(TRANSPARENT_1X1_WEBP, {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // === STRICT UNCONDITIONAL WEBP PREFERENCE ===
  // When ANY asset is requested (even if requested as .png),
  // if a .webp with the same base name exists on disk, ALWAYS serve the lightweight .webp!
  const currentExt = path.extname(localDiskPath).toLowerCase();
  const basePathNoExt = currentExt ? localDiskPath.slice(0, -currentExt.length) : localDiskPath;
  const candidateWebp = basePathNoExt + '.webp';

  if (fs.existsSync(candidateWebp) && fs.statSync(candidateWebp).isFile()) {
    localDiskPath = candidateWebp;
  } else if (!fs.existsSync(localDiskPath) || !fs.statSync(localDiskPath).isFile()) {
    // Fallback: check alternative extensions (.webp -> .png -> .jpg -> .jpeg)
    const altExts = ['.webp', '.png', '.jpg', '.jpeg'];
    for (const alt of altExts) {
      const altPath = basePathNoExt + alt;
      if (fs.existsSync(altPath) && fs.statSync(altPath).isFile()) {
        localDiskPath = altPath;
        break;
      }
    }
  }

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
        'Cache-Control': 'public, max-age=0, must-revalidate',
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
