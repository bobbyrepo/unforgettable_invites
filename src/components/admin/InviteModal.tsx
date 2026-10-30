'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, AlertCircle, Loader2, Sparkles, Calendar, MapPin, 
  Music, Camera, Users, Shield, Plus, Trash2, Upload, 
  Check, ExternalLink, Heart, Clock, Phone, Car, CloudSun 
} from 'lucide-react';
import { TemplateId, LifecycleStatus, WeddingInviteData, WeddingEvent } from '@/data/types';
import { MASTER_TEMPLATES } from '@/config/templates';
import { TEMPLATE_SCHEMAS, TemplateFieldSchema } from '@/config/template-schemas';
import { autoGenerateSlug, cleanSlug } from '@/lib/slug-engine';

interface InviteModalProps {
  isOpen: boolean;
  editingInvite: WeddingInviteData | null;
  onClose: () => void;
  onSave: (payload: any) => Promise<{ success: boolean; error?: string }>;
}

type TabKey = 'couple' | 'events' | 'blessing' | 'photos' | 'logistics' | 'toggles';

export function InviteModal({ isOpen, editingInvite, onClose, onSave }: InviteModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('couple');
  const [templateId, setTemplateId] = useState<TemplateId>('07_unforgettable_ram_mandir');

  // Form State
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [monogram, setMonogram] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<LifecycleStatus>('UPCOMING');
  const [weddingDateISO, setWeddingDateISO] = useState('');

  // Story & Blessing
  const [greetingNote, setGreetingNote] = useState('');
  const [shlokaDeity, setShlokaDeity] = useState('');
  const [shlokaSanskrit, setShlokaSanskrit] = useState('');
  const [shlokaEnglish, setShlokaEnglish] = useState('');
  const [shlokaTranslation, setShlokaTranslation] = useState('');

  // Events List
  const [events, setEvents] = useState<WeddingEvent[]>([]);

  // Logistics & Things to Know
  const [hashtag, setHashtag] = useState('');
  const [weather, setWeather] = useState('');
  const [valetParking, setValetParking] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [accommodation, setAccommodation] = useState('');

  // Photos & Media
  const [heroPhoto, setHeroPhoto] = useState('');
  const [groomPhoto, setGroomPhoto] = useState('');
  const [bridePhoto, setBridePhoto] = useState('');
  const [audioTitle, setAudioTitle] = useState('');
  const [audioFileSrc, setAudioFileSrc] = useState('');

  // Toggles (RSVP disabled by default as requested)
  const [enableRSVP, setEnableRSVP] = useState(false);
  const [enableMusic, setEnableMusic] = useState(true);
  const [enableValet, setEnableValet] = useState(true);
  const [enableWeather, setEnableWeather] = useState(true);
  const [enableShloka, setEnableShloka] = useState(true);
  const [enableMaps, setEnableMaps] = useState(true);

  // Status & Upload indicators
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Schema Defaults for a specific template
  const applyTemplateDefaults = (tId: TemplateId) => {
    const schema = TEMPLATE_SCHEMAS[tId] || TEMPLATE_SCHEMAS['07_unforgettable_ram_mandir'];
    setGroomName(schema.defaultCouple.groom);
    setBrideName(schema.defaultCouple.bride);
    setGroomParents(schema.defaultCouple.groomParents);
    setBrideParents(schema.defaultCouple.brideParents);
    setMonogram(schema.defaultCouple.monogram);
    setHashtag(schema.defaultCouple.hashtag);
    setGreetingNote(schema.defaultCouple.greetingNote);
    
    setShlokaDeity(schema.defaultShloka.deity);
    setShlokaSanskrit(schema.defaultShloka.verseSanskrit);
    setShlokaEnglish(schema.defaultShloka.verseEnglish);
    setShlokaTranslation(schema.defaultShloka.translation);

    setEvents(schema.defaultEvents.map((e, i) => ({ ...e, id: `ev-${i + 1}-${Date.now()}` })));

    setWeather(schema.defaultLogistics.weather);
    setValetParking(schema.defaultLogistics.valetParking);
    setContactName(schema.defaultLogistics.contactName);
    setContactNumber(schema.defaultLogistics.contactNumber);
    setDressCode(schema.defaultLogistics.dressCode);
    setAccommodation(schema.defaultLogistics.accommodation);

    setHeroPhoto(schema.imageSlots[0]?.defaultUrl || '');
    setGroomPhoto(schema.imageSlots[1]?.defaultUrl || '');
    setBridePhoto(schema.imageSlots[2]?.defaultUrl || '');

    setAudioTitle(schema.defaultAudio.title);
    setAudioFileSrc(schema.defaultAudio.fileSrc);

    setSlug(autoGenerateSlug(schema.defaultCouple.groom, schema.defaultCouple.bride));
    setWeddingDateISO(new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().slice(0, 16));
  };

  // Initialize or reset form on open
  useEffect(() => {
    if (!isOpen) return;

    if (editingInvite) {
      setTemplateId(editingInvite.templateId);
      setGroomName(editingInvite.couple?.groom?.name || '');
      setBrideName(editingInvite.couple?.bride?.name || '');
      setGroomParents(editingInvite.couple?.groom?.parents || '');
      setBrideParents(editingInvite.couple?.bride?.parents || '');
      setMonogram(editingInvite.couple?.monogram || '');
      setHashtag(editingInvite.couple?.hashtag || '');
      setGreetingNote(editingInvite.couple?.greetingNote || '');
      setSlug(editingInvite.slug || '');
      setStatus(editingInvite.lifecycleStatus || 'UPCOMING');
      setWeddingDateISO(editingInvite.weddingDateISO ? editingInvite.weddingDateISO.slice(0, 16) : '');

      setShlokaDeity(editingInvite.shloka?.deity || '');
      setShlokaSanskrit(editingInvite.shloka?.verseSanskrit || '');
      setShlokaEnglish(editingInvite.shloka?.verseEnglish || '');
      setShlokaTranslation(editingInvite.shloka?.translation || '');

      setEvents(editingInvite.events && editingInvite.events.length > 0 ? editingInvite.events : []);

      setWeather(editingInvite.logistics?.weather || '');
      setValetParking(editingInvite.logistics?.valetParking || '');
      setContactName(editingInvite.logistics?.contactName || '');
      setContactNumber(editingInvite.logistics?.contactNumber || '');
      setDressCode(editingInvite.logistics?.dressCode || '');
      setAccommodation(editingInvite.logistics?.accommodation || '');

      setHeroPhoto(editingInvite.thumbnailUrl || '');
      setAudioTitle(editingInvite.audio?.title || '');
      setAudioFileSrc(editingInvite.audio?.fileSrc || '');

      setEnableMusic(editingInvite.toggles?.enableMusic ?? true);
      setEnableValet(editingInvite.toggles?.enableValet ?? true);
      setEnableWeather(editingInvite.toggles?.enableWeather ?? true);
      setEnableShloka(editingInvite.toggles?.enableShloka ?? true);
      setEnableMaps(editingInvite.toggles?.enableMaps ?? true);
      setEnableRSVP(false); // RSVP disabled by default
    } else {
      applyTemplateDefaults('07_unforgettable_ram_mandir');
      setTemplateId('07_unforgettable_ram_mandir');
    }

    setErrorMessage(null);
    setActiveTab('couple');
  }, [editingInvite, isOpen]);

  // Handle Template Switching during creation
  const handleTemplateChange = (newTId: TemplateId) => {
    setTemplateId(newTId);
    if (!editingInvite) {
      applyTemplateDefaults(newTId);
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (slotKey: string, file: File) => {
    try {
      setIsUploading(slotKey);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `templates/${templateId}/custom`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to upload photo.');
        return;
      }

      if (slotKey === 'hero') setHeroPhoto(data.url);
      else if (slotKey === 'groom') setGroomPhoto(data.url);
      else if (slotKey === 'bride') setBridePhoto(data.url);
    } catch (err: any) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setIsUploading(null);
    }
  };

  // Event list operations
  const handleAddEvent = () => {
    const newEv: WeddingEvent = {
      id: `ev-${Date.now()}`,
      title: 'Grand Reception Soiree',
      date: '30th Nov 2026',
      day: 'Saturday',
      time: '7:00 PM Onwards',
      venueName: 'The Grand Palace',
      venueAddress: 'Jaipur, Rajasthan',
      mapDeepLink: 'https://maps.google.com',
      dressCode: 'Royal Formal / Black Tie',
    };
    setEvents([...events, newEv]);
  };

  const handleUpdateEvent = (idx: number, field: keyof WeddingEvent, value: string) => {
    const updated = [...events];
    updated[idx] = { ...updated[idx], [field]: value };
    setEvents(updated);
  };

  const handleDeleteEvent = (idx: number) => {
    setEvents(events.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanG = groomName.trim();
    const cleanB = brideName.trim();
    const cleanS = cleanSlug(slug);

    if (!cleanG || !cleanB || !cleanS) {
      setErrorMessage('Groom name, Bride name, and URL slug are mandatory.');
      setActiveTab('couple');
      return;
    }

    try {
      setIsSaving(true);

      const payload: Partial<WeddingInviteData> = {
        id: editingInvite?.id || undefined,
        slug: cleanS,
        templateId,
        lifecycleStatus: status,
        weddingDateISO: weddingDateISO ? new Date(weddingDateISO).toISOString() : new Date().toISOString(),
        couple: {
          groom: {
            name: cleanG,
            parents: groomParents.trim() || 'Parents of the Groom',
          },
          bride: {
            name: cleanB,
            parents: brideParents.trim() || 'Parents of the Bride',
          },
          connector: 'weds',
          monogram: monogram.trim() || `${cleanG[0]} & ${cleanB[0]}`,
          hashtag: hashtag.trim() || `#${cleanG.split(' ')[0]}Weds${cleanB.split(' ')[0]}`,
          greetingNote: greetingNote.trim() || 'Together with their families, cordially invite you to celebrate',
        },
        shloka: {
          deity: shlokaDeity.trim() || 'Vedic Blessings',
          verseSanskrit: shlokaSanskrit.trim(),
          verseEnglish: shlokaEnglish.trim(),
          translation: shlokaTranslation.trim(),
        },
        events,
        audio: {
          title: audioTitle.trim() || 'Sacred Melody',
          fileSrc: audioFileSrc.trim() || '/templates/08_unforgettable_buddhist_wedding/audio/mjZh3ISr0YDK01kdBZisCq18TDo.mp3',
          autoUnlockOnFirstTouch: true,
        },
        logistics: {
          weather: weather.trim(),
          valetParking: valetParking.trim(),
          contactName: contactName.trim(),
          contactNumber: contactNumber.trim(),
          dressCode: dressCode.trim(),
          accommodation: accommodation.trim(),
        },
        toggles: {
          enableMusic,
          enableValet,
          enableWeather,
          enableShloka,
          enableMaps,
        },
        thumbnailUrl: heroPhoto || '/templates/08_unforgettable_buddhist_wedding/images/Left Flag.webp',
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

  if (!isOpen) return null;

  const currentSchema = TEMPLATE_SCHEMAS[templateId] || TEMPLATE_SCHEMAS['07_unforgettable_ram_mandir'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentSchema.icon}</span>
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {editingInvite ? 'Edit Wedding Invitation' : 'Create Bespoke Wedding Invite'}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Template: <strong className="text-amber-500 font-semibold">{currentSchema.name}</strong> • {currentSchema.themeTag}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 rounded-xl border transition-colors hover:opacity-75 cursor-pointer"
            style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector Bar (Horizontal Carousel) */}
        <div className="px-6 py-3 border-b bg-black/5 overflow-x-auto" style={{ borderColor: 'var(--border-light)' }}>
          <div className="text-2xs font-extrabold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Choose Master Architectural Theme:
          </div>
          <div className="flex items-center gap-2 pb-1">
            {MASTER_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === templateId;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-amber-500 shadow-sm scale-102' : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--primary-action)' : 'var(--bg-card)',
                    color: isSelected ? 'var(--primary-action-text)' : 'var(--text-dark)',
                    borderColor: isSelected ? 'transparent' : 'var(--border-light)',
                  }}
                >
                  <span>{tmpl.icon}</span>
                  <span>{tmpl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b overflow-x-auto px-6" style={{ borderColor: 'var(--border-light)' }}>
          {[
            { key: 'couple', label: 'Couple & URL', icon: Heart },
            { key: 'events', label: `Events (${events.length})`, icon: Calendar },
            { key: 'blessing', label: 'Shloka & Message', icon: Sparkles },
            { key: 'photos', label: 'Photos & Music', icon: Camera },
            { key: 'logistics', label: 'Things to Know', icon: Car },
            { key: 'toggles', label: 'Feature Toggles', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? 'border-amber-500 text-amber-500' : 'border-transparent hover:text-amber-400'
                }`}
                style={{ color: isActive ? 'var(--primary-action)' : 'var(--text-muted)' }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: COUPLE & URL SLUG */}
          {activeTab === 'couple' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Groom Name *</label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => {
                      setGroomName(e.target.value);
                      if (!editingInvite) setSlug(autoGenerateSlug(e.target.value, brideName));
                    }}
                    placeholder="e.g. Akash Mehra"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Bride Name *</label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => {
                      setBrideName(e.target.value);
                      if (!editingInvite) setSlug(autoGenerateSlug(groomName, e.target.value));
                    }}
                    placeholder="e.g. Drashti Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Groom's Parents</label>
                  <input
                    type="text"
                    value={groomParents}
                    onChange={(e) => setGroomParents(e.target.value)}
                    placeholder="e.g. Smt. & Shri Vikram Mehra"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Bride's Parents</label>
                  <input
                    type="text"
                    value={brideParents}
                    onChange={(e) => setBrideParents(e.target.value)}
                    placeholder="e.g. Smt. & Shri Alok Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Royal Monogram</label>
                  <input
                    type="text"
                    value={monogram}
                    onChange={(e) => setMonogram(e.target.value)}
                    placeholder="e.g. A & D"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Countdown Date & Time</label>
                  <input
                    type="datetime-local"
                    value={weddingDateISO}
                    onChange={(e) => setWeddingDateISO(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LifecycleStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  >
                    <option value="UPCOMING">Upcoming Wedding</option>
                    <option value="WEDDING_DAY">Wedding Day Live</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              {/* Public URL Slug */}
              <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
                <label className="block text-xs font-bold">Public Invitation URL Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-3 py-2.5 rounded-xl bg-black/10 shrink-0 select-none">
                    https://yourdomain.com/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(cleanSlug(e.target.value))}
                    placeholder="e.g. akash-drashti"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>
                <p className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                  This creates a clean, direct royal wedding link without query parameters.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS & TIMELINE */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold">Wedding Itinerary & Ceremonies</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Add multiple ceremonies (Mehndi, Haldi, Sangeet, Shaadi, Reception).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEvent}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition hover:opacity-80 cursor-pointer shadow-2xs"
                  style={{ backgroundColor: 'var(--primary-action)', color: 'var(--primary-action-text)', borderColor: 'transparent' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ceremony</span>
                </button>
              </div>

              {events.map((ev, idx) => (
                <div 
                  key={ev.id || idx} 
                  className="p-4 rounded-xl border space-y-3 relative transition-all"
                  style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">
                      Ceremony #{idx + 1}
                    </span>
                    {events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(idx)}
                        className="text-red-400 hover:text-red-500 p-1 rounded-lg transition"
                        title="Delete Ceremony"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-bold mb-1">Ceremony Title</label>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => handleUpdateEvent(idx, 'title', e.target.value)}
                        placeholder="e.g. Vedic Vivah Sanskar"
                        className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-hidden"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold mb-1">Date & Day</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={ev.date}
                          onChange={(e) => handleUpdateEvent(idx, 'date', e.target.value)}
                          placeholder="e.g. 20th Nov 2026"
                          className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-hidden"
                          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                        />
                        <input
                          type="text"
                          value={ev.day}
                          onChange={(e) => handleUpdateEvent(idx, 'day', e.target.value)}
                          placeholder="e.g. Friday"
                          className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-hidden"
                          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-2xs font-bold mb-1">Timing</label>
                      <input
                        type="text"
                        value={ev.time}
                        onChange={(e) => handleUpdateEvent(idx, 'time', e.target.value)}
                        placeholder="e.g. 6:00 PM Onwards"
                        className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-hidden"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={ev.venueName}
                        onChange={(e) => handleUpdateEvent(idx, 'venueName', e.target.value)}
                        placeholder="e.g. Rambagh Mandir Mandap"
                        className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-hidden"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold mb-1">City / Location</label>
                      <input
                        type="text"
                        value={ev.venueAddress}
                        onChange={(e) => handleUpdateEvent(idx, 'venueAddress', e.target.value)}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-hidden"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-2xs font-bold mb-1">Google Maps Deep Link</label>
                      <input
                        type="text"
                        value={ev.mapDeepLink || ''}
                        onChange={(e) => handleUpdateEvent(idx, 'mapDeepLink', e.target.value)}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-hidden"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-bold mb-1">Ceremony Dress Code</label>
                      <input
                        type="text"
                        value={ev.dressCode || ''}
                        onChange={(e) => handleUpdateEvent(idx, 'dressCode', e.target.value)}
                        placeholder="e.g. Traditional Festive (Maroon & Gold)"
                        className="w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-hidden"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SHLOKA & PERSONAL MESSAGE */}
          {activeTab === 'blessing' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">Meet the Couple / Personal Story / Welcome Message</label>
                <textarea
                  rows={3}
                  value={greetingNote}
                  onChange={(e) => setGreetingNote(e.target.value)}
                  placeholder="Personal welcome message or story..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                  style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                />
              </div>

              <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                    Sacred Divine Blessing / Shloka
                  </h4>
                  <input
                    type="text"
                    value={shlokaDeity}
                    onChange={(e) => setShlokaDeity(e.target.value)}
                    placeholder="Deity (e.g. Lord Rama)"
                    className="px-3 py-1 text-xs rounded-lg border font-semibold"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold mb-1">Sanskrit Verse (Devanagari)</label>
                  <textarea
                    rows={2}
                    value={shlokaSanskrit}
                    onChange={(e) => setShlokaSanskrit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm font-medium focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold mb-1">English Transliteration</label>
                  <input
                    type="text"
                    value={shlokaEnglish}
                    onChange={(e) => setShlokaEnglish(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold mb-1">English Translation & Blessing Meaning</label>
                  <textarea
                    rows={2}
                    value={shlokaTranslation}
                    onChange={(e) => setShlokaTranslation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTOS & MUSIC */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Hero Photo Slot */}
                <div className="p-4 rounded-xl border flex flex-col items-center text-center space-y-3" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
                  <span className="text-xs font-bold">Hero / Cover Photo</span>
                  {heroPhoto ? (
                    <img src={heroPhoto} alt="Hero" className="w-24 h-24 object-cover rounded-xl border shadow-xs" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl border border-dashed flex items-center justify-center text-xs opacity-50">
                      No Photo
                    </div>
                  )}
                  <label className="w-full px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-80" style={{ backgroundColor: 'var(--primary-action)', color: 'var(--primary-action-text)' }}>
                    {isUploading === 'hero' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploading === 'hero' ? 'Uploading...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('hero', e.target.files[0])} />
                  </label>
                  <input
                    type="text"
                    value={heroPhoto}
                    onChange={(e) => setHeroPhoto(e.target.value)}
                    placeholder="or paste image URL"
                    className="w-full px-2.5 py-1.5 rounded-lg border text-2xs font-mono focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>

                {/* Groom Solo Photo */}
                <div className="p-4 rounded-xl border flex flex-col items-center text-center space-y-3" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
                  <span className="text-xs font-bold">Meet the Groom Photo</span>
                  {groomPhoto ? (
                    <img src={groomPhoto} alt="Groom" className="w-24 h-24 object-cover rounded-xl border shadow-xs" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl border border-dashed flex items-center justify-center text-xs opacity-50">
                      No Photo
                    </div>
                  )}
                  <label className="w-full px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-80" style={{ backgroundColor: 'var(--primary-action)', color: 'var(--primary-action-text)' }}>
                    {isUploading === 'groom' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploading === 'groom' ? 'Uploading...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('groom', e.target.files[0])} />
                  </label>
                  <input
                    type="text"
                    value={groomPhoto}
                    onChange={(e) => setGroomPhoto(e.target.value)}
                    placeholder="or paste image URL"
                    className="w-full px-2.5 py-1.5 rounded-lg border text-2xs font-mono focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>

                {/* Bride Solo Photo */}
                <div className="p-4 rounded-xl border flex flex-col items-center text-center space-y-3" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
                  <span className="text-xs font-bold">Meet the Bride Photo</span>
                  {bridePhoto ? (
                    <img src={bridePhoto} alt="Bride" className="w-24 h-24 object-cover rounded-xl border shadow-xs" />
                  ) : (
                    <div className="w-24 h-24 rounded-xl border border-dashed flex items-center justify-center text-xs opacity-50">
                      No Photo
                    </div>
                  )}
                  <label className="w-full px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-80" style={{ backgroundColor: 'var(--primary-action)', color: 'var(--primary-action-text)' }}>
                    {isUploading === 'bride' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{isUploading === 'bride' ? 'Uploading...' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload('bride', e.target.files[0])} />
                  </label>
                  <input
                    type="text"
                    value={bridePhoto}
                    onChange={(e) => setBridePhoto(e.target.value)}
                    placeholder="or paste image URL"
                    className="w-full px-2.5 py-1.5 rounded-lg border text-2xs font-mono focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                  />
                </div>
              </div>

              {/* Background Music */}
              <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span>Auspicious Background Audio</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-2xs font-bold mb-1">Track Title</label>
                    <input
                      type="text"
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      placeholder="e.g. Deva Shree Ganesha Shehnai"
                      className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-hidden"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold mb-1">Audio File Path / CDN URL</label>
                    <input
                      type="text"
                      value={audioFileSrc}
                      onChange={(e) => setAudioFileSrc(e.target.value)}
                      placeholder="/templates/07_unforgettable_ram_mandir/audio/..."
                      className="w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-hidden"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THINGS TO KNOW & LOGISTICS */}
          {activeTab === 'logistics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Wedding Hashtag</label>
                  <input
                    type="text"
                    value={hashtag}
                    onChange={(e) => setHashtag(e.target.value)}
                    placeholder="e.g. #AkashKiDrashti"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Weather Advisory</label>
                  <input
                    type="text"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    placeholder="e.g. Crisp November Evening (18°C - 22°C)"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Valet Parking & Gate Instructions</label>
                <textarea
                  rows={2}
                  value={valetParking}
                  onChange={(e) => setValetParking(e.target.value)}
                  placeholder="e.g. Complimentary valet parking available at Royal Porch Entrance Gate..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                  style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Hospitality / Staff Contact Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Vikram Mehra (Guest Support)"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Staff Phone Number</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +91 99110 54321"
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-hidden"
                    style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Accommodations & Hotel Stay</label>
                <textarea
                  rows={2}
                  value={accommodation}
                  onChange={(e) => setAccommodation(e.target.value)}
                  placeholder="e.g. Heritage suites reserved for outstation guests at the palace..."
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                  style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">General Dress Code Advisory</label>
                <input
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="e.g. Regal Traditional / Heritage Silks & Sherwanis"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-hidden"
                  style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
                />
              </div>
            </div>
          )}

          {/* TAB 6: FEATURE TOGGLES */}
          {activeTab === 'toggles' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Interactive Features & Modular Cards
                </h4>

                {/* RSVP Toggle (Disabled by default) */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-2">
                      <span>RSVP Registration Form</span>
                      <span className="text-2xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 font-semibold">
                        Disabled for now
                      </span>
                    </div>
                    <div className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                      Allows guests to submit attendance, diet preferences, and companion counts.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableRSVP}
                    onChange={(e) => setEnableRSVP(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>

                {/* Music Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  <div>
                    <div className="text-xs font-bold">Auto Background Music Player</div>
                    <div className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                      Unlocks sacred devotional flute/shehnai music on guest's first interaction.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableMusic}
                    onChange={(e) => setEnableMusic(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>

                {/* Valet Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  <div>
                    <div className="text-xs font-bold">Valet Parking Card</div>
                    <div className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                      Displays parking gate instructions and drop-off guidance.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableValet}
                    onChange={(e) => setEnableValet(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>

                {/* Weather Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  <div>
                    <div className="text-xs font-bold">Live Weather Card</div>
                    <div className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                      Advises guests on expected temperature and attire comfort.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableWeather}
                    onChange={(e) => setEnableWeather(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>

                {/* Shloka Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  <div>
                    <div className="text-xs font-bold">Sacred Shloka Blessing Card</div>
                    <div className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                      Renders the divine Sanskrit verses and English meaning.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableShloka}
                    onChange={(e) => setEnableShloka(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>

                {/* Maps Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}>
                  <div>
                    <div className="text-xs font-bold">Google Maps Navigation Links</div>
                    <div className="text-2xs" style={{ color: 'var(--text-muted)' }}>
                      One-click driving directions to the wedding venues.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableMaps}
                    onChange={(e) => setEnableMaps(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t flex items-center justify-between gap-3" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-xs text-amber-500 font-medium">
              * All fields are dynamically tailored for {currentSchema.name}.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl border text-xs font-bold transition hover:opacity-75 cursor-pointer"
                style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-light)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 shadow-xs hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: 'var(--primary-action)', color: 'var(--primary-action-text)', borderColor: 'transparent' }}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{isSaving ? 'Saving...' : editingInvite ? 'Save Changes' : 'Create Invitation Live'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
