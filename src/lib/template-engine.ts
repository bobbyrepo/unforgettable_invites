import fs from 'fs';
import path from 'path';
import { WeddingInviteData } from '@/data/types';
import { MASTER_TEMPLATES } from '@/config/templates';
import { TEMPLATE_SCHEMAS } from '@/config/template-schemas';

export function renderTemplateHTML(invite: WeddingInviteData): string | null {
  const templateId = invite.templateId || '07_unforgettable_ram_mandir';
  const schema = TEMPLATE_SCHEMAS[templateId] || TEMPLATE_SCHEMAS['07_unforgettable_ram_mandir'];

  const groom = invite.couple?.groom?.name || schema.defaultCouple.groom;
  const bride = invite.couple?.bride?.name || schema.defaultCouple.bride;
  const groomParents = invite.couple?.groom?.parents || schema.defaultCouple.groomParents;
  const brideParents = invite.couple?.bride?.parents || schema.defaultCouple.brideParents;
  
  const primaryEvent = invite.events?.[0];
  const primaryCity = primaryEvent?.venueAddress || schema.defaultCouple.city;
  const primaryVenue = primaryEvent?.venueName || primaryEvent?.title || 'The Grand Palace';
  const primaryDate = primaryEvent?.date || '20th Nov 2026';

  const hashtag = invite.couple?.hashtag || schema.defaultCouple.hashtag;
  const weather = invite.logistics?.weather || schema.defaultLogistics.weather;
  const valet = invite.logistics?.valetParking || schema.defaultLogistics.valetParking;
  const heroImg = invite.thumbnailUrl || schema.imageSlots[0]?.defaultUrl;

  const templatePath = path.join(process.cwd(), 'templates', templateId, 'index.html');
  const remoteTemplatePath = path.join(process.cwd(), 'templates', templateId, 'index_remote.html');
  if (!fs.existsSync(templatePath)) {
    return null;
  }

  // Seamless auto-sync for desktop shift variables: whichever file was edited most recently wins and syncs to both!
  if (fs.existsSync(remoteTemplatePath)) {
    try {
      const localStat = fs.statSync(templatePath);
      const remoteStat = fs.statSync(remoteTemplatePath);
      let localContent = fs.readFileSync(templatePath, 'utf8');
      let remoteContent = fs.readFileSync(remoteTemplatePath, 'utf8');

      const vars = ['--desktop-story-shift', '--desktop-timeline-canvas-shift'];
      let localChanged = false;
      let remoteChanged = false;

      for (const v of vars) {
        const vRegex = new RegExp(`${v}:\\s*([^;]+);`);
        const localMatch = localContent.match(vRegex);
        const remoteMatch = remoteContent.match(vRegex);
        if (localMatch && remoteMatch && localMatch[1].trim() !== remoteMatch[1].trim()) {
          if (remoteStat.mtimeMs > localStat.mtimeMs) {
            const updatedVal = remoteMatch[1].trim();
            localContent = localContent.replace(vRegex, `${v}: ${updatedVal};`);
            localChanged = true;
          } else {
            const updatedVal = localMatch[1].trim();
            remoteContent = remoteContent.replace(vRegex, `${v}: ${updatedVal};`);
            remoteChanged = true;
          }
        }
      }

      if (localChanged) {
        fs.writeFileSync(templatePath, localContent, 'utf8');
      }
      if (remoteChanged) {
        fs.writeFileSync(remoteTemplatePath, remoteContent, 'utf8');
      }
    } catch (e) {
      // Ignore sync error
    }
  }

  let html = fs.readFileSync(templatePath, 'utf8');

  // 1. Inject base tag for asset resolution & OpenGraph meta tags
  const r2Base = process.env.NEXT_PUBLIC_R2_URL || 'https://pub-9df949e18be24d52a5ae719c1edfe88c.r2.dev';
  const assetBase = `/templates/${templateId}/`;
  const absoluteAssetBase = `${r2Base.replace(/\/$/, '')}/templates/${templateId}/`;

  const ogTags = `
\t<meta property="og:title" content="${groom} &amp; ${bride} | Wedding Invitation" />
\t<meta property="og:description" content="Together with their families, cordially invite you to celebrate on ${primaryDate} in ${primaryCity}. Tap to view invitation." />
\t<meta property="og:image" content="${heroImg.startsWith('http') ? heroImg : absoluteAssetBase + heroImg.replace(/^\//, '')}" />
\t<meta property="og:type" content="website" />
\t<meta name="twitter:card" content="summary_large_image" />`;

  const headInject = `<head>\n\t<base href="${assetBase}">${ogTags}\n\t<script>(function(){const h=(m)=>typeof m==='string'&&(m.includes('recoverable error')||m.includes('Minified React error #418')||m.includes('Minified React error #422')||m.includes('Minified React error #425')||m.includes('Framer On-Page Editing'));const e=console.error,w=console.warn;console.error=function(...a){if(a.some(h))return;e.apply(console,a);};console.warn=function(...a){if(a.some(h))return;w.apply(console,a);};})();</script>`;
  html = html.replace('<head>', headInject);

  // 2. Dynamic couple name & family replacements across master themes
  if (templateId === '07_unforgettable_ram_mandir') {
    html = html.replaceAll('Akash', groom);
    html = html.replaceAll('AKASH', groom.toUpperCase());
    html = html.replaceAll('Drashti', bride);
    html = html.replaceAll('DRASHTI', bride.toUpperCase());
    
    // Parents
    if (groomParents) {
      html = html.replaceAll('Smt. &amp; Shri Vikram Mehra', groomParents);
      html = html.replaceAll('Smt. & Shri Vikram Mehra', groomParents);
    }
    if (brideParents) {
      html = html.replaceAll('Smt. &amp; Shri Alok Verma', brideParents);
      html = html.replaceAll('Smt. & Shri Alok Verma', brideParents);
    }

    // Hashtag & Logistics
    if (hashtag) html = html.replaceAll('#AkashKiDrashti', hashtag);
    if (weather) html = html.replaceAll('Crisp November Evening (18°C - 22°C)', weather);
    if (valet) html = html.replaceAll('Complimentary valet parking available at Royal Porch Entrance Gate', valet);

    if (primaryCity && primaryCity !== 'Jaipur, Rajasthan') {
      html = html.replaceAll('Jaipur, Rajasthan', primaryCity);
      html = html.replaceAll('Pune, Maharashtra', primaryCity);
    }
  } else if (templateId === '08_unforgettable_buddhist_wedding') {
    html = html.replaceAll('Siddharth', groom);
    html = html.replaceAll('SIDDHARTH', groom.toUpperCase());
    html = html.replaceAll('Maya', bride);
    html = html.replaceAll('MAYA', bride.toUpperCase());

    if (primaryCity && primaryCity !== 'Bodh Gaya, Bihar') {
      html = html.replaceAll('Bodh Gaya, Bihar', primaryCity);
    }
    // Groom Parents
    if (groomParents) {
      html = html.replaceAll('Shri. Hemant Vardhan &amp; Smt. Sunita Vardhan', groomParents);
      html = html.replaceAll('Shri. Hemant Vardhan & Smt. Sunita Vardhan', groomParents);
      html = html.replaceAll('Shri Hemant Vardhan & Smt. Sunita Vardhan', groomParents);
    }
    // Bride Parents
    if (brideParents) {
      html = html.replaceAll('Shri. Arvind Sharma &amp; Smt. Meena Sharma', brideParents);
      html = html.replaceAll('Shri. Arvind Sharma & Smt. Meena Sharma', brideParents);
      html = html.replaceAll('Shri Arvind Sharma & Smt. Meena Sharma', brideParents);
    }
    // Custom Invitation Line / Greeting Note
    if (invite.couple?.greetingNote) {
      html = html.replaceAll('Cordially request the honor of your presence at the wedding celebration of our beloved son', invite.couple.greetingNote);
      html = html.replaceAll('Cordially request the honor of your presence at the wedding', invite.couple.greetingNote);
    }
    if (hashtag) html = html.replaceAll('#MayaFoundHerSiddharth', hashtag);
  } else if (templateId === '01_unforgettable_temple_grace') {
    html = html.replaceAll('Rahul', groom);
    html = html.replaceAll('RAHUL', groom.toUpperCase());
    html = html.replaceAll('Kiran', bride);
    html = html.replaceAll('KIRAN', bride.toUpperCase());
  } else if (templateId === '02_unforgettable_radha_krishna') {
    html = html.replaceAll('Krishna', groom);
    html = html.replaceAll('KRISHNA', groom.toUpperCase());
    html = html.replaceAll('Radha', bride);
    html = html.replaceAll('RADHA', bride.toUpperCase());
  } else if (templateId === '03_unforgettable_pastel_elegance') {
    html = html.replaceAll('Shiv', groom);
    html = html.replaceAll('SHIV', groom.toUpperCase());
    html = html.replaceAll('Parwati', bride);
    html = html.replaceAll('PARWATI', bride.toUpperCase());
  } else if (templateId === '04_unforgettable_ayodhya_heritage' || templateId === '06_unforgettable_udaipur_palace') {
    html = html.replaceAll('Abhishek', groom);
    html = html.replaceAll('ABHISHEK', groom.toUpperCase());
    html = html.replaceAll('Kanika', bride);
    html = html.replaceAll('KANIKA', bride.toUpperCase());
  } else if (templateId === '05_unforgettable_meenakshi_royal') {
    html = html.replaceAll('Vishu', groom);
    html = html.replaceAll('VISHU', groom.toUpperCase());
    html = html.replaceAll('Kavya', bride);
    html = html.replaceAll('KAVYA', bride.toUpperCase());
  } else {
    html = html.replaceAll('Akash', groom);
    html = html.replaceAll('Drashti', bride);
    html = html.replaceAll('Siddharth', groom);
    html = html.replaceAll('Maya', bride);
  }

  // 3. Document Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${groom} & ${bride} | Wedding Invitation</title>`);

  // 4. RSVP Form Visibility Guard (Disabled by default)
  const isRsvpEnabled = invite.toggles?.enableRSVP ?? false;
  if (!isRsvpEnabled) {
    html = html.replace(/<\/head>/i, '<style>[id*="rsvp"], [class*="rsvp-section"], [data-section="rsvp"] { display: none !important; }</style></head>');
  }

  // 5. Hide legacy switcher
  html = html.replace(/id="unified-template-switcher"[\s\S]*?style="[^"]*"/i, 'id="unified-template-switcher" style="display:none !important;"');

  return html;
}
