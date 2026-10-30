export type TemplateId = 
  | '01_unforgettable_temple_grace'
  | '02_unforgettable_radha_krishna'
  | '03_unforgettable_pastel_elegance'
  | '04_unforgettable_ayodhya_heritage'
  | '05_unforgettable_meenakshi_royal'
  | '06_unforgettable_udaipur_palace'
  | '07_unforgettable_ram_mandir'
  | '08_unforgettable_buddhist_wedding';

export type LifecycleStatus = 'UPCOMING' | 'WEDDING_DAY' | 'ARCHIVED';

export interface CoupleMember {
  name: string;
  parents?: string;
  father?: string;
  mother?: string;
  familyTitles?: string;
}

export interface WeddingEvent {
  id: string;
  title: string;       // e.g. "Shaadi", "Haldi", "Sangeet", "Reception"
  date: string;        // e.g. "29th Aug 2026"
  day: string;         // e.g. "Friday"
  time: string;        // e.g. "6:00 PM Onwards"
  venueName: string;
  venueAddress: string;
  mapDeepLink?: string;
  dressCode?: string;
}

export interface BlessingShloka {
  verseSanskrit: string;
  verseEnglish?: string;
  translation?: string;
  deity?: string;
}

export interface AudioConfig {
  title: string;
  fileSrc: string;
  autoUnlockOnFirstTouch: boolean;
}

export interface LogisticsConfig {
  dressCode?: string;
  valetParking?: string;
  weather?: string;
  contactNumber?: string;
  contactName?: string;
  accommodation?: string;
}

export interface FeatureToggles {
  enableMusic?: boolean;
  enableDressCode?: boolean;
  enableValet?: boolean;
  enableWeather?: boolean;
  enableShloka?: boolean;
  enableHashtag?: boolean;
  enableMaps?: boolean;
}

export interface InviteStats {
  views: number;
  viewsToday: number;
  activeDays: number;
  boosted?: boolean;
}

export interface WeddingInviteData {
  id: string;
  slug: string; // Clean public slug e.g. "a-w-s"
  templateId: TemplateId;
  lifecycleStatus: LifecycleStatus;
  weddingDateISO: string; // ISO 8601
  title?: string;
  couple: {
    groom: CoupleMember;
    bride: CoupleMember;
    connector?: string;       // "weds", "&", "संग", "hearts"
    monogram?: string;        // "A & S"
    hashtag?: string;         // "#AaravWedsSaisha"
    greetingNote?: string;    // "Together with their families..."
  };
  shloka?: BlessingShloka;
  events: WeddingEvent[];
  audio?: AudioConfig;
  logistics?: LogisticsConfig;
  toggles?: FeatureToggles;
  stats?: InviteStats;
  thumbnailUrl?: string;
  updatedAt?: string;
}
