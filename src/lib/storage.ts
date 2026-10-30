import fs from 'fs';
import path from 'path';
import { WeddingInviteData, WeddingEvent } from '@/data/types';
import { INITIAL_INVITES } from '@/data/invites';
import { cleanSlug } from './slug-engine';

const CONFIG_PATH = path.join(process.cwd(), 'invites.config.json');

export function normalizeEvent(e: any, index: number): WeddingEvent {
  return {
    id: e.id || `ev-${index}-${Date.now()}`,
    title: e.title || e.name || 'Holy Vivah Ceremony',
    date: e.date || '29th Aug 2026',
    day: e.day || 'Friday',
    time: e.time || '6:00 PM Onwards',
    venueName: e.venueName || e.venue || 'The Grand Palace',
    venueAddress: e.venueAddress || e.address || 'Pune, Maharashtra',
    mapDeepLink: e.mapDeepLink || e.mapsUrl || 'https://maps.google.com',
    dressCode: e.dressCode || 'Royal Festive',
  };
}

export function normalizeInvite(v: any): WeddingInviteData {
  const groomName = typeof v.couple?.groom === 'string' ? v.couple.groom : (v.couple?.groom?.name || 'Aarav Sharma');
  const brideName = typeof v.couple?.bride === 'string' ? v.couple.bride : (v.couple?.bride?.name || 'Saisha Patel');
  const slug = cleanSlug(v.slug || 'invite');

  const rawEvents = Array.isArray(v.events) ? v.events : [];
  const events = rawEvents.length > 0 ? rawEvents.map((e: any, i: number) => normalizeEvent(e, i)) : [
    {
      id: 'ev-1',
      title: 'Holy Wedding Ceremony',
      date: v.weddingDateDisplay || '29th Aug 2026',
      day: 'Friday',
      time: '6:00 PM Onwards',
      venueName: 'The Grand Palace',
      venueAddress: v.venueCity || 'Pune, Maharashtra',
      mapDeepLink: 'https://maps.google.com',
      dressCode: 'Royal Traditional Wedding Attire',
    }
  ];

  return {
    id: v.id || `invite-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    slug,
    templateId: v.templateId || v.template || '08_unforgettable_buddhist_wedding',
    lifecycleStatus: v.lifecycleStatus || 'UPCOMING',
    weddingDateISO: v.weddingDateISO || v.weddingDate || new Date().toISOString(),
    couple: {
      groom: {
        name: groomName,
        father: v.couple?.groom?.father || '',
        mother: v.couple?.groom?.mother || '',
        parents: typeof v.family?.groomParents === 'string' ? v.family.groomParents : (v.couple?.groom?.parents || 'Mr. & Mrs. Sharma'),
      },
      bride: {
        name: brideName,
        father: v.couple?.bride?.father || '',
        mother: v.couple?.bride?.mother || '',
        parents: typeof v.family?.brideParents === 'string' ? v.family.brideParents : (v.couple?.bride?.parents || 'Mr. & Mrs. Patel'),
      },
      connector: v.couple?.connector || 'weds',
      monogram: v.couple?.monogram || `${groomName[0] || 'A'} & ${brideName[0] || 'S'}`,
      hashtag: v.couple?.hashtag || `#${groomName.split(' ')[0]}Weds${brideName.split(' ')[0]}`,
      greetingNote: v.couple?.greetingNote || 'Together with their families, cordially invite you to celebrate',
    },
    shloka: v.shloka || {
      deity: 'Vedic Blessings',
      verseSanskrit: 'मांगल्यं तन्तुनानेन मम जीवनहेतुना',
      verseEnglish: 'Mangalyam tantunanena mama jivanahetuna',
      translation: 'May this sacred union be blessed with eternal love, harmony, and joy.',
    },
    events,
    audio: v.audio || {
      title: 'Sacred Flute',
      fileSrc: '/templates/08_unforgettable_buddhist_wedding/audio/mjZh3ISr0YDK01kdBZisCq18TDo.mp3',
      autoUnlockOnFirstTouch: true,
    },
    logistics: {
      dressCode: v.logistics?.dressCode || 'Royal Pastels / Traditional Formal',
      valetParking: v.logistics?.valetParking || 'Complimentary valet parking available at Main Gate',
      weather: v.logistics?.weather || 'Pleasant evening (22°C - 26°C)',
      contactName: v.logistics?.contactName || 'Hospitality Desk',
      contactNumber: v.logistics?.contactNumber || '+91 98200 12345',
      accommodation: v.logistics?.accommodation || 'Accommodations reserved at venue',
    },
    toggles: {
      enableMusic: v.toggles?.enableMusic ?? true,
      enableDressCode: v.toggles?.enableDressCode ?? true,
      enableValet: v.toggles?.enableValet ?? true,
      enableWeather: v.toggles?.enableWeather ?? true,
      enableShloka: v.toggles?.enableShloka ?? true,
      enableMaps: v.toggles?.enableMaps ?? true,
    },
    stats: v.stats || {
      views: 0,
      viewsToday: 0,
      activeDays: 1,
      boosted: false,
    },
    thumbnailUrl: v.thumbnailUrl || '/templates/08_unforgettable_buddhist_wedding/images/Left Flag.webp',
  };
}

export function getAllInvites(): WeddingInviteData[] {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeInvite);
      } else if (typeof data === 'object' && data !== null) {
        const values: any[] = Object.values(data);
        if (values.length > 0) {
          return values.map(normalizeInvite);
        }
      }
    } catch (e) {
      console.error('Error reading invites.config.json:', e);
    }
  }
  return [...INITIAL_INVITES];
}

export function getInviteBySlug(slug: string): WeddingInviteData | null {
  const clean = cleanSlug(slug);
  const list = getAllInvites();
  return list.find((i) => i.slug.toLowerCase() === clean) || null;
}

export function saveInvite(rawInvite: Partial<WeddingInviteData>): { success: boolean; invite?: WeddingInviteData; error?: string } {
  try {
    const invites = getAllInvites();
    const cleanSlugVal = cleanSlug(rawInvite.slug || '');

    if (!cleanSlugVal || cleanSlugVal.length < 2) {
      return { success: false, error: 'Slug must be at least 2 alphanumeric characters.' };
    }

    const targetId = rawInvite.id;

    // Check for collision with another record
    const conflict = invites.find(
      (inv) => inv.slug.toLowerCase() === cleanSlugVal && inv.id !== targetId
    );
    if (conflict) {
      return { success: false, error: `The slug "/${cleanSlugVal}" is already registered to another invitation.` };
    }

    const normalized = normalizeInvite({
      ...rawInvite,
      slug: cleanSlugVal,
      id: targetId || `invite-${Date.now()}`,
    });

    let existingIndex = -1;
    if (targetId) {
      existingIndex = invites.findIndex((inv) => inv.id === targetId);
    }

    if (existingIndex >= 0) {
      invites[existingIndex] = {
        ...invites[existingIndex],
        ...normalized,
        couple: {
          ...invites[existingIndex].couple,
          ...normalized.couple,
        },
        events: normalized.events,
      };
    } else {
      invites.unshift(normalized);
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(invites, null, 2), 'utf8');
    return { success: true, invite: normalized };
  } catch (err: any) {
    console.error('Error in saveInvite:', err);
    return { success: false, error: err.message || 'Storage error' };
  }
}

export function deleteInvite(identifier: string): { success: boolean; remaining?: number; error?: string } {
  try {
    let invites = getAllInvites();
    const initialLen = invites.length;
    const clean = cleanSlug(identifier);

    invites = invites.filter((inv) => inv.id !== identifier && inv.slug.toLowerCase() !== clean);

    if (invites.length === initialLen) {
      return { success: false, error: 'Invite not found.' };
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(invites, null, 2), 'utf8');
    return { success: true, remaining: invites.length };
  } catch (err: any) {
    console.error('Error in deleteInvite:', err);
    return { success: false, error: err.message || 'Storage error' };
  }
}
