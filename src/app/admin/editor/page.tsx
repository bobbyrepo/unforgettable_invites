'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Check, Sparkles, Calendar, MapPin, Music, 
  Camera, Users, Shield, Plus, Trash2, Upload, ExternalLink, 
  Heart, Clock, Phone, Car, CloudSun, Eye, AlertCircle, Loader2,
  Settings, ChevronRight, Share2, Info
} from 'lucide-react';
import { TemplateId, LifecycleStatus, WeddingInviteData, WeddingEvent } from '@/data/types';
import { MASTER_TEMPLATES } from '@/config/templates';
import { TEMPLATE_SCHEMAS } from '@/config/template-schemas';
import { autoGenerateSlug, cleanSlug } from '@/lib/slug-engine';
import { useTheme } from '@/hooks/useTheme';

type TabKey = 'template' | 'couple' | 'events' | 'blessing' | 'photos' | 'logistics' | 'toggles';

const TABS: { id: TabKey; label: string; icon: any; desc: string }[] = [
  { id: 'template', label: 'Theme & Style', icon: Sparkles, desc: 'Choose 1 of 8 luxury themes' },
  { id: 'couple', label: 'Couple & Date', icon: Heart, desc: 'Names, parents & clean royal URL' },
  { id: 'events', label: 'Ceremony Schedule', icon: Calendar, desc: 'Multi-event itinerary & venues' },
  { id: 'blessing', label: 'Blessings & Story', icon: Info, desc: 'Authentic deity shlokas & story' },
  { id: 'photos', label: 'Photos & Music', icon: Camera, desc: 'Hero portraits & audio soundtrack' },
  { id: 'logistics', label: 'Things to Know', icon: Car, desc: 'Weather, valet, staff & hashtags' },
  { id: 'toggles', label: 'Feature Toggles', icon: Settings, desc: 'RSVP, audio, maps & widgets' },
];

function InviteEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('template');
  const [isLoading, setIsLoading] = useState(!!editId);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form State
  const [templateId, setTemplateId] = useState<TemplateId>('07_unforgettable_ram_mandir');
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

  // Toggles (RSVP disabled by default)
  const [enableRSVP, setEnableRSVP] = useState(false);
  const [enableMusic, setEnableMusic] = useState(true);
  const [enableValet, setEnableValet] = useState(true);
  const [enableWeather, setEnableWeather] = useState(true);
  const [enableShloka, setEnableShloka] = useState(true);
  const [enableMaps, setEnableMaps] = useState(true);

  // Apply template defaults
  const applyTemplateDefaults = (tId: TemplateId, preserveNames = false) => {
    const schema = TEMPLATE_SCHEMAS[tId] || TEMPLATE_SCHEMAS['07_unforgettable_ram_mandir'];
    
    if (!preserveNames) {
      setGroomName(schema.defaultCouple.groom);
      setBrideName(schema.defaultCouple.bride);
      setGroomParents(schema.defaultCouple.groomParents);
      setBrideParents(schema.defaultCouple.brideParents);
      setMonogram(schema.defaultCouple.monogram);
      setHashtag(schema.defaultCouple.hashtag);
      setGreetingNote(schema.defaultCouple.greetingNote);
      setSlug(autoGenerateSlug(schema.defaultCouple.groom, schema.defaultCouple.bride));
    }
    
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

    if (!weddingDateISO) {
      setWeddingDateISO(new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().slice(0, 16));
    }
  };

  // Initial load
  useEffect(() => {
    async function loadData() {
      if (editId) {
        try {
          setIsLoading(true);
          const res = await fetch('/api/invites', { cache: 'no-store' });
          if (res.ok) {
            const list: WeddingInviteData[] = await res.json();
            const target = list.find((item) => item.id === editId || item.slug === editId);
            if (target) {
              setTemplateId(target.templateId);
              setGroomName(target.couple?.groom?.name || '');
              setBrideName(target.couple?.bride?.name || '');
              setGroomParents(target.couple?.groom?.parents || '');
              setBrideParents(target.couple?.bride?.parents || '');
              setMonogram(target.couple?.monogram || '');
              setHashtag(target.couple?.hashtag || '');
              setGreetingNote(target.couple?.greetingNote || '');
              setSlug(target.slug || '');
              setStatus(target.lifecycleStatus || 'UPCOMING');
              setWeddingDateISO(target.weddingDateISO ? target.weddingDateISO.slice(0, 16) : '');

              setShlokaDeity(target.shloka?.deity || '');
              setShlokaSanskrit(target.shloka?.verseSanskrit || '');
              setShlokaEnglish(target.shloka?.verseEnglish || '');
              setShlokaTranslation(target.shloka?.translation || '');

              setEvents(target.events && target.events.length > 0 ? target.events : []);

              setWeather(target.logistics?.weather || '');
              setValetParking(target.logistics?.valetParking || '');
              setContactName(target.logistics?.contactName || '');
              setContactNumber(target.logistics?.contactNumber || '');
              setDressCode(target.logistics?.dressCode || '');
              setAccommodation(target.logistics?.accommodation || '');

              setHeroPhoto(target.thumbnailUrl || '');
              setAudioTitle(target.audio?.title || '');
              setAudioFileSrc(target.audio?.fileSrc || '');

              setEnableMusic(target.toggles?.enableMusic ?? true);
              setEnableValet(target.toggles?.enableValet ?? true);
              setEnableWeather(target.toggles?.enableWeather ?? true);
              setEnableShloka(target.toggles?.enableShloka ?? true);
              setEnableMaps(target.toggles?.enableMaps ?? true);
              setEnableRSVP(false); // RSVP disabled by default
            } else {
              applyTemplateDefaults('07_unforgettable_ram_mandir');
            }
          }
        } catch (e) {
          applyTemplateDefaults('07_unforgettable_ram_mandir');
        } finally {
          setIsLoading(false);
        }
      } else {
        applyTemplateDefaults('07_unforgettable_ram_mandir');
        setIsLoading(false);
      }
    }
    loadData();
  }, [editId]);

  // Handle template selection
  const handleSelectTemplate = (id: TemplateId) => {
    setTemplateId(id);
    const hasNames = Boolean(groomName && brideName);
    applyTemplateDefaults(id, hasNames);
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

  // Event handlers
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

  // Submit Handler
  const handleSave = async () => {
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
        id: editId || undefined,
        slug: cleanS,
        templateId,
        lifecycleStatus: status,
        weddingDateISO: weddingDateISO ? new Date(weddingDateISO).toISOString() : new Date().toISOString(),
        couple: {
          groom: {
            name: cleanG,
            parents: groomParents,
          },
          bride: {
            name: cleanB,
            parents: brideParents,
          },
          connector: 'weds',
          monogram: monogram || `${cleanG[0] || 'A'} & ${cleanB[0] || 'S'}`,
          hashtag: hashtag || `#${cleanG.split(' ')[0]}Weds${cleanB.split(' ')[0]}`,
          greetingNote: greetingNote || 'Together with their families, cordially invite you to celebrate',
        },
        shloka: {
          deity: shlokaDeity,
          verseSanskrit: shlokaSanskrit,
          verseEnglish: shlokaEnglish,
          translation: shlokaTranslation,
        },
        events,
        audio: {
          title: audioTitle || 'Sacred Wedding Soundtrack',
          fileSrc: audioFileSrc || '/templates/08_unforgettable_buddhist_wedding/audio/mjZh3ISr0YDK01kdBZisCq18TDo.mp3',
          autoUnlockOnFirstTouch: true,
        },
        logistics: {
          weather,
          valetParking,
          contactName,
          contactNumber,
          dressCode,
          accommodation,
        },
        toggles: {
          enableRSVP,
          enableMusic,
          enableValet,
          enableWeather,
          enableShloka,
          enableMaps,
        },
        thumbnailUrl: heroPhoto || '/templates/08_unforgettable_buddhist_wedding/images/Left Flag.webp',
      };

      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to save invite.');
      }

      setSuccessToast(`Invitation saved live at /${cleanS}!`);
      setTimeout(() => {
        router.push('/admin');
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving invite.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentTemplate = MASTER_TEMPLATES.find((t) => t.id === templateId) || MASTER_TEMPLATES[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
        <p className="text-sm font-medium text-slate-400">Loading Invitation Studio...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-dark)' }}
    >
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Fixed Command Bar */}
      <header 
        className="sticky top-0 z-40 px-6 py-3.5 border-b backdrop-blur-md flex items-center justify-between gap-4 transition-colors"
        style={{
          backgroundColor: theme === 'dark' ? 'rgba(18, 21, 31, 0.92)' : 'rgba(255, 255, 255, 0.92)',
          borderColor: 'var(--border-light)'
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl border transition hover:opacity-80 flex items-center justify-center no-underline"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-dark)'
            }}
            title="Back to Command Center"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                {editId ? 'Edit Mode' : 'New Invitation'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-400">{currentTemplate.name}</span>
            </div>
            <h1 className="text-base font-extrabold tracking-tight">
              {groomName && brideName ? `${groomName} & ${brideName}` : 'Customization Studio'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {slug && (
            <Link
              href={`/${cleanSlug(slug)}`}
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition no-underline hover:opacity-80"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-dark)'
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live (/{cleanSlug(slug)})</span>
            </Link>
          )}

          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition no-underline hover:opacity-80 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-light)',
            }}
          >
            Discard
          </Link>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            }}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body: 2-Column Split Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Studio Sidebar: Tabs & Template Quick-Switch */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Navigation Tabs Card */}
          <div 
            className="rounded-2xl border p-3 space-y-1.5 shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
          >
            <div className="px-3 py-2 text-2xs font-extrabold uppercase tracking-widest text-slate-400">
              Studio Configuration
            </div>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-3 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-500 text-white' : 'bg-black/5 dark:bg-white/10'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs">{tab.label}</div>
                      <div className="text-2xs text-slate-400 opacity-80">{tab.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-amber-500' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Live Preview Card */}
          <div 
            className="rounded-2xl border p-5 space-y-4 shadow-sm"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">Live Client Card</span>
              <span className="px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {status}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-extrabold">
                {groomName || 'Groom'} & {brideName || 'Bride'}
              </h3>
              <p className="text-xs font-mono text-amber-600 dark:text-amber-400">
                /{cleanSlug(slug) || 'client-slug'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{currentTemplate.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{events.length} Planned Ceremonies</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-3.5 h-3.5" />
                <span className="truncate">{audioTitle || 'Default Audio Soundtrack'}</span>
              </div>
            </div>

            {slug && (
              <a
                href={`/${cleanSlug(slug)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center block transition no-underline border hover:brightness-105"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-dark)'
                }}
              >
                Test Fullscreen Invite ↗
              </a>
            )}
          </div>
        </aside>

        {/* Right Main Editor Panel */}
        <main className="lg:col-span-8">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div 
            className="rounded-2xl border p-6 sm:p-8 shadow-sm space-y-8"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
          >
            {/* 1. TEMPLATE SELECTOR TAB */}
            {activeTab === 'template' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold">Choose Architectural Template</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select one of the 8 signature heritage themes. Switching templates dynamically updates the default shlokas, ceremonies, and design palette.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MASTER_TEMPLATES.map((tmpl) => {
                    const isSelected = tmpl.id === templateId;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition relative group ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-500/5'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-2xs font-extrabold uppercase tracking-wider text-amber-500">
                          {tmpl.category}
                        </span>
                        <h4 className="text-sm font-extrabold mt-1">{tmpl.name}</h4>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{tmpl.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. COUPLE & DATE TAB */}
            {activeTab === 'couple' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold">Couple & Clean Royal URL</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Names appear prominently across hero titles, countdown badges, and WhatsApp sharing cards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Groom Full Name *</label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => {
                        setGroomName(e.target.value);
                        if (!editId) setSlug(autoGenerateSlug(e.target.value, brideName));
                      }}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Bride Full Name *</label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => {
                        setBrideName(e.target.value);
                        if (!editId) setSlug(autoGenerateSlug(groomName, e.target.value));
                      }}
                      placeholder="e.g. Saisha Patel"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Groom's Parents</label>
                    <input
                      type="text"
                      value={groomParents}
                      onChange={(e) => setGroomParents(e.target.value)}
                      placeholder="e.g. Mr. Rajesh & Mrs. Sunita Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Bride's Parents</label>
                    <input
                      type="text"
                      value={brideParents}
                      onChange={(e) => setBrideParents(e.target.value)}
                      placeholder="e.g. Mr. Vikram & Mrs. Meera Patel"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Custom Royal Slug *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-sm text-slate-400 font-mono">/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(cleanSlug(e.target.value))}
                        placeholder="aarav-saisha"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Wedding Date & Countdown</label>
                    <input
                      type="datetime-local"
                      value={weddingDateISO}
                      onChange={(e) => setWeddingDateISO(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Monogram Emblem</label>
                    <input
                      type="text"
                      value={monogram}
                      onChange={(e) => setMonogram(e.target.value)}
                      placeholder="A & S"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Lifecycle Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as LifecycleStatus)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="LIVE_TODAY">LIVE TODAY</option>
                      <option value="CONCLUDED">CONCLUDED</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CEREMONY SCHEDULE TAB */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold">Ceremonies & Itinerary</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure multiple wedding celebrations with date, time, venue, and Google Maps deep-links.
                    </p>
                  </div>

                  <button
                    onClick={handleAddEvent}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Ceremony</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {events.map((ev, idx) => (
                    <div
                      key={ev.id || idx}
                      className="p-4 sm:p-5 rounded-xl border space-y-4 relative"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">
                          Ceremony #{idx + 1}
                        </span>
                        {events.length > 1 && (
                          <button
                            onClick={() => handleDeleteEvent(idx)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                            title="Delete Ceremony"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Ceremony Name</label>
                          <input
                            type="text"
                            value={ev.title}
                            onChange={(e) => handleUpdateEvent(idx, 'title', e.target.value)}
                            placeholder="e.g. Holy Vivah Ceremony"
                            className="w-full px-3.5 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                          />
                        </div>

                        <div>
                          <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Date & Day</label>
                          <input
                            type="text"
                            value={ev.date}
                            onChange={(e) => handleUpdateEvent(idx, 'date', e.target.value)}
                            placeholder="e.g. 29th August 2026, Friday"
                            className="w-full px-3.5 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Time</label>
                          <input
                            type="text"
                            value={ev.time}
                            onChange={(e) => handleUpdateEvent(idx, 'time', e.target.value)}
                            placeholder="e.g. 6:00 PM Onwards"
                            className="w-full px-3.5 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                          />
                        </div>

                        <div>
                          <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Venue Name</label>
                          <input
                            type="text"
                            value={ev.venueName}
                            onChange={(e) => handleUpdateEvent(idx, 'venueName', e.target.value)}
                            placeholder="e.g. The Grand Palace"
                            className="w-full px-3.5 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Venue Address / City</label>
                          <input
                            type="text"
                            value={ev.venueAddress}
                            onChange={(e) => handleUpdateEvent(idx, 'venueAddress', e.target.value)}
                            placeholder="e.g. Pune, Maharashtra"
                            className="w-full px-3.5 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                          />
                        </div>

                        <div>
                          <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Google Maps Deep Link</label>
                          <input
                            type="text"
                            value={ev.mapDeepLink}
                            onChange={(e) => handleUpdateEvent(idx, 'mapDeepLink', e.target.value)}
                            placeholder="https://maps.app.goo.gl/..."
                            className="w-full px-3.5 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. BLESSINGS & STORY TAB */}
            {activeTab === 'blessing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold">Sacred Blessings & Shlokas</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Authentic spiritual verses customized to the chosen template tradition.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Deity / Blessing Title</label>
                    <input
                      type="text"
                      value={shlokaDeity}
                      onChange={(e) => setShlokaDeity(e.target.value)}
                      placeholder="e.g. Vedic Vivah Blessings"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Sanskrit Verse (Devanagari)</label>
                    <textarea
                      rows={2}
                      value={shlokaSanskrit}
                      onChange={(e) => setShlokaSanskrit(e.target.value)}
                      placeholder="मांगल्यं तन्तुनानेन..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-serif"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">English Transliteration</label>
                    <textarea
                      rows={2}
                      value={shlokaEnglish}
                      onChange={(e) => setShlokaEnglish(e.target.value)}
                      placeholder="Mangalyam tantunanena mama jivanahetuna..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-serif italic"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Spiritual Translation / Meaning</label>
                    <textarea
                      rows={2}
                      value={shlokaTranslation}
                      onChange={(e) => setShlokaTranslation(e.target.value)}
                      placeholder="May this sacred union be blessed with eternal love..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Welcome Note / Couple's Story</label>
                    <textarea
                      rows={3}
                      value={greetingNote}
                      onChange={(e) => setGreetingNote(e.target.value)}
                      placeholder="Together with their families, cordially invite you..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. PHOTOS & MUSIC TAB */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold">Portraits & Musical Soundtrack</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload couple photographs directly to Cloudflare R2 object storage.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Hero Photo Slot */}
                  <div className="p-4 rounded-xl border text-center space-y-3" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <span className="text-2xs font-extrabold uppercase text-slate-400">Hero Cover</span>
                    <div className="h-32 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-dashed border-slate-300 dark:border-slate-700">
                      {heroPhoto ? (
                        <img src={heroPhoto} alt="Hero" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <label className="block">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold border transition block cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                        {isUploading === 'hero' ? 'Uploading...' : 'Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('hero', e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* Groom Portrait Slot */}
                  <div className="p-4 rounded-xl border text-center space-y-3" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <span className="text-2xs font-extrabold uppercase text-slate-400">Groom Portrait</span>
                    <div className="h-32 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-dashed border-slate-300 dark:border-slate-700">
                      {groomPhoto ? (
                        <img src={groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <label className="block">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold border transition block cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                        {isUploading === 'groom' ? 'Uploading...' : 'Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('groom', e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* Bride Portrait Slot */}
                  <div className="p-4 rounded-xl border text-center space-y-3" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <span className="text-2xs font-extrabold uppercase text-slate-400">Bride Portrait</span>
                    <div className="h-32 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-dashed border-slate-300 dark:border-slate-700">
                      {bridePhoto ? (
                        <img src={bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <label className="block">
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold border transition block cursor-pointer hover:bg-black/5 dark:hover:bg-white/5">
                        {isUploading === 'bride' ? 'Uploading...' : 'Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('bride', e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4" style={{ borderColor: 'var(--border-light)' }}>
                  <h3 className="text-sm font-extrabold">Background Audio Soundtrack</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Track Title</label>
                      <input
                        type="text"
                        value={audioTitle}
                        onChange={(e) => setAudioTitle(e.target.value)}
                        placeholder="Sacred Flute Melody"
                        className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-2xs font-bold uppercase text-slate-400 mb-1">Audio URL / Path</label>
                      <input
                        type="text"
                        value={audioFileSrc}
                        onChange={(e) => setAudioFileSrc(e.target.value)}
                        placeholder="/templates/08_unforgettable_buddhist_wedding/audio/..."
                        className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                        style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. THINGS TO KNOW & LOGISTICS TAB */}
            {activeTab === 'logistics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold">Things to Know & Guest Logistics</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Provide guests with weather, parking, staff contacts, and dress code recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Wedding Hashtag</label>
                    <input
                      type="text"
                      value={hashtag}
                      onChange={(e) => setHashtag(e.target.value)}
                      placeholder="#AaravWedsSaisha"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Weather Forecast Note</label>
                    <input
                      type="text"
                      value={weather}
                      onChange={(e) => setWeather(e.target.value)}
                      placeholder="Pleasant evening (22°C - 26°C)"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Valet & Parking Details</label>
                    <input
                      type="text"
                      value={valetParking}
                      onChange={(e) => setValetParking(e.target.value)}
                      placeholder="Complimentary valet at Main Portico"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Suggested Dress Code</label>
                    <input
                      type="text"
                      value={dressCode}
                      onChange={(e) => setDressCode(e.target.value)}
                      placeholder="Royal Pastels / Traditional Formal"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Hospitality / Staff Contact</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Hospitality Desk"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Contact Number</label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 98200 12345"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">Guest Accommodation Note</label>
                  <textarea
                    rows={2}
                    value={accommodation}
                    onChange={(e) => setAccommodation(e.target.value)}
                    placeholder="Rooms reserved for guests at The Heritage Resort..."
                    className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}
                  />
                </div>
              </div>
            )}

            {/* 7. FEATURE TOGGLES TAB */}
            {activeTab === 'toggles' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold">Interactive Feature Toggles</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enable or disable specific invitation components and floating widgets.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* RSVP Option (Disabled by default as requested) */}
                  <label className="p-4 rounded-xl border flex items-center justify-between cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <div>
                      <div className="text-sm font-bold flex items-center gap-2">
                        <span>RSVP Confirmation Module</span>
                        <span className="px-2 py-0.5 rounded-full text-2xs font-extrabold bg-slate-500/20 text-slate-500">Disabled by Default</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Allow guests to submit attendance count and dietary preferences.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableRSVP}
                      onChange={(e) => setEnableRSVP(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Background Music */}
                  <label className="p-4 rounded-xl border flex items-center justify-between cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <div>
                      <div className="text-sm font-bold">Auto Background Music Player</div>
                      <p className="text-xs text-slate-400 mt-0.5">Plays temple flute on first user tap with floating music toggle.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableMusic}
                      onChange={(e) => setEnableMusic(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Valet Parking Card */}
                  <label className="p-4 rounded-xl border flex items-center justify-between cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <div>
                      <div className="text-sm font-bold">Valet & Parking Logistics Card</div>
                      <p className="text-xs text-slate-400 mt-0.5">Display valet arrival instructions on invitation footer.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableValet}
                      onChange={(e) => setEnableValet(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Weather Forecast */}
                  <label className="p-4 rounded-xl border flex items-center justify-between cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <div>
                      <div className="text-sm font-bold">Live Weather Forecast Card</div>
                      <p className="text-xs text-slate-400 mt-0.5">Shows temperature and weather advice for the wedding ceremony day.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableWeather}
                      onChange={(e) => setEnableWeather(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Deity Shloka Section */}
                  <label className="p-4 rounded-xl border flex items-center justify-between cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <div>
                      <div className="text-sm font-bold">Vedic / Deity Shloka Header</div>
                      <p className="text-xs text-slate-400 mt-0.5">Display sacred Devanagari verse and English translation.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableShloka}
                      onChange={(e) => setEnableShloka(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Google Maps Directions */}
                  <label className="p-4 rounded-xl border flex items-center justify-between cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-light)' }}>
                    <div>
                      <div className="text-sm font-bold">Google Maps Navigation Links</div>
                      <p className="text-xs text-slate-400 mt-0.5">Open direct GPS navigation for wedding venues.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableMaps}
                      onChange={(e) => setEnableMaps(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminEditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <InviteEditorContent />
    </Suspense>
  );
}
