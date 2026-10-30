'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import { WeddingInviteData } from '@/data/types';
import { INITIAL_INVITES } from '@/data/invites';
import { MASTER_TEMPLATES } from '@/config/templates';
import { useTheme } from '@/hooks/useTheme';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminInviteCard } from '@/components/admin/AdminInviteCard';
import { InviteModal } from '@/components/admin/InviteModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Toast } from '@/components/ui/Toast';

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();
  const [invites, setInvites] = useState<WeddingInviteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState<WeddingInviteData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WeddingInviteData | null>(null);

  const fetchInvites = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/invites', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setInvites(Array.isArray(data) ? data : []);
      } else {
        setInvites([]);
      }
    } catch (err) {
      console.error('Error fetching invites:', err);
      setInvites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredInvites = invites.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const groom = inv.couple?.groom?.name?.toLowerCase() || '';
    const bride = inv.couple?.bride?.name?.toLowerCase() || '';
    const slug = inv.slug?.toLowerCase() || '';
    const tName = MASTER_TEMPLATES.find((t) => t.id === inv.templateId)?.name.toLowerCase() || '';
    return groom.includes(q) || bride.includes(q) || slug.includes(q) || tName.includes(q);
  });

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const url = `${origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast(`Copied ${url} to clipboard!`);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingInvite(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv: WeddingInviteData) => {
    setEditingInvite(inv);
    setIsModalOpen(true);
  };

  const handleSaveInvite = async (payload: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to save.' };
      }

      await fetchInvites();
      showToast(editingInvite ? 'Wedding invitation updated!' : `Invitation /${payload.slug} created live!`);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const targetId = deleteTarget.id;
      const targetSlug = deleteTarget.slug;
      
      // Optimistic removal from UI
      setInvites((prev) => prev.filter((i) => i.id !== targetId && i.slug !== targetSlug));
      setDeleteTarget(null);

      const res = await fetch(`/api/invites?id=${encodeURIComponent(targetId)}&slug=${encodeURIComponent(targetSlug)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast(`Deleted /${targetSlug}`);
        await fetchInvites();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete.');
        await fetchInvites();
      }
    } catch (err) {
      console.error(err);
      alert('Network error.');
      await fetchInvites();
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-dark)' }}>
      <Toast message={toastMessage} />
      
      <AdminHeader theme={theme} onToggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AdminStats totalInvites={invites.length} />

        {/* SEARCH & ACTIONS */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search couples or slugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border outline-none transition shadow-2xs"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-dark)'
              }}
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: 'var(--primary-action)',
              color: 'var(--primary-action-text)'
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Invite</span>
          </button>
        </section>

        {/* CLIENT INVITES TABLE */}
        <div
          className="rounded-2xl border overflow-hidden shadow-xs"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
        >
          {isLoading ? (
            <div className="p-16 text-center text-xs flex flex-col items-center gap-3" style={{ color: 'var(--text-muted)' }}>
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span>Loading wedding invitations...</span>
            </div>
          ) : filteredInvites.length === 0 ? (
            <div className="p-16 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No wedding invites found matching your search.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
              {filteredInvites.map((inv) => (
                <AdminInviteCard
                  key={inv.id}
                  invite={inv}
                  copiedSlug={copiedSlug}
                  onCopyLink={handleCopyLink}
                  onEdit={handleOpenEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <InviteModal
        isOpen={isModalOpen}
        editingInvite={editingInvite}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvite}
      />

      <DeleteConfirmModal
        invite={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
