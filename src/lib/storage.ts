import fs from 'fs';
import path from 'path';
import os from 'os';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { WeddingInviteData, WeddingEvent } from '@/data/types';
import { INITIAL_INVITES } from '@/data/invites';
import { cleanSlug } from './slug-engine';

const CONFIG_PATH = path.join(process.cwd(), 'invites.config.json');
const TMP_CONFIG_PATH = path.join(os.tmpdir(), 'invites.config.json');

// S3 / Cloudflare R2 Client for persistent cloud storage
const hasR2 = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
const s3 = hasR2
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'unforgettable-invites-assets';
const R2_CONFIG_KEY = 'data/invites.config.json';

// In-memory cache for ultra-fast serverless execution (5-second TTL)
let inMemoryCache: WeddingInviteData[] | null = null;
let lastCacheFetchTime = 0;
const CACHE_TTL_MS = 5000;

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

/**
 * Fetch all invites with multi-tier storage fallback:
 * 1. In-memory cache (within TTL)
 * 2. Cloudflare R2 bucket (cloud-wide persistence)
 * 3. /tmp/invites.config.json (serverless temporary file)
 * 4. ./invites.config.json (local file)
 * 5. INITIAL_INVITES (hardcoded fallback)
 */
export async function getAllInvites(): Promise<WeddingInviteData[]> {
  const now = Date.now();
  if (inMemoryCache && now - lastCacheFetchTime < CACHE_TTL_MS) {
    return inMemoryCache;
  }

  // Tier 1: Try reading from Cloudflare R2
  if (s3) {
    try {
      const res = await s3.send(
        new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: R2_CONFIG_KEY,
        })
      );
      const str = await res.Body?.transformToString();
      if (str) {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const list = parsed.map(normalizeInvite);
          inMemoryCache = list;
          lastCacheFetchTime = now;
          return list;
        }
      }
    } catch (e: any) {
      // If object doesn't exist yet or network error, fall through to local
    }
  }

  // Tier 2: Try reading from /tmp/invites.config.json
  if (fs.existsSync(TMP_CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(TMP_CONFIG_PATH, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        const list = data.map(normalizeInvite);
        inMemoryCache = list;
        lastCacheFetchTime = now;
        return list;
      }
    } catch (e) {}
  }

  // Tier 3: Try reading from local project root invites.config.json
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        const list = data.map(normalizeInvite);
        inMemoryCache = list;
        lastCacheFetchTime = now;
        return list;
      }
    } catch (e) {
      console.error('Error reading invites.config.json:', e);
    }
  }

  inMemoryCache = [...INITIAL_INVITES];
  lastCacheFetchTime = now;
  return inMemoryCache;
}

export async function getInviteBySlug(slug: string): Promise<WeddingInviteData | null> {
  const clean = cleanSlug(slug);
  const list = await getAllInvites();
  return list.find((i) => i.slug.toLowerCase() === clean) || null;
}

/**
 * Persist invites across Cloudflare R2, /tmp, and local disk
 */
async function persistInvites(invites: WeddingInviteData[]) {
  const jsonStr = JSON.stringify(invites, null, 2);
  inMemoryCache = invites;
  lastCacheFetchTime = Date.now();

  // 1. Cloudflare R2 (Global persistence across all Vercel serverless containers)
  if (s3) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: R2_CONFIG_KEY,
          Body: jsonStr,
          ContentType: 'application/json',
          CacheControl: 'no-cache, no-store, must-revalidate',
        })
      );
    } catch (err: any) {
      console.warn('Failed to persist to R2:', err.message);
    }
  }

  // 2. /tmp directory (Writable on Vercel AWS Lambda)
  try {
    fs.writeFileSync(TMP_CONFIG_PATH, jsonStr, 'utf8');
  } catch (e) {}

  // 3. Local working directory (Only write locally, never on Vercel/serverless)
  if (!process.env.VERCEL) {
    try {
      fs.writeFileSync(CONFIG_PATH, jsonStr, 'utf8');
    } catch (e: any) {
      // Ignore local write errors
    }
  }
}

export async function saveInvite(rawInvite: Partial<WeddingInviteData>): Promise<{ success: boolean; invite?: WeddingInviteData; error?: string }> {
  try {
    const invites = await getAllInvites();
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

    await persistInvites(invites);
    return { success: true, invite: normalized };
  } catch (err: any) {
    console.error('Error in saveInvite:', err);
    return { success: false, error: err.message || 'Storage error' };
  }
}

export async function deleteInvite(identifier: string): Promise<{ success: boolean; remaining?: number; error?: string }> {
  try {
    let invites = await getAllInvites();
    const initialLen = invites.length;
    const clean = cleanSlug(identifier);

    invites = invites.filter((inv) => inv.id !== identifier && inv.slug.toLowerCase() !== clean);

    if (invites.length === initialLen) {
      return { success: false, error: 'Invite not found.' };
    }

    await persistInvites(invites);
    return { success: true, remaining: invites.length };
  } catch (err: any) {
    console.error('Error in deleteInvite:', err);
    return { success: false, error: err.message || 'Storage error' };
  }
}
