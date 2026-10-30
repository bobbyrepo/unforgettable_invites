'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { TemplateId, LifecycleStatus, WeddingInviteData } from '@/data/types';
import { MASTER_TEMPLATES } from '@/config/templates';
import { autoGenerateSlug } from '@/lib/slug-engine';

interface InviteModalProps {
  isOpen: boolean;
  editingInvite: WeddingInviteData | null;
  onClose: () => void;
  onSave: (payload: any) => Promise<{ success: boolean; error?: string }>;
}

export function InviteModal({ isOpen, editingInvite, onClose, onSave }: InviteModalProps) {
  const [formGroom, setFormGroom] = useState('');
  const [formBride, setFormBride] = useState('');
  const [formGroomParents, setFormGroomParents] = useState('');
  const [formBrideParents, setFormBrideParents] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formTemplateId, setFormTemplateId] = useState<TemplateId>('08_unforgettable_buddhist_wedding');
  const [formStatus, setFormStatus] = useState<LifecycleStatus>('UPCOMING');
  const [formDate, setFormDate] = useState('29th Aug 2026');
  const [formDay, setFormDay] = useState('Friday');
  const [formTime, setFormTime] = useState('6:00 PM Onwards');
  const [formVenue, setFormVenue] = useState('The Grand Palace');
  const [formCity, setFormCity] = useState('Pune, Maharashtra');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingInvite) {
      setFormGroom(editingInvite.couple?.groom?.name || '');
      setFormBride(editingInvite.couple?.bride?.name || '');
      setFormGroomParents(editingInvite.couple?.groom?.parents || '');
      setFormBrideParents(editingInvite.couple?.bride?.parents || '');
      setFormSlug(editingInvite.slug || '');
      setFormTemplateId(editingInvite.templateId);
      setFormStatus(editingInvite.lifecycleStatus);
      setFormDate(editingInvite.events[0]?.date || '29th Aug 2026');
      setFormDay(editingInvite.events[0]?.day || 'Friday');
      setFormTime(editingInvite.events[0]?.time || '6:00 PM Onwards');
      setFormVenue(editingInvite.events[0]?.venueName || 'The Grand Palace');
      setFormCity(editingInvite.events[0]?.venueAddress || 'Pune, Maharashtra');
    } else {
      setFormGroom('');
      setFormBride('');
      setFormGroomParents('Shri & Smt. Sharma');
      setFormBrideParents('Shri & Smt. Patel');
      setFormSlug('');
      setFormTemplateId('08_unforgettable_buddhist_wedding');
      setFormStatus('UPCOMING');
      setFormDate('29th Aug 2026');
      setFormDay('Friday');
      setFormTime('6:00 PM Onwards');
      setFormVenue('The Grand Palace');
      setFormCity('Pune, Maharashtra');
    }
    setErrorMessage(null);
  }, [editingInvite, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanGroom = formGroom.trim();
    const cleanBride = formBride.trim();
    const cleanSlugVal = formSlug.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (!cleanGroom || !cleanBride || !cleanSlugVal) {
      setErrorMessage('Please fill in Groom name, Bride name, and URL slug.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        id: editingInvite?.id || undefined,
        slug: cleanSlugVal,
        templateId: formTemplateId,
        lifecycleStatus: formStatus,
        weddingDateISO: editingInvite?.weddingDateISO || new Date().toISOString(),
        couple: {
          groom: {
            name: cleanGroom,
            parents: formGroomParents.trim() || 'Parents of the Groom',
          },
          bride: {
            name: cleanBride,
            parents: formBrideParents.trim() || 'Parents of the Bride',
          },
          connector: 'weds',
          monogram: `${cleanGroom[0]} & ${cleanBride[0]}`,
          hashtag: `#${cleanGroom.split(' ')[0]}Weds${cleanBride.split(' ')[0]}`,
          greetingNote: 'Together with their families, cordially invite you to celebrate',
        },
        events: [
          {
            id: editingInvite?.events[0]?.id || `ev-1-${Date.now()}`,
            title: 'Holy Wedding Ceremony',
            date: formDate.trim() || '29th Aug 2026',
            day: formDay.trim() || 'Friday',
            time: formTime.trim() || '6:00 PM Onwards',
            venueName: formVenue.trim() || 'The Grand Palace',
            venueAddress: formCity.trim() || 'Pune, Maharashtra',
            mapDeepLink: 'https://maps.google.com',
            dressCode: 'Royal Traditional Wedding Attire',
          },
        ],
        audio: editingInvite?.audio || {
          title: 'Sacred Flute',
          fileSrc: '/templates/08_unforgettable_buddhist_wedding/audio/mjZh3ISr0YDK01kdBZisCq18TDo.mp3',
          autoUnlockOnFirstTouch: true,
        },
        logistics: editingInvite?.logistics || {
          dressCode: 'Royal Pastels / Traditional Formal',
          valetParking: 'Available at North Gateway',
        },
        toggles: editingInvite?.toggles || {
          enableMusic: true,
          enableDressCode: true,
          enableValet: true,
          enableWeather: true,
          enableShloka: true,
          enableMaps: true,
        },
      };

      const result = await onSave(payload);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to save invitation.');
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg rounded-2xl border p-6 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
      >
        <div className="flex items-center justify-between pb-4 border-b mb-5" style={{ borderColor: 'var(--border-light)' }}>
          <h3 className="text-base font-extrabold" style={{ color: 'var(--text-dark)' }}>
            {editingInvite ? 'Edit Wedding Invite' : 'Create New Wedding Invite'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:opacity-70 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs flex items-center gap-2 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Groom Name *</label>
              <input
                type="text"
                required
                value={formGroom}
                onChange={(e) => {
                  setFormGroom(e.target.value);
                  if (!editingInvite && !formSlug) {
                    const auto = autoGenerateSlug(e.target.value, formBride);
                    if (auto) setFormSlug(auto);
                  }
                }}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Bride Name *</label>
              <input
                type="text"
                required
                value={formBride}
                onChange={(e) => {
                  setFormBride(e.target.value);
                  if (!editingInvite && !formSlug) {
                    const auto = autoGenerateSlug(formGroom, e.target.value);
                    if (auto) setFormSlug(auto);
                  }
                }}
                placeholder="e.g. Saisha Patel"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Groom Parents</label>
              <input
                type="text"
                value={formGroomParents}
                onChange={(e) => setFormGroomParents(e.target.value)}
                placeholder="e.g. Shri & Smt. Sharma"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Bride Parents</label>
              <input
                type="text"
                value={formBrideParents}
                onChange={(e) => setFormBrideParents(e.target.value)}
                placeholder="e.g. Shri & Smt. Patel"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>
              Royal Clean Slug (URL) *
            </label>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)' }}>
              <span className="font-mono text-xs select-none" style={{ color: 'var(--text-muted)' }}>unforgettableinvites.com/</span>
              <input
                type="text"
                required
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                placeholder="e.g. aarav-saisha"
                className="w-full bg-transparent outline-none font-bold font-mono text-xs"
                style={{ color: 'var(--text-dark)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Wedding Template</label>
            <select
              value={formTemplateId}
              onChange={(e) => setFormTemplateId(e.target.value as TemplateId)}
              className="w-full px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer"
              style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            >
              {MASTER_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.tag})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Wedding Date</label>
              <input
                type="text"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                placeholder="e.g. 29th Aug 2026"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Day of Week</label>
              <input
                type="text"
                value={formDay}
                onChange={(e) => setFormDay(e.target.value)}
                placeholder="e.g. Friday"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Time</label>
              <input
                type="text"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                placeholder="e.g. 6:00 PM Onwards"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Lifecycle Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as LifecycleStatus)}
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              >
                <option value="UPCOMING">UPCOMING (Countdown & Active)</option>
                <option value="WEDDING_DAY">WEDDING_DAY (Day-Of Navigation)</option>
                <option value="ARCHIVED">ARCHIVED (Photo Memories Album)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>Venue Name</label>
              <input
                type="text"
                value={formVenue}
                onChange={(e) => setFormVenue(e.target.value)}
                placeholder="e.g. The Grand Palace"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-dark)' }}>City, State</label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="e.g. Pune, Maharashtra"
                className="w-full px-3 py-2 rounded-xl text-xs border outline-none"
                style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end gap-2.5" style={{ borderColor: 'var(--border-light)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: 'var(--primary-action)', color: 'var(--primary-action-text)' }}
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingInvite ? 'Save Changes' : 'Create Invitation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
