'use client';

import React from 'react';
import { Sparkles, Globe, Smartphone, Zap } from 'lucide-react';

export function CatalogHero() {
  return (
    <section className="text-center py-12 md:py-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider mb-4 border shadow-2xs"
        style={{
          backgroundColor: 'var(--brand-accent-bg)',
          borderColor: 'var(--border-light)',
          color: 'var(--brand-accent)'
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Royalty-Tier Digital Wedding Invitations</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text-dark)' }}>
        The Royal Standard in <span className="text-amber-500">Digital Storybooks</span>
      </h1>

      <p className="max-w-2xl mx-auto text-xs sm:text-sm font-medium mb-8 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Explore 8 authentic architectural master themes engineered with real-time cloth physics,
        sacred temple anthems, and zero-CLS server-side speed.
      </p>

      {/* Feature Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-emerald-500" />
          <span>Mobile-First Fluid UX</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Zero-CLS Full SSR</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-500" />
          <span>Ultra-Clean Royal URLs</span>
        </div>
      </div>
    </section>
  );
}
