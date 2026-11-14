'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface BreakpointInfo {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  isMounted: boolean;
}

export function useBreakpoint(): BreakpointInfo {
  const [info, setInfo] = useState<BreakpointInfo>({
    breakpoint: 'desktop', // safe default
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1536,
    isMounted: false,
  });

  useEffect(() => {
    function calculateBreakpoint() {
      const w = window.innerWidth;
      let bp: Breakpoint = 'desktop';
      if (w < 768) {
        bp = 'mobile';
      } else if (w < 1280) {
        bp = 'tablet';
      } else {
        bp = 'desktop';
      }

      setInfo({
        breakpoint: bp,
        isMobile: bp === 'mobile',
        isTablet: bp === 'tablet',
        isDesktop: bp === 'desktop',
        width: w,
        isMounted: true,
      });

      // Inject Option B CSS variables on documentElement & root
      document.documentElement.style.setProperty('--breakpoint', bp);
      document.documentElement.style.setProperty('--viewport-width', `${w}px`);
      document.documentElement.setAttribute('data-device', bp);
    }

    calculateBreakpoint();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateBreakpoint, 50);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return info;
}
