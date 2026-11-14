'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useSectionMotion: Hooks GSAP ScrollTrigger entrance animations and scrubbed parallax
 * Complies strictly with Blueprint v2.2 (Section 7)
 */
export function useSectionMotion(root: React.RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      // 1. Accessibility: reduced motion path
      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Clear all transforms to resting settled state immediately
        gsap.set(el.querySelectorAll('[data-animate], [data-parallax]'), {
          clearProps: 'transform,opacity',
        });
        el.dataset.motion = 'active';
      });

      // 2. Full motion path
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const animElements = el.querySelectorAll('[data-animate]');
        if (animElements.length > 0) {
          gsap.from(animElements, {
            opacity: 0,
            y: 28,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          });
        }

        el.dataset.motion = 'active';

        // Parallax layers (sky, sun, clouds, trees)
        const parallaxLayers = el.querySelectorAll<HTMLElement>('[data-parallax]');
        parallaxLayers.forEach((layer) => {
          const factor = Number(layer.dataset.parallax) || 0.1;
          const dist = window.innerHeight + el.offsetHeight;
          gsap.fromTo(
            layer,
            { y: (-factor * dist) / 2 },
            {
              y: (factor * dist) / 2,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            }
          );
        });
      });

      // Refresh ScrollTrigger once web fonts settle
      if (document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      return () => {
        mm.revert();
      };
    },
    { scope: root }
  );
}
