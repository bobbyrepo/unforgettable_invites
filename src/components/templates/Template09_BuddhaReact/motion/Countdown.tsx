'use client';

import React, { useState, useEffect } from 'react';
import styles from '../sections/02-Countdown/CountdownSection.module.css';

interface CountdownProps {
  targetISO: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export function Countdown({ targetISO }: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const target = new Date(targetISO).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime({ days, hours, minutes, seconds, isPast: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        calculate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [targetISO]);

  if (!mounted) {
    // Fixed dimension placeholder for SSR (Guarantees CLS < 0.05)
    return (
      <div className={styles.dialsRow} aria-label="Auspicious Countdown Placeholder">
        <div className={styles.dialBox}><span className={styles.dialNum}>--</span><span className={styles.dialLabel}>Days</span></div>
        <div className={styles.dialBox}><span className={styles.dialNum}>--</span><span className={styles.dialLabel}>Hours</span></div>
        <div className={styles.dialBox}><span className={styles.dialNum}>--</span><span className={styles.dialLabel}>Mins</span></div>
        <div className={styles.dialBox}><span className={styles.dialNum}>--</span><span className={styles.dialLabel}>Secs</span></div>
      </div>
    );
  }

  if (time.isPast) {
    return (
      <div className={styles.dialsRowCelebrated}>
        <span className={styles.celebratedText}>🌸 Auspicious Celebration Begun 🌸</span>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={styles.dialsRow} aria-label="Auspicious Live Countdown">
      <div className={styles.dialBox}>
        <span className={styles.dialNum}>{pad(time.days)}</span>
        <span className={styles.dialLabel}>Days</span>
      </div>
      <div className={styles.dialBox}>
        <span className={styles.dialNum}>{pad(time.hours)}</span>
        <span className={styles.dialLabel}>Hours</span>
      </div>
      <div className={styles.dialBox}>
        <span className={styles.dialNum}>{pad(time.minutes)}</span>
        <span className={styles.dialLabel}>Mins</span>
      </div>
      <div className={styles.dialBox}>
        <span className={styles.dialNum}>{pad(time.seconds)}</span>
        <span className={styles.dialLabel}>Secs</span>
      </div>
    </div>
  );
}
