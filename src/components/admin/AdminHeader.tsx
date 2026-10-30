'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Palette } from 'lucide-react';

interface AdminHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AdminHeader({ theme, onToggleTheme }: AdminHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 px-6 py-4 border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(18, 21, 31, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: 'var(--border-light)'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-base shadow-xs"
            style={{ backgroundColor: 'var(--primary-action)', color: 'var(--primary-action-text)' }}
          >
            UI
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight leading-tight" style={{ color: 'var(--text-dark)' }}>
              UNFORGETTABLE INVITES
            </div>
            <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              Client Management Command Center
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl border transition-colors cursor-pointer hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-dark)'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 no-underline hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-dark)'
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
