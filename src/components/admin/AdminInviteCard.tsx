'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Copy, Check, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { WeddingInviteData } from '@/data/types';
import { MASTER_TEMPLATES } from '@/config/templates';

interface AdminInviteCardProps {
  invite: WeddingInviteData;
  copiedSlug: string | null;
  onCopyLink: (slug: string) => void;
  onEdit: (invite: WeddingInviteData) => void;
  onDelete: (invite: WeddingInviteData) => void;
}

export function AdminInviteCard({
  invite,
  copiedSlug,
  onCopyLink,
  onEdit,
  onDelete,
}: AdminInviteCardProps) {
  const tmpl = MASTER_TEMPLATES.find((t) => t.id === invite.templateId);
  const groomName = invite.couple?.groom?.name || 'Groom';
  const brideName = invite.couple?.bride?.name || 'Bride';
  const initials = (groomName[0] || 'G') + (brideName[0] || 'B');

  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-black/2 dark:hover:bg-white/2">
      {/* Left: Avatar + Names */}
      <div className="flex items-center gap-3.5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-2xs"
          style={{
            backgroundColor: 'var(--brand-accent-bg)',
            color: 'var(--brand-accent)'
          }}
        >
          {initials}
        </div>

        <div>
          <div className="text-sm font-extrabold tracking-tight" style={{ color: 'var(--text-dark)' }}>
            {groomName} & {brideName}
          </div>
          <div className="text-xs font-medium flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            <span className="font-mono text-amber-600 dark:text-amber-400">/{invite.slug}</span>
            <span>•</span>
            <span>{tmpl?.name || invite.templateId}</span>
          </div>
        </div>
      </div>

      {/* Middle: Details */}
      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{invite.events[0]?.date || 'Upcoming'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{invite.events[0]?.venueAddress || 'India'}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {invite.lifecycleStatus}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onCopyLink(invite.slug)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-light)',
            color: 'var(--text-dark)'
          }}
          title="Copy Clean WhatsApp Link"
        >
          {copiedSlug === invite.slug ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSlug === invite.slug ? 'Copied' : 'Share'}</span>
        </button>

        <Link
          href={`/${invite.slug}`}
          target="_blank"
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 no-underline hover:bg-black/5 dark:hover:bg-white/5"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-light)',
            color: 'var(--text-dark)'
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Preview</span>
        </Link>

        <button
          onClick={() => onEdit(invite)}
          className="p-2 rounded-lg text-xs font-semibold border transition hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-light)',
            color: 'var(--text-dark)'
          }}
          title="Edit Details"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(invite)}
          className="p-2 rounded-lg text-xs font-semibold border transition hover:bg-rose-50 text-rose-600 border-rose-200 dark:hover:bg-rose-950 dark:border-rose-900 cursor-pointer"
          title="Delete Invite"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
