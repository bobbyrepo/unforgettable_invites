import fs from 'fs';
import path from 'path';
import { WeddingInviteData } from '@/data/types';
import { MASTER_TEMPLATES } from '@/config/templates';

export function renderTemplateHTML(invite: WeddingInviteData): string | null {
  const templateId = invite.templateId || '08_unforgettable_buddhist_wedding';
  const templateConfig = MASTER_TEMPLATES.find((t) => t.id === templateId);

  const groom = invite.couple?.groom?.name || 'Aarav';
  const bride = invite.couple?.bride?.name || 'Saisha';
  const groomParents = invite.couple?.groom?.parents || '';
  const primaryCity = invite.events[0]?.venueAddress || 'Pune, Maharashtra';

  const templatePath = path.join(process.cwd(), 'templates', templateId, 'index.html');
  if (!fs.existsSync(templatePath)) {
    return null;
  }

  let html = fs.readFileSync(templatePath, 'utf8');

  // 1. Inject base tag for asset resolution
  html = html.replace('<head>', `<head>\n\t<base href="/templates/${templateId}/">`);

  // 2. Dynamic couple name replacements
  if (templateId === '08_unforgettable_buddhist_wedding') {
    html = html.replaceAll('Siddharth', groom);
    html = html.replaceAll('Maya', bride);
    if (primaryCity && primaryCity !== 'Bodh Gaya, Bihar') {
      html = html.replaceAll('Bodh Gaya, Bihar', primaryCity);
    }
    if (groomParents) {
      html = html.replaceAll('Shri. Hemant Vardhan &amp; Smt. Sunita Vardhan', groomParents);
      html = html.replaceAll('Shri. Hemant Vardhan & Smt. Sunita Vardhan', groomParents);
    }
  } else if (templateId === '07_unforgettable_ram_mandir') {
    html = html.replaceAll('Akash', groom);
    html = html.replaceAll('Drashti', bride);
    if (primaryCity && primaryCity !== 'Pune, Maharashtra') {
      html = html.replaceAll('Pune, Maharashtra', primaryCity);
    }
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
    html = html.replaceAll('Siddharth', groom);
    html = html.replaceAll('Maya', bride);
    html = html.replaceAll('Akash', groom);
    html = html.replaceAll('Drashti', bride);
  }

  // 3. Document Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${groom} & ${bride} | Wedding Invitation</title>`);

  // 4. Hide legacy switcher
  html = html.replace(/id="unified-template-switcher"[\s\S]*?style="[^"]*"/i, 'id="unified-template-switcher" style="display:none !important;"');

  return html;
}
