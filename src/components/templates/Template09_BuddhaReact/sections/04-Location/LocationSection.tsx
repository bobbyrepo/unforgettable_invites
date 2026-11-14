import React from 'react';
import { WeddingInviteData } from '@/data/types';
import styles from './LocationSection.module.css';

interface LocationSectionProps {
  data: WeddingInviteData;
}

export function LocationSection({ data }: LocationSectionProps) {
  const { events, logistics } = data;
  const primaryEvent = events[events.length - 1] || events[0];
  const venueName = primaryEvent?.venueName || 'The Grand Lotus Sanctuary';
  const venueAddress = primaryEvent?.venueAddress || 'Pune, Maharashtra';
  const mapLink = primaryEvent?.mapDeepLink || (primaryEvent as any)?.mapUrl || 'https://maps.google.com';

  return (
    <section className={styles.locationSection} data-section="04-location">
      <div className={styles.headingBlock}>
        <h2 className={styles.sectionTitle}>Sacred Destination</h2>
        <p className={styles.sectionSubtext}>How to reach the holy ceremonial grounds</p>
      </div>

      <div className={styles.venueCard} data-animate="venue-card">
        <h3 className={styles.venueName}>{venueName}</h3>
        <p className={styles.venueAddress}>{venueAddress}</p>

        <div className={styles.badgesRow}>
          {logistics?.valetParking && (
            <span className={styles.badgePill}>🚗 Valet Available</span>
          )}
          {logistics?.weather && (
            <span className={styles.badgePill}>🌤️ {logistics.weather}</span>
          )}
          {logistics?.dressCode && (
            <span className={styles.badgePill}>👗 Traditional / Pastels</span>
          )}
        </div>

        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapActionBtn}
        >
          📍 Open in Google Maps
        </a>
      </div>
    </section>
  );
}
