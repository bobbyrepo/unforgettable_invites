'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { WeddingInviteData } from '@/data/types';

interface DeleteConfirmModalProps {
  invite: WeddingInviteData | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ invite, onCancel, onConfirm }: DeleteConfirmModalProps) {
  if (!invite) return null;

  const groomName = invite.couple?.groom?.name || 'Groom';
  const brideName = invite.couple?.bride?.name || 'Bride';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-sm rounded-2xl border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
      >
        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3 dark:bg-rose-950 dark:text-rose-400">
          <Trash2 className="w-5 h-5" />
        </div>

        <h3 className="text-sm font-extrabold mb-1" style={{ color: 'var(--text-dark)' }}>
          Delete Invitation?
        </h3>
        <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
          Are you sure you want to permanently delete the wedding invitation for <strong style={{ color: 'var(--text-dark)' }}>{groomName} & {brideName}</strong> (<span className="font-mono text-rose-500">/{invite.slug}</span>)? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
