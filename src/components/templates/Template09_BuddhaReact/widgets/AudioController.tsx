'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './AudioController.module.css';

interface AudioControllerProps {
  audio?: {
    title: string;
    fileSrc?: string;
    src?: string;
    autoUnlockOnFirstTouch?: boolean;
    startOnFirstTap?: boolean;
  };
}

export function AudioController({ audio }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc =
    audio?.fileSrc ||
    audio?.src ||
    '/templates/08_unforgettable_buddhist_wedding/audio/buddhist_flute_blessing.mp3';

  const title = audio?.title || 'Temple Flute';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.warn('[AUDIO] Playback prevented:', err);
        });
    }
  };

  useEffect(() => {
    // 1. Ambient user activation fallback: start on first document pointerup if enabled
    const unlockAudio = () => {
      if (audio?.autoUnlockOnFirstTouch || audio?.startOnFirstTap) {
        if (audioRef.current && !isPlaying) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }
    };

    window.addEventListener('pointerup', unlockAudio, { once: true });

    // 2. Pause when tab/window is hidden
    const handleVisibility = () => {
      if (document.hidden && audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('pointerup', unlockAudio);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [audio, isPlaying]);

  return (
    <>
      <button
        type="button"
        className={`${styles.audioPill} ${isPlaying ? styles.playing : ''}`}
        onClick={togglePlay}
        aria-pressed={isPlaying}
        aria-label={`Toggle Buddhist Music: ${title}`}
      >
        {!isPlaying && <div className={styles.pausedRing} />}
        <span className={styles.audioIcon}>{isPlaying ? '🎶' : '🪈'}</span>
        <div className={styles.textWrap}>
          <span className={styles.label}>{isPlaying ? title : 'Play Music'}</span>
          <div className={styles.eqBars}>
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
        </div>
      </button>

      <audio ref={audioRef} loop preload="none">
        <source src={audioSrc} type="audio/mpeg" />
      </audio>
    </>
  );
}
