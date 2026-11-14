import React from 'react';
import { WeddingInviteData } from '@/data/types';
import styles from './MeetCoupleSection.module.css';

interface MeetCoupleSectionProps {
  data: WeddingInviteData;
}

export function MeetCoupleSection({ data }: MeetCoupleSectionProps) {
  const { couple } = data;
  const bride = couple.bride;
  const groom = couple.groom;
  const note =
    couple.greetingNote ||
    (couple as any).note ||
    'Cordially request the honor of your presence at the wedding celebration of our beloved son & daughter';

  return (
    <section className={styles.meetCoupleSection} data-section="03-meet-couple">
      <div className={styles.headingBlock}>
        <h2 className={styles.sectionTitle}>Meet the Bride & Groom</h2>
        <p className={styles.sectionSubtext}>Two souls uniting on the noble path of Dhamma & Love</p>
      </div>

      {/* Handcrafted Parchment Message Frame */}
      <div className={styles.messageCardWrapper} data-animate="message-frame">
        <div className={styles.messageCardBackground} />
        <p className={styles.messageNoteText}>
          &ldquo;{note}&rdquo;
        </p>
      </div>

      {/* Bride & Groom Bio Cards */}
      <div className={styles.coupleBioRow}>
        <div className={styles.bioCard} data-animate="bio-groom">
          <h3 className={styles.bioName}>{groom.name}</h3>
          <div className={styles.bioTitle}>
            {groom.parents ? `Son of ${groom.parents}` : 'The Groom'}
          </div>
          <p className={styles.bioDesc}>
            {(groom as any).bio ||
              'Guided by timeless wisdom, boundless compassion, and peaceful harmony.'}
          </p>
        </div>

        <div className={styles.bioCard} data-animate="bio-bride">
          <h3 className={styles.bioName}>{bride.name}</h3>
          <div className={styles.bioTitle}>
            {bride.parents ? `Daughter of ${bride.parents}` : 'The Bride'}
          </div>
          <p className={styles.bioDesc}>
            {(bride as any).bio ||
              'Walking with mindful serenity, deep devotion, and endless joy.'}
          </p>
        </div>
      </div>
    </section>
  );
}
