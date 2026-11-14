'use client';

import React from 'react';
import { WeddingInviteData } from '@/data/types';
import { HeroSection } from './sections/01-Hero/HeroSection';
import { TimelineSection } from './sections/02-Timeline/TimelineSection';
import { MeetCoupleSection } from './sections/03-MeetCouple/MeetCoupleSection';
import { LocationSection } from './sections/04-Location/LocationSection';
import { FooterSection } from './sections/07-Footer/FooterSection';

interface Template09Props {
  data?: Partial<WeddingInviteData>;
}

const DEFAULT_INVITE_DATA: WeddingInviteData = {
  id: 'template-09-buddha',
  slug: 'maya-siddharth',
  lifecycleStatus: 'UPCOMING',
  templateId: '08_unforgettable_buddhist_wedding',
  weddingDateISO: '2026-08-29T10:30:00',
  couple: {
    groom: {
      name: 'Siddharth',
      parents: 'Shri. Hemant Vardhan & Smt. Sunita Vardhan',
    },
    bride: {
      name: 'Maya',
      parents: 'Shri. Arvind Sharma & Smt. Meena Sharma',
    },
    connector: 'weds',
    greetingNote: 'Cordially request the honor of your presence at the wedding celebration of our beloved son & daughter',
    hashtag: '#MayaFoundHerSiddharth',
  },
  shloka: {
    verseSanskrit: 'नत्थि सन्ति परं सुखं',
    translation: 'There is no higher happiness than peace & sacred union',
  },
  events: [
    {
      id: 'event-1',
      title: 'Mangala Vandana',
      date: '28th Aug 2026',
      day: 'Thursday',
      time: '4:00 PM Onwards',
      venueName: 'Lotus Pavilion Hall',
      venueAddress: 'Bodh Gaya, Bihar',
      mapDeepLink: 'https://maps.google.com/?q=Bodh+Gaya',
    },
    {
      id: 'event-2',
      title: 'Haldi & Teerth Snan',
      date: '29th Aug 2026',
      day: 'Friday',
      time: '10:30 AM Onwards',
      venueName: 'Mahabodhi Grand Sanctuary',
      venueAddress: 'Bodh Gaya, Bihar',
      mapDeepLink: 'https://maps.google.com/?q=Bodh+Gaya',
    },
    {
      id: 'event-3',
      title: 'Bodhi Sangeet',
      date: '29th Aug 2026',
      day: 'Friday',
      time: '6:00 PM Onwards',
      venueName: 'The Bodhi Gardens',
      venueAddress: 'Bodh Gaya, Bihar',
      mapDeepLink: 'https://maps.google.com/?q=Bodh+Gaya',
    },
    {
      id: 'event-4',
      title: 'Sacred Bodhi Vivaha',
      date: '29th Aug 2026',
      day: 'Friday',
      time: '8:00 PM Onwards',
      venueName: 'Mahabodhi Sanctuary',
      venueAddress: 'Bodh Gaya, Bihar',
      mapDeepLink: 'https://maps.google.com/?q=Bodh+Gaya',
    },
    {
      id: 'event-5',
      title: 'Pradakshina of Light',
      date: '30th Aug 2026',
      day: 'Saturday',
      time: '6:00 PM Onwards',
      venueName: 'Temple Grounds',
      venueAddress: 'Bodh Gaya, Bihar',
      mapDeepLink: 'https://maps.google.com/?q=Bodh+Gaya',
    },
    {
      id: 'event-6',
      title: 'Grand Bodhi Gala',
      date: '30th Aug 2026',
      day: 'Saturday',
      time: '8:00 PM Onwards',
      venueName: 'Royal Bodhi Banquet Hall',
      venueAddress: 'Bodh Gaya, Bihar',
      mapDeepLink: 'https://maps.google.com/?q=Bodh+Gaya',
    },
  ],
  logistics: {
    weather: '27°C Pleasant Evening Breeze',
    valetParking: 'Complimentary Valet at Main Gate',
    dressCode: 'Traditional Royal Silk & Pastel Hues',
    contactNumber: '919876543210',
  },
  audio: {
    title: 'Buddhist Flute Blessing',
    fileSrc: '/templates/08_unforgettable_buddhist_wedding/audio/buddhist_flute_blessing.mp3',
    autoUnlockOnFirstTouch: true,
  },
  toggles: {
    enableMusic: true,
    enableRSVP: false,
  },
};

export function Template09({ data }: Template09Props) {
  const mergedData: WeddingInviteData = {
    ...DEFAULT_INVITE_DATA,
    ...data,
    couple: {
      ...DEFAULT_INVITE_DATA.couple,
      ...(data?.couple || {}),
      groom: {
        ...DEFAULT_INVITE_DATA.couple.groom,
        ...(data?.couple?.groom || {}),
      },
      bride: {
        ...DEFAULT_INVITE_DATA.couple.bride,
        ...(data?.couple?.bride || {}),
      },
    },
    events: (data?.events && data.events.length > 0) ? (data.events as any) : DEFAULT_INVITE_DATA.events,
  };

  return (
    <div 
      className="buddhist-wedding-template-root" 
      style={{ 
        width: '100%', 
        minHeight: '100vh', 
        background: '#fff8f0', 
        color: '#5f250f', 
        overflowX: 'hidden', 
        position: 'relative' 
      }}
    >
      {/* Floating Serenity Audio Controller */}
      <div id="buddhist-audio-controller" className="buddhist-audio-pill" role="button" aria-label="Toggle Buddhist Temple Music">
        <div id="audio-icon-wrap" className="audio-pill-icon">🪷</div>
        <div id="audio-text-wrap" className="audio-pill-text">
          <div className="audio-pill-label">Temple Flute</div>
          <div id="audio-eq-bars" className="audio-pill-bars">
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
          </div>
        </div>
      </div>
      <audio id="buddhist-audio-element" loop preload="auto">
        <source src="/templates/08_unforgettable_buddhist_wedding/audio/buddhist_flute_blessing.mp3" type="audio/mpeg" />
      </audio>

      <main 
        id="main" 
        className="buddha-template-main"
      >
        {/* Section 1: 1 — Hero & Invitation */}
        <HeroSection data={mergedData} />

        {/* Section 2: 2 — Wedding Timeline (Includes Sandstone Courtyard Backdrop & Event Cards) */}
        <TimelineSection data={mergedData} />

        {/* Subsequent Sections: Meet Couple, Location & Footer */}
        <div className="template09-subsections">
          <MeetCoupleSection data={mergedData} />
          <LocationSection data={mergedData} />
          <FooterSection data={mergedData} />
        </div>
      </main>

      <style jsx global>{`
        .buddha-template-main {
          width: 100%;
          position: relative;
          min-height: 9800px;
          overflow: visible;
        }
        .template09-subsections {
          position: relative;
          top: 6620px;
          width: 100%;
          z-index: 4;
        }
        @media (max-width: 767.98px) {
          .buddha-template-main {
            min-height: 5200px;
          }
          .template09-subsections {
            top: 3400px;
          }
        }
      `}</style>
    </div>
  );
}

export default Template09;
