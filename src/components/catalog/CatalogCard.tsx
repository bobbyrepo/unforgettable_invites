'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles } from 'lucide-react';
import { TemplateMetadata } from '@/config/templates';

interface CatalogCardProps {
  template: TemplateMetadata;
}

export function CatalogCard({ template }: CatalogCardProps) {
  return (
    <div
      className="group rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-light)'
      }}
    >
      <div className="p-6">
        {/* Top Header: Icon + Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl select-none" role="img" aria-label={template.name}>
            {template.icon}
          </span>
          <span className="px-2.5 py-1 rounded-full text-2xs font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400">
            {template.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black tracking-tight mb-2" style={{ color: 'var(--text-dark)' }}>
          {template.name}
        </h3>

        {/* Description */}
        <p className="text-xs font-medium leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
          {template.description}
        </p>

        {/* Specs Pill List */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl border mb-6 text-center"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-light)'
          }}
        >
          {template.specs.map((spec, i) => (
            <div key={i}>
              <div className="text-2xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {spec.key}
              </div>
              <div className="text-xs font-extrabold truncate" style={{ color: 'var(--text-dark)' }}>
                {spec.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer: Live Demo Link */}
      <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
        <div className="text-2xs font-bold" style={{ color: 'var(--text-muted)' }}>
          Default: {template.defaultCouple.groom} & {template.defaultCouple.bride}
        </div>

        <Link
          href={template.demoPath}
          target="_blank"
          className="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs no-underline hover:opacity-90"
          style={{
            backgroundColor: 'var(--primary-action)',
            color: 'var(--primary-action-text)'
          }}
        >
          <span>Launch Demo</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
