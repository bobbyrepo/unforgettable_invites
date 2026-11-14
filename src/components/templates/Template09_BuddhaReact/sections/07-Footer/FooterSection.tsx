import React from 'react';
import Image from 'next/image';
import { WeddingInviteData } from '@/data/types';
import styles from './FooterSection.module.css';

interface FooterSectionProps {
  data: WeddingInviteData;
}

export function FooterSection({ data }: FooterSectionProps) {
  const rsvp = data.rsvp || {
    kind: 'whatsapp',
    target: '+919876543210',
    label: 'RSVP on WhatsApp',
  };

  const rsvpLink =
    rsvp.kind === 'whatsapp'
      ? `https://wa.me/${rsvp.target.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
          `Namaste! I would love to confirm my presence for ${data.couple.bride.name} & ${data.couple.groom.name}'s sacred wedding ceremony.`
        )}`
      : rsvp.target;

  return (
    <footer className={styles.footerSection} data-section="07-footer">
      {/* Golden Buddha Statue with Lotus Halo */}
      <div className={styles.buddhaContainer} data-animate="buddha-statue">
        <div className={styles.lotusHalo} />
        <Image
          src="/templates/08_unforgettable_buddhist_wedding/images/Gautam_Buddha_Mobile.webp"
          alt="Lord Gautam Buddha in Serene Meditation"
          width={760}
          height={980}
          className={styles.buddhaImage}
        />
      </div>

      <div className={styles.closingBlock}>
        <h3 className={styles.closingTitle}>सब्बे सत्ता सुखी होन्तु</h3>
        <p className={styles.closingText}>
          &ldquo;May all beings be peaceful, happy, and blessed with eternal joy.&rdquo;
        </p>
      </div>

      <a
        href={rsvpLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.rsvpActionBtn}
        data-animate="rsvp-btn"
      >
        💌 {rsvp.label || 'RSVP on WhatsApp'}
      </a>

      <div className={styles.copyrightTag}>
        Unforgettable Invites • Sacred Buddhist Wedding Collection
      </div>
    </footer>
  );
}
