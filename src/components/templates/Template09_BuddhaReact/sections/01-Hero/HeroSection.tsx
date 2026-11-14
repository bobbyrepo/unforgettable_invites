'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { FlockingBirds } from './FlockingBirds';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { WeddingInviteData } from '@/data/types';
import './HeroSection.css';

interface HeroSectionProps {
  data?: Partial<WeddingInviteData>;
}

export function HeroSection({ data }: HeroSectionProps) {
  const { breakpoint } = useBreakpoint();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Single Source of Truth — Dynamic Props
  const groomName = data?.couple?.groom?.name || 'Siddharth';
  const brideName = data?.couple?.bride?.name || 'Maya';
  const connector = data?.couple?.connector || 'weds';
  const groomParents = data?.couple?.groom?.parents || 'Shri. Hemant Vardhan & Smt. Sunita Vardhan';
  const brideParents = data?.couple?.bride?.parents || 'Shri. Arvind Sharma & Smt. Meena Sharma';
  const greetingNote = data?.couple?.greetingNote || 'Cordially request the honor of your presence at the wedding celebration of our beloved son & daughter';

  // 1. Native Framer-Motion 60fps Scroll Parallax Engine (Exact Framer Negative Offsets)
  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, { stiffness: 400, damping: 90 });

  // Negative transforms: as you scroll DOWN, layers translate UPWARD at authentic depth ratios
  const sunY = useTransform(smoothScroll, [0, 2500], [0, -700]);
  const sunScale = useTransform(smoothScroll, [0, 1200], [1.5, 1.1]);
  const cloudY = useTransform(smoothScroll, [0, 2500], [0, -700]);
  const templeY = useTransform(smoothScroll, [0, 2500], [0, -100]);
  const titlesOpacity = useTransform(smoothScroll, [0, 400], [1, 0]);
  const titlesY = useTransform(smoothScroll, [0, 400], [0, -120]);

  const assetBase = '/templates/08_unforgettable_buddhist_wedding';

  return (
    <section 
      ref={canvasRef}
      className={`framer-canvas-root tier-${breakpoint}`}
      id="hero-section" 
      data-framer-name="1 — Hero &amp; Invitation"
      data-device={breakpoint}
    >
      {/* 1. SKY BACKDROP (Layer 0, z-index: 0) */}
      <div className="canvas-anchor anchor-sky" aria-hidden="true">
        <picture>
          <source media="(min-width: 768px)" srcSet={`${assetBase}/images/Sky_Desktop.webp`} />
          <img src={`${assetBase}/images/Sky_Mobile.webp`} alt="Sacred Sky" className="full-width-sky" />
        </picture>
      </div>

      {/* 2. THREE.JS FLOCKING BIRDS (Layer 1, z-index: 3) */}
      <div className="canvas-anchor anchor-birds" data-framer-name="Flocking Birds">
        <FlockingBirds birdCount={22} birdSize={0.85} maxSpeed={3.2} cohesion={0.5} />
      </div>

      {/* 3. RADIANT SUN (Layer 2, top: 318px, z-index: 2) */}
      <div className="canvas-anchor anchor-sun" data-framer-name="Sun">
        <motion.div className="motion-wrapper" style={{ y: sunY, scale: sunScale }}>
          <picture>
            <source media="(min-width: 1280px)" srcSet={`${assetBase}/images/Sun_Desktop.webp`} />
            <img src={`${assetBase}/images/Sun_Mobile.webp`} alt="Sacred Sun" className="sun-img" />
          </picture>
        </motion.div>
      </div>

      {/* 4. SACRED MOUNTAIN BACKDROP (Layer 4, top: 451px, z-index: 5) */}
      <div className="canvas-anchor anchor-mountain" data-framer-name="Mountain">
        <picture>
          <source media="(min-width: 768px)" srcSet={`${assetBase}/images/Mountain_Desktop.webp`} />
          <img src={`${assetBase}/images/Mountain_Mobile.webp`} alt="Sacred Mountain" className="mountain-img" />
        </picture>
      </div>

      {/* 5. HEAVENLY CLOUDS (Layer 5, top: -2px, z-index: 6) */}
      <div className="canvas-anchor anchor-clouds" data-framer-name="Cloud">
        <motion.div className="motion-wrapper" style={{ y: cloudY }}>
          <picture>
            <source media="(min-width: 1280px)" srcSet={`${assetBase}/images/Cloud_Desktop.webp`} />
            <img src={`${assetBase}/images/Cloud_Mobile.webp`} alt="Clouds" className="clouds-img" />
          </picture>
        </motion.div>
      </div>

      {/* 6. SACRED BODHI TREES & COURTYARD GREENERY (Layer 6, top: 600px, z-index: 7 - BEHIND TEMPLE) */}
      <div className="canvas-anchor anchor-trees" data-framer-name="Trees">
        <picture>
          <source media="(min-width: 768px)" srcSet={`${assetBase}/images/Trees_Desktop.webp`} />
          <img src={`${assetBase}/images/Trees_Desktop.webp`} alt="Sacred Bodhi Trees" className="trees-img" />
        </picture>
      </div>

      {/* 7. MAHABODHI TEMPLE SANCTUARY & COURTYARD (Layer 7, top: 360px, z-index: 9) */}
      <div className="canvas-anchor anchor-temple" data-framer-name="Temple" id="hero-temple">
        <motion.div className="motion-wrapper" style={{ y: templeY }}>
          <picture>
            <source media="(min-width: 1280px)" srcSet={`${assetBase}/images/Temple_Desktop.webp`} />
            <img src={`${assetBase}/images/Temple_Mobile.webp`} alt="Mahabodhi Temple Bodh Gaya" className="temple-img" />
          </picture>
        </motion.div>
      </div>

      {/* 8. UPPER COUPLE TITLES (Layer 8, top: 93px, z-index: 8 - BEHIND TEMPLE SPIRE) */}
      <div className="canvas-anchor anchor-titles" data-framer-name="Hero Content">
        <motion.div className="motion-wrapper" style={{ opacity: titlesOpacity, y: titlesY }}>
          <div className="title-groom" data-framer-name={`Hero Title — ${groomName}`}>
            <p className="title-text text-groom framer-text">{groomName}</p>
          </div>
          <div className="title-connector" data-framer-name="Hero Title — and">
            <p className="title-text text-connector framer-text">{connector}</p>
          </div>
          <div className="title-bride" data-framer-name={`Hero Title — ${brideName}`}>
            <p className="title-text text-bride framer-text">{brideName}</p>
          </div>
        </motion.div>
      </div>

      {/* 7. GRAND TORANA ARCH FRAME (Layer 7, top: -185px, z-index: 10) */}
      <div className="canvas-anchor anchor-torana-arch" data-framer-name="Bells Frame" data-framer-appear-id="k4dhgx">
        <picture>
          <source media="(min-width: 1280px)" srcSet={`${assetBase}/images/Arch_Frame_Desktop.webp`} />
          <img src={`${assetBase}/images/Arch_Frame_Mobile.webp`} alt="Sacred Torana Golden Arch" className="arch-img" />
        </picture>
      </div>

      {/* 8. SWAYING BRASS TEMPLE BELLS (Layer 8, z-index: 10) */}
      <div className="canvas-anchor anchor-bells" aria-hidden="true">
        <div className="hanging-bell bell-1 bell-sway-1" data-framer-name="Hanging Bell 1">
          <img src={`${assetBase}/images/Bell_Floral_Chain.webp`} alt="Brass Bell 1" className="bell-img" />
        </div>
        <div className="hanging-bell bell-2 bell-sway-2" data-framer-name="Hanging Bell 2">
          <img src={`${assetBase}/images/Bell_Floral_Chain.webp`} alt="Brass Bell 2" className="bell-img" />
        </div>
        <div className="hanging-bell bell-3 bell-sway-3" data-framer-name="Hanging Bell 3">
          <img src={`${assetBase}/images/Bell_Long_Chain.webp`} alt="Brass Bell 3" className="bell-img" />
        </div>
        <div className="hanging-bell bell-4 bell-sway-4" data-framer-name="Hanging Bell 4">
          <img src={`${assetBase}/images/Bell_Long_Chain.webp`} alt="Brass Bell 4" className="bell-img" />
        </div>
        <div className="hanging-bell bell-5 bell-sway-5 desktop-bell" data-framer-name="Hanging Bell 5">
          <img src={`${assetBase}/images/Bell_Long_Chain.webp`} alt="Brass Bell 5" className="bell-img" />
        </div>
        <div className="hanging-bell bell-6 bell-sway-6 desktop-bell" data-framer-name="Hanging Bell 6">
          <img src={`${assetBase}/images/Bell_Long_Chain.webp`} alt="Brass Bell 6" className="bell-img" />
        </div>
      </div>

      {/* 10. INVITATION DETAILS CARD SURFACE (Layer 10, top: 2599px, z-index: 10) */}
      <div className="canvas-anchor anchor-invitation-details framer-lly6cm" data-framer-name="Invitation Details">
        <div className="card-shloka-1" data-framer-name="Ganpati Name (img)">
          <picture>
            <source media="(min-width: 1280px)" srcSet={`${assetBase}/images/Invocation_Text_Desktop.webp`} />
            <img src={`${assetBase}/images/Invocation_Text_Mobile.webp`} alt="वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ" className="shloka-img" />
          </picture>
        </div>

        <div className="card-buddha-emblem" data-framer-name="Ganpati Icon">
          <picture>
            <source media="(min-width: 1280px)" srcSet={`${assetBase}/images/Blessing_Emblem_Desktop.webp`} />
            <img src={`${assetBase}/images/Blessing_Emblem_Mobile.webp`} alt="Buddha Medallion" className="emblem-img" />
          </picture>
        </div>

        <div className="card-shloka-2" data-framer-name="Shri Line (img)">
          <picture>
            <source media="(min-width: 1280px)" srcSet={`${assetBase}/images/Benediction_Line_Desktop.webp`} />
            <img src={`${assetBase}/images/Benediction_Line_Mobile.webp`} alt="निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा" className="benediction-img" />
          </picture>
        </div>

        <div className="card-parents-block" data-framer-name="Groom Parents">
          <p className="card-parents-text framer-text">{groomParents}</p>
        </div>

        <div className="card-invitation-note" data-framer-name="Invitation Line">
          <p className="card-note-text framer-text">{greetingNote}</p>
        </div>

        <div className="card-name-groom" data-framer-name={`Groom Name — ${groomName}`}>
          <p className="card-name-primary framer-text">{groomName}</p>
        </div>

        <div className="card-connector-wrap" data-framer-name="Ampersand — and">
          <span className="card-connector-cursive framer-text">and</span>
        </div>

        <div className="card-name-bride" data-framer-name={`Bride Name — ${brideName}`}>
          <p className="card-name-primary framer-text">{brideName}</p>
        </div>

        <div className="card-daughter-block" data-framer-name="Label — Daughter of">
          <p className="card-daughter-label framer-text">Daughter of</p>
        </div>

        <div className="card-bride-parents" data-framer-name="Bride Parents">
          <p className="card-parents-text framer-text">{brideParents}</p>
        </div>

        <div className="card-events-intro" data-framer-name="Label — Events Intro">
          <p className="card-events-intro-text framer-text">Wedding Celebration Events</p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
