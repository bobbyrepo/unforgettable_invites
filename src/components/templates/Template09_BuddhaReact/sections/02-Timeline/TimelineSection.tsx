'use client';

import React from 'react';
import { WeddingInviteData } from '@/data/types';
import './TimelineSection.css';

interface TimelineSectionProps {
  data?: Partial<WeddingInviteData>;
  assetBase?: string;
}

export function TimelineSection({ data, assetBase = '/templates/08_unforgettable_buddhist_wedding' }: TimelineSectionProps) {
  // Authentic 6 Ceremonies matching Framer design & content
  const defaultEvents = [
    {
      id: 'e1',
      number: '1',
      title: 'Mangala Vandana',
      day: 'Friday',
      date: '29th Aug 2026',
      venue: 'Bodh Gaya, Bihar',
      time: '6 Pm Onwards',
      link: '#',
    },
    {
      id: 'e2',
      number: '2',
      title: 'Haldi & Teerth Snan',
      day: 'Friday',
      date: '29th Aug 2026',
      venue: 'Bodh Gaya, Bihar',
      time: '6 Pm Onwards',
      link: '#',
    },
    {
      id: 'e3',
      number: '3',
      title: 'Bodhi Sangeet',
      day: 'Friday',
      date: '29th Aug 2026',
      venue: 'Bodh Gaya, Bihar',
      time: '6 Pm Onwards',
      link: '#',
    },
    {
      id: 'e4',
      number: '4',
      title: 'Sacred Bodhi Vivaha',
      day: 'Friday',
      date: '29th Aug 2026',
      venue: 'Bodh Gaya, Bihar',
      time: '6 Pm Onwards',
      link: '#',
    },
    {
      id: 'e5',
      number: '5',
      title: 'Pradakshina of Light',
      day: 'Friday',
      date: '29th Aug 2026',
      venue: 'Bodh Gaya, Bihar',
      time: '6 Pm Onwards',
      link: '#',
    },
    {
      id: 'e6',
      number: '6',
      title: 'Grand Bodhi Gala',
      day: 'Friday',
      date: '29th Aug 2026',
      venue: 'Bodh Gaya, Bihar',
      time: '6 Pm Onwards',
      link: '#',
    },
  ];

  // If user supplied data.events, merge gracefully
  const events = (data?.events && data.events.length > 0)
    ? data.events.map((e, idx) => ({
        id: e.id || `custom-${idx}`,
        number: String(idx + 1),
        title: e.title || defaultEvents[idx]?.title || 'Ceremony',
        day: e.day || defaultEvents[idx]?.day || 'Friday',
        date: e.date || defaultEvents[idx]?.date || '29th Aug 2026',
        venue: e.venueName || e.venueAddress || defaultEvents[idx]?.venue || 'Bodh Gaya, Bihar',
        time: e.time || defaultEvents[idx]?.time || '6 Pm Onwards',
        link: e.mapDeepLink || defaultEvents[idx]?.link || '#',
      }))
    : defaultEvents;

  return (
    <section 
      className="framer-timeline-root" 
      data-framer-name="2 — Wedding Timeline"
      id="wedding-timeline"
    >
      {/* 1. PILLAR BACKDROP (Sandstone Colonnade Courtyard behind Temple) */}
      <div className="timeline-pillar-backdrop" data-framer-name="Pillar Backdrop" aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet={`${assetBase}/images/Pillar_Colonnade_Desktop.webp`} />
          <img 
            src={`${assetBase}/images/Pillar_Colonnade_Mobile.webp`} 
            alt="Sandstone Colonnade Courtyard" 
            className="colonnade-bg-img" 
          />
        </picture>
      </div>

      {/* 2. PEACOCK BACKDROP (Carved Sandstone Bridge with Golden Deer) */}
      <div className="timeline-peacock-backdrop" data-framer-name="Peacock Backdrop" aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet={`${assetBase}/images/Alcove_Backdrop_Desktop.webp`} />
          <img 
            src={`${assetBase}/images/Alcove_Backdrop_Mobile.webp`} 
            alt="Carved Sandstone Bridge with Golden Deer" 
            className="alcove-bg-img" 
          />
        </picture>
      </div>

      {/* 3. TIMELINE HEADING */}
      <div className="timeline-heading-block" data-framer-name="Timeline Heading">
        <h2 className="timeline-title-text framer-text">Wedding Celebration Timeline</h2>
      </div>

      {/* 4. TIMELINE SUBTEXT */}
      <div className="timeline-subtext-block" data-framer-name="Timeline Subtext">
        <p className="timeline-subtext-text framer-text">Mark Your Calendars, We Can’t Wait to Celebrate</p>
      </div>

      {/* 5. EVENT PILLARS CARDS (Haldi, Mehendi, Sangeet, Vivaha / Shadi, Gala) */}
      <div className="timeline-events-container" data-framer-name="Event Pillars">
        <div className="timeline-pillars-row" data-framer-name="Pillars Row">
          {events.map((evt) => (
            <div 
              key={evt.id} 
              className="event-pillar-card"
              data-framer-name={evt.number}
            >
              <img 
                src={`${assetBase}/images/Event_Frame_Pillar.webp`} 
                alt="" 
                className="pillar-frame-bg" 
                aria-hidden="true" 
              />
              <div className="pillar-content-wrap">
                <div className="pillar-title-area">
                  <h3 className="pillar-event-title framer-text">{evt.title}</h3>
                </div>

                <div className="pillar-details-area">
                  <p className="pillar-day framer-text">{evt.day}</p>
                  <p className="pillar-date framer-text">{evt.date}</p>
                  <p className="pillar-venue framer-text">{evt.venue}</p>
                  <p className="pillar-time framer-text">{evt.time}</p>
                </div>

                <a 
                  href={evt.link} 
                  target={evt.link !== '#' ? '_blank' : '_self'} 
                  rel="noopener noreferrer" 
                  className="pillar-link-cta framer-text"
                >
                  More details below
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
