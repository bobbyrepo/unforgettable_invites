'use client';

import React from 'react';
import { WeddingInviteData } from '@/data/types';
import styles from './RamMandir.module.css';

interface Template07Props {
  data: WeddingInviteData;
}

export function Template07RamMandir({ data }: Template07Props) {
  const { couple, events, shloka } = data;
  const groomName = couple.groom.name;
  const brideName = couple.bride.name;
  const primaryVenue = events[events.length - 1]?.venueName || 'Rambagh Mandir Mandap';
  const primaryCity = events[events.length - 1]?.venueAddress || 'Jaipur, Rajasthan';

  return (
    <div className={styles.templateRoot}>
      <div className={styles.canvasWrapper}>
        
        {/* =========================================================
            SECTION 1: HERO, VEDIC SHLOKA & TEMPLE SHIKHAR
            ========================================================= */}
        <section className={styles.heroSection}>
          {/* Layer 0: Sunrise Sky */}
          <div
            className={styles.skyBackground}
            style={{
              backgroundImage:
                "url('/templates/07_unforgettable_ram_mandir/images/sky_background.webp'), url('/assets/sky_background.webp')",
            }}
          />

          {/* Layer 1: Sacred Radiant Sun */}
          <div className={styles.sunLayer} />

          {/* Layer 2: Mountain Ridge */}
          <div className={styles.mountainLayer} />

          {/* Layer 3: Atmospheric Clouds */}
          <div className={styles.cloudLayer} />

          {/* Layer 4: Flocking Birds */}
          <div className={styles.birdsLayer} />

          {/* Layer 5: Waving Temple Flag (Preserved behind Shikhar) */}
          <div className={styles.flagContainerMobile}>
            <div className={styles.flagInnerCanvas} />
          </div>

          {/* Layer 6: Holy Ram Mandir Shikhar Cutout */}
          <div className={styles.templeLayer}>
            <img
              src="/templates/07_unforgettable_ram_mandir/images/lKVzZvE9zjHal1zLmfO4koCjo.webp"
              alt="Holy Ram Mandir Spire"
              className={styles.templeImage}
            />
          </div>

          {/* Layer 7: Vedic Shloka & Couple Names */}
          <div className={styles.shlokaContainer}>
            <div className={styles.ganpatiIcon}>
              <img
                src="/assets/ganesh_shloka.webp"
                alt="Lord Ganesha"
                className="w-10 h-10 mx-auto object-contain"
              />
            </div>
            <div className={styles.ganpatiName}>॥ श्री गणेशाय नमः ॥</div>
            <div className={styles.shriLine}>
              {shloka?.verseSanskrit || 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥'}
            </div>

            <div className="mt-8 text-center">
              <span className="text-[12px] tracking-[4px] text-[#e0aa3e] uppercase font-semibold block mb-2">
                Auspicious Vivah Ceremony
              </span>
              <h1 className={styles.coupleHeroTitleGroom}>{groomName}</h1>
              <span className={styles.coupleHeroTitleConnector}>weds</span>
              <h1 className={styles.coupleHeroTitleBride}>{brideName}</h1>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: CEREMONIAL TIMELINE CARDS
            ========================================================= */}
        <section className={styles.timelineSection}>
          <div className={styles.timelineHeadingBlock}>
            <h2 className={styles.timelineMainTitle}>Auspicious Ceremonies</h2>
            <p className={styles.timelineSubText}>Celebrate our divine journey with love and blessings</p>
          </div>

          <div className={styles.timelineCardsStack}>
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              const cardTilt = isEven
                ? { transform: 'translateX(-50%) translateX(40px) translateY(30px) rotate(6deg)' }
                : { transform: 'translateX(-50%) translateX(-40px) translateY(30px) rotate(-6deg)' };

              return (
                <div
                  key={event.id}
                  className={styles.eventCard}
                  style={cardTilt}
                >
                  <div className={styles.eventCardInner}>
                    <span className={styles.eventBadge}>{event.title}</span>
                    <h3 className={styles.eventDate}>{event.date}</h3>
                    <p className={styles.eventTime}>{event.day} • {event.time}</p>
                    
                    <div className={styles.eventVenueDetails}>
                      <span className={styles.eventVenueName}>{event.venueName}</span>
                      <span className={styles.eventVenueCity}>{event.venueAddress}</span>
                    </div>

                    {event.mapDeepLink && (
                      <a
                        href={event.mapDeepLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.eventMapBtn}
                      >
                        <span>Google Maps</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            SECTION 3: MANDAP LOCATION & FOOTER
            ========================================================= */}
        <section className={styles.venueSection}>
          <div className={styles.dividerBlock}>
            <img
              src="/templates/07_unforgettable_ram_mandir/images/T7c0PLf2sfUhiq0SlGf4frlVQMA.webp"
              alt="Golden Divider"
              className={styles.dividerImage}
            />
          </div>

          <div className={styles.mandapCard}>
            <span className={styles.mandapTag}>Vivah Sthal • Mandap</span>
            <h3 className={styles.mandapName}>{primaryVenue}</h3>
            <p className={styles.mandapCity}>{primaryCity}</p>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(primaryVenue + ', ' + primaryCity)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mandapDirectionsBtn}
            >
              <span>Get Driving Directions</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Footer Floral Arch */}
          <div className={styles.templeFooter}>
            <img
              src="/templates/07_unforgettable_ram_mandir/images/LDGCqdzKnQ5ErPPOpHZbdl96s.webp"
              alt="Mandir Gateway"
              className={styles.footerGatewayImage}
            />
            <p className={styles.footerFamilyBlessing}>
              Shubh Vivah Blessings from the Mehra & Verma Families
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
