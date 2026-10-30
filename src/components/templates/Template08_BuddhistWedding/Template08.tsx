'use client';

import React from 'react';
import { WeddingInviteData } from '@/data/types';
import styles from './BuddhistWedding.module.css';

interface Template08Props {
  data: WeddingInviteData;
}

export function Template08BuddhistWedding({ data }: Template08Props) {
  const { couple, events, shloka } = data;
  const groomName = couple.groom.name;
  const brideName = couple.bride.name;
  const weddingDate = events[events.length - 1]?.date || '29th Aug 2026';
  const weddingDay = events[events.length - 1]?.day || 'Friday';
  const primaryVenue = events[events.length - 1]?.venueName || 'The Grand Palace';
  const primaryCity = events[events.length - 1]?.venueAddress || 'Pune, Maharashtra';

  return (
    <div className={styles.templateRoot}>
      <div className={styles.canvasWrapper}>
        
        {/* =========================================================
            SECTION 1: HERO & SACRED SHLOKA BANNER
            ========================================================= */}
        <section className={styles.heroSection}>
          {/* Layer 0: Sky Background */}
          <div
            className={styles.skyBackground}
            style={{
              backgroundImage:
                "url('/templates/08_unforgettable_buddhist_wedding/images/sky_background.webp'), url('/assets/sky_background.webp')",
            }}
          />

          {/* Layer 5: Prayer Flags (Preserved behind Gopuram Spire) */}
          <div className={styles.prayerFlagsLayer}>
            <div className={styles.flagLeftPole} />
            <div className={styles.flagRightPole} />
          </div>

          {/* Layer 6: Sacred Gopuram Spire Cutout */}
          <div className={styles.gopuramHeroContainer}>
            <img
              src="/templates/08_unforgettable_buddhist_wedding/images/lKVzZvE9zjHal1zLmfO4koCjo.webp"
              alt="Sacred Gopuram Mandap"
              className={styles.gopuramHeroImage}
            />
          </div>

          {/* Layer 7: Sacred Shloka & Couple Presentation */}
          <div className={styles.heroContentContainer}>
            {shloka && (
              <div className={styles.shlokaBox}>
                <p className={styles.shlokaSanskrit}>{shloka.verseSanskrit}</p>
                {shloka.translation && (
                  <p className={styles.shlokaTranslation}>{shloka.translation}</p>
                )}
              </div>
            )}

            <div className={styles.coupleNamesBlock}>
              <span className={styles.auspiciousTag}>॥ शुभ विवाह ॥</span>
              <h1 className={styles.coupleGroom}>{groomName}</h1>
              <span className={styles.wedsSymbol}>weds</span>
              <h1 className={styles.coupleBride}>{brideName}</h1>
            </div>

            <div className={styles.heroDateBadge}>
              <span>{weddingDay} • {weddingDate}</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: CEREMONIAL TIMELINE & TILTING CARDS
            ========================================================= */}
        <section className={styles.timelineSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Wedding Ceremonies</h2>
            <p className={styles.sectionSubtitle}>Join us in celebrating every sacred milestone</p>
          </div>

          <div className={styles.cardStackContainer}>
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              const cardTiltStyle = isEven
                ? { transform: 'translateX(-50%) translateX(30px) rotate(4deg)' }
                : { transform: 'translateX(-50%) translateX(-30px) rotate(-4deg)' };

              return (
                <div
                  key={event.id}
                  className={styles.ceremonyCard}
                  style={cardTiltStyle}
                >
                  <div className={styles.cardInner}>
                    <span className={styles.cardCeremonyTag}>{event.title}</span>
                    <h3 className={styles.cardDateText}>{event.date}</h3>
                    <p className={styles.cardTimeText}>{event.day} • {event.time}</p>
                    <div className={styles.cardVenueBlock}>
                      <span className={styles.cardVenueName}>{event.venueName}</span>
                      <span className={styles.cardVenueCity}>{event.venueAddress}</span>
                    </div>

                    {event.mapDeepLink && (
                      <a
                        href={event.mapDeepLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mapLinkBtn}
                      >
                        <span>View on Maps</span>
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
            SECTION 3: VENUE LOCATION & COUNTDOWN
            ========================================================= */}
        <section className={styles.venueSection}>
          <div className={styles.countdownDivider}>
            <img
              src="/templates/08_unforgettable_buddhist_wedding/images/T7c0PLf2sfUhiq0SlGf4frlVQMA.webp"
              alt="Decorative Lotus Divider"
              className={styles.dividerImg}
            />
          </div>

          <div className={styles.venueCard}>
            <span className={styles.venueTag}>Vivah Sthal • Venue</span>
            <h3 className={styles.venueName}>{primaryVenue}</h3>
            <p className={styles.venueAddress}>{primaryCity}</p>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(primaryVenue + ', ' + primaryCity)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryDirectionBtn}
            >
              <span>Get Driving Directions</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Temple Lotus Footer */}
          <div className={styles.templeFooter}>
            <img
              src="/templates/08_unforgettable_buddhist_wedding/images/LDGCqdzKnQ5ErPPOpHZbdl96s.webp"
              alt="Temple Lotus Gateway"
              className={styles.footerGatewayImg}
            />
            <p className={styles.familyBlessingText}>
              With heartfelt blessings from the Sharma & Patel Families
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
