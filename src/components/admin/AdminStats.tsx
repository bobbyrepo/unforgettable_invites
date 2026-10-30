'use client';

import React from 'react';

interface AdminStatsProps {
  totalInvites: number;
}

export function AdminStats({ totalInvites }: AdminStatsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div
        className="p-5 rounded-2xl border transition shadow-2xs"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
      >
        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Total Client Invites</div>
        <div className="text-2xl font-black" style={{ color: 'var(--text-dark)' }}>{totalInvites}</div>
        <div className="text-2xs font-medium mt-1 text-emerald-600 dark:text-emerald-400">All live on clean royal URLs</div>
      </div>

      <div
        className="p-5 rounded-2xl border transition shadow-2xs"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
      >
        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Master Templates</div>
        <div className="text-2xl font-black" style={{ color: 'var(--text-dark)' }}>8</div>
        <div className="text-2xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Vedic, Palace, South & Modern</div>
      </div>

      <div
        className="p-5 rounded-2xl border transition shadow-2xs"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
      >
        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>System Status</div>
        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Operational</div>
        <div className="text-2xs font-medium mt-1" style={{ color: 'var(--text-muted)' }}>Zero-CLS SSR Dynamic Routing</div>
      </div>
    </section>
  );
}
