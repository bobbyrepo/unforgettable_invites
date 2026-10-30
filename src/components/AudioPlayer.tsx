'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  src?: string;
  title?: string;
  autoUnlock?: boolean;
}

export function AudioPlayer({ src, title = 'Wedding Music', autoUnlock = true }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;

    const handleFirstTouch = () => {
      if (hasInteracted || !autoUnlock) return;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback, user can tap the button manually
        });

      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('scroll', handleFirstTouch);
    };

    if (autoUnlock) {
      window.addEventListener('click', handleFirstTouch, { once: true });
      window.addEventListener('touchstart', handleFirstTouch, { once: true });
      window.addEventListener('scroll', handleFirstTouch, { once: true });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('scroll', handleFirstTouch);
    };
  }, [src, autoUnlock, hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log('Audio play blocked:', e));
    }
    setHasInteracted(true);
  };

  if (!src) return null;

  return (
    <aside
      aria-label="Background Music Controller"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#12151c]/90 border border-[#f6c860]/40 shadow-2xl backdrop-blur-md text-white transition-all hover:scale-105 select-none"
    >
      <button
        onClick={togglePlay}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#e0aa3e] to-[#fce08a] flex items-center justify-center text-black shadow-md focus:outline-none"
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 animate-pulse text-black" />
        ) : (
          <VolumeX className="w-4 h-4 text-black" />
        )}
      </button>

      <div className="flex flex-col pr-1">
        <span className="text-[11px] font-bold tracking-wider text-[#fce08a] uppercase flex items-center gap-1.5">
          <Music className={`w-3 h-3 ${isPlaying ? 'animate-bounce' : ''}`} />
          {isPlaying ? 'Now Playing' : 'Serene Music'}
        </span>
        <span className="text-[10px] text-[#9ca3af] max-w-[120px] truncate">
          {title}
        </span>
      </div>
    </aside>
  );
}
