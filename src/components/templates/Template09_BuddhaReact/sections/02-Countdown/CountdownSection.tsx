import React from 'react';
import Image from 'next/image';
import { WeddingInviteData } from '@/data/types';
import { Countdown } from '../../motion/Countdown';
import styles from './CountdownSection.module.css';

interface CountdownSectionProps {
  data: WeddingInviteData;
}

export function CountdownSection({ data }: CountdownSectionProps) {
  const targetISO =
    (data.events && data.events[0]?.startISO) ||
    (data as any).weddingDateISO ||
    '2026-08-29T10:30:00+05:30';

  const portraitSrc =
    (data.couple as any)?.portrait?.src ||
    (data as any).thumbnailUrl ||
    '/templates/08_unforgettable_buddhist_wedding/images/countdown_photo.webp';

  return (
    <section className={styles.countdownSection} data-section="02-countdown">
      <div className={styles.headingBlock}>
        <h2 className={styles.sectionTitle}>The Countdown Begins</h2>
        <p className={styles.sectionSubtext}>Counting the moments until our auspicious vivah</p>
      </div>

      <div className={styles.countdownFrameContainer} data-animate="countdown-frame">
        <div className={styles.portraitWrap}>
          <Image
            src={portraitSrc}
            alt="Bride & Groom Portrait"
            width={360}
            height={480}
            className={styles.portraitImg}
          />
        </div>

        {/* Live IST Ticking Countdown Dials */}
        <Countdown targetISO={targetISO} />
      </div>
    </section>
  );
}
