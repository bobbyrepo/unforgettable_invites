/**
 * ============================================================================
 * UNFORGETTABLE INVITES — TEMPLATE 08 DYNAMIC CONTENT MANAGER
 * ============================================================================
 * Automatically loads content.json and synchronizes all content across every
 * breakpoint (Desktop, Tablet, Mobile) in Framer's original index.html.
 * 
 * Features:
 * - Single source of truth: content.json
 * - Updates multiple instances of Groom Name, Bride Name, Parents, Dates, etc.
 * - Updates Timeline Cards (Events 1 to 6) in proper chronological deck order
 * - Real-time Countdown Timer computed from weddingDateISO
 * - Dynamic WhatsApp RSVP deep-linking
 * - MutationObserver to withstand Framer React hydration and responsive resize
 * - Background Live Polling: Auto-updates webpage live when content.json is saved
 * - Offline / file:/// fallback support via window.WEDDING_CONTENT
 * ============================================================================
 */

(function () {
    'use strict';

    let lastJsonRaw = '';
    let activeContent = null;
    let countdownInterval = null;
    let isApplying = false;

    // Helper: Safely update text without breaking Framer layouts or firing infinite loops
    function safeUpdateText(selector, newText) {
        if (newText === undefined || newText === null) return;
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
            const ps = container.querySelectorAll('p.framer-text, p');
            if (ps.length > 0) {
                if (ps[0].textContent !== newText) {
                    ps[0].textContent = newText;
                }
                // Hide any stale sibling paragraphs when updating unified text (prevents duplicate overlapping text)
                for (let i = 1; i < ps.length; i++) {
                    ps[i].style.setProperty('display', 'none', 'important');
                }
            } else if (container.textContent !== newText) {
                container.textContent = newText;
            }
        });
    }

    // Helper: Toggle section visibility
    function toggleElements(selectors, isVisible) {
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (isVisible) {
                    el.style.removeProperty('display');
                } else {
                    el.style.setProperty('display', 'none', 'important');
                }
            });
        });
    }

    // Main Applier
    function applyAll(content) {
        if (!content) return;
        isApplying = true;
        activeContent = content;
        window.CONTENT_DATA = content;

        try {
            applyLocationMap(content);
        applyCoupleNames(content);
            applyFamily(content);
            applyTimelineEvents(content);
            applyLogistics(content);
            applyCountdown(content);
            applyWhatsAppRSVP(content);
            applySectionToggles(content);
            applyGallery(content);
            applyMetadata(content);
        } catch (err) {
            console.error('[ContentManager] Error applying content:', err);
        } finally {
            setTimeout(() => { isApplying = false; }, 50);
        }
    }

    // 1. Couple Names & Connectors (across Hero, Invitation, Title, etc.)
    
    function applyLocationMap(content) {
        try {
            const venue = content.venue || {};
            const venueName = venue.name || (content.events && content.events[0] && content.events[0].venueName) || "The Greens Lawn & Banquet";
            const venueAddress = venue.address || (content.events && content.events[0] && content.events[0].venueAddress) || "Kamptee Rd, Khairy, Nagpur";
            const mapUrl = venue.mapUrl || "https://maps.app.goo.gl/RgQCQpsYKtC8RMEFA";

            const maps = document.querySelectorAll('[data-framer-name="Location Map"]');
            maps.forEach(mapContainer => {
                // Set container height auto on mobile
                if (window.innerWidth < 768) {
                    mapContainer.style.setProperty('height', 'auto', 'important');
                }

                // 1. Update Open in Google Maps link
                const mapLinks = mapContainer.querySelectorAll('a');
                mapLinks.forEach(a => {
                    if (a.textContent.includes('Google Maps') || (a.getAttribute('href') && a.getAttribute('href').includes('maps'))) {
                        a.setAttribute('href', mapUrl);
                    }
                });

                // 2. Update Venue Title & Subtext in the address card
                const allDivs = mapContainer.querySelectorAll('div');
                allDivs.forEach(div => {
                    const text = div.textContent.trim();
                    if (div.style.fontSize === '18px' || div.style.fontWeight === '700' || text.includes('Mahabodhi') || text.includes('Greens')) {
                        if (!div.querySelector('div') && text !== venueName) {
                            div.textContent = venueName;
                        }
                    }
                    if ((div.style.fontSize === '14px' && (div.style.opacity === '0.8' || div.style.opacity === '.8')) || text.includes('geomatrix') || text.includes('Bodh Gaya Road')) {
                        if (!div.querySelector('div') && text !== venueAddress) {
                            div.textContent = venueAddress;
                        }
                    }
                });

                // 3. Remove location buttons
                const buttonGrids = mapContainer.querySelectorAll('div[style*="display:grid"], div[style*="grid-template-columns"]');
                buttonGrids.forEach(g => g.remove());
                const buttons = mapContainer.querySelectorAll('button');
                buttons.forEach(btn => {
                    const btnText = btn.textContent.trim().toLowerCase();
                    if (btnText.startsWith('location')) {
                        const parentCol = btn.closest('div[style*="display:flex"]');
                        if (parentCol && parentCol !== mapContainer && parentCol.parentElement === mapContainer) {
                            btn.remove();
                        } else {
                            btn.remove();
                        }
                    }
                });
            });
        } catch (e) {
            console.error('[ContentManager] Error in applyLocationMap:', e);
        }
    }

    function applyCoupleNames(content) {
        const couple = content.couple || {};
        const groom = couple.groom || {};
        const bride = couple.bride || {};

        const groomName = typeof groom === 'object' ? (groom.name || groom.fullName || '') : groom;
        const brideName = typeof bride === 'object' ? (bride.name || bride.fullName || '') : bride;
        const connector = couple.connector || 'weds';

        // Groom Names across all breakpoints & sections
        if (groomName) {
            safeUpdateText('[data-framer-name="Hero Title — Siddharth"]', groomName);
            safeUpdateText('[data-framer-name="Groom Name — Siddharth"]', groomName);
            safeUpdateText('[data-framer-name="GROOM NAME"]', groomName);
            safeUpdateText('[data-framer-name*="Groom Name"]', groomName);
        }

        // Bride Names across all breakpoints & sections
        if (brideName) {
            safeUpdateText('[data-framer-name="Hero Title — Maya"]', brideName);
            safeUpdateText('[data-framer-name="Bride Name — Maya"]', brideName);
            safeUpdateText('[data-framer-name="BRIDE NAME"]', brideName);
            safeUpdateText('[data-framer-name*="Bride Name"]', brideName);
        }

        // Connector (Hero: "weds", Ampersand: "&" or "weds")
        if (connector) {
            safeUpdateText('[data-framer-name="Hero Title — and"]', connector);
            safeUpdateText('[data-framer-name="Ampersand — and"]', connector === 'weds' ? '&' : connector);
        }

        // Document Title
        if (brideName && groomName) {
            document.title = `${brideName} & ${groomName} | Wedding Invitation`;
        }
    }

    // 2. Family Parents & Invitation Lines
    function applyFamily(content) {
        const couple = content.couple || {};
        const groom = couple.groom || {};
        const bride = couple.bride || {};

        const groomParents = (typeof groom === 'object' ? groom.parents : '') || (content.family && content.family.groomParents) || '';
        const brideParents = (typeof bride === 'object' ? bride.parents : '') || (content.family && content.family.brideParents) || '';
        const greetingNote = couple.greetingNote || (content.family && content.family.invitationLine) || '';

        if (groomParents) {
            safeUpdateText('[data-framer-name="Groom Parents"]', groomParents);
            safeUpdateText('[data-framer-name="GROOM FAMILY"]', groomParents);
            safeUpdateText('[data-framer-name*="Groom Parents"]', groomParents);
        }

        if (brideParents) {
            safeUpdateText('[data-framer-name="Bride Parents"]', brideParents);
            safeUpdateText('[data-framer-name="BRIDE FAMILY"]', brideParents);
            safeUpdateText('[data-framer-name*="Bride Parents"]', brideParents);
        }

        if (greetingNote) {
            safeUpdateText('[data-framer-name="Invitation Line"]', greetingNote);
        }
    }

    // 3. Timeline Cards (Events 1 to 6)
    // Chronological order: Event 0 -> Card 1, Event 1 -> Card 2, Event 2 -> Card 3, etc.
    function applyTimelineEvents(content) {
        const events = content.events || [];
        if (!Array.isArray(events) || events.length === 0) return;

        events.forEach((ev, idx) => {
            const cardNum = idx + 1;
            if (cardNum > 6) return;

            const cards = document.querySelectorAll(`[data-framer-name="${cardNum}"]`);
            cards.forEach(card => {
                const paragraphs = Array.from(card.querySelectorAll('p.framer-text, p'));
                if (paragraphs.length >= 6) {
                    // Tag parents with semantic slots for bulletproof styling
                    if (paragraphs[0] && paragraphs[0].parentElement) paragraphs[0].parentElement.setAttribute('data-card-slot', 'more-details');
                    if (paragraphs[1] && paragraphs[1].parentElement) paragraphs[1].parentElement.setAttribute('data-card-slot', 'time');
                    if (paragraphs[2] && paragraphs[2].parentElement) paragraphs[2].parentElement.setAttribute('data-card-slot', 'venue');
                    if (paragraphs[3] && paragraphs[3].parentElement) paragraphs[3].parentElement.setAttribute('data-card-slot', 'date');
                    if (paragraphs[4] && paragraphs[4].parentElement) paragraphs[4].parentElement.setAttribute('data-card-slot', 'day');
                    if (paragraphs[5] && paragraphs[5].parentElement) paragraphs[5].parentElement.setAttribute('data-card-slot', 'title');

                    // paragraphs[0] = "More details below"
                    // paragraphs[1] = Time
                    // paragraphs[2] = Venue / Location
                    // paragraphs[3] = Date
                    // paragraphs[4] = Day
                    // paragraphs[5] = Title
                    if (ev.time && paragraphs[1].textContent !== ev.time) {
                        paragraphs[1].textContent = ev.time;
                    }
                    const fullVenue = [ev.venueName, ev.venueAddress].filter(Boolean).join(', ') || ev.venue || '';
                    if (fullVenue && paragraphs[2].textContent !== fullVenue) {
                        paragraphs[2].textContent = fullVenue;
                    }
                    if (ev.date && paragraphs[3].textContent !== ev.date) {
                        paragraphs[3].textContent = ev.date;
                    }
                    if (ev.day && paragraphs[4].textContent !== ev.day) {
                        paragraphs[4].textContent = ev.day;
                    }
                    if (ev.title && paragraphs[5].textContent !== ev.title) {
                        paragraphs[5].textContent = ev.title;
                    }
                }
            });
        });
    }

    // 4. Logistics & "Things to Know" (Hashtag, Weather, Parking, Dress Code)
    function applyLogistics(content) {
        const logistics = content.logistics || {};
        const couple = content.couple || {};

        // Hashtag
        const hashtag = couple.hashtag || (logistics && logistics.hashtag);
        if (hashtag) {
            safeUpdateText('[data-framer-name="Hashtag Title"]', 'Hashtag');
            const hashtagContainers = document.querySelectorAll('[data-framer-name="Hashtag Description"]');
            hashtagContainers.forEach(container => {
                const p = container.querySelector('p.framer-text') || container.querySelector('p') || container;
                if (p) {
                    const newText = `While posting photos on social media please use the hashtag - ${hashtag}`;
                    if (p.textContent !== newText) {
                        p.textContent = newText;
                    }
                }
            });
        }

        // Weather
        if (logistics.weather) {
            safeUpdateText('[data-framer-name="Weather Description"]', logistics.weather);
        }

        // Valet Parking
        if (logistics.valetParking) {
            safeUpdateText('[data-framer-name="Parking Description"]', logistics.valetParking);
        }

        // Dress Code / Staff Hotel
        const attireOrStaff = logistics.dressCode || logistics.hotel || logistics.staff;
        if (attireOrStaff) {
            safeUpdateText('[data-framer-name="Staff Title"]', logistics.dressCode ? 'Attire & Theme' : 'Staff');
            safeUpdateText('[data-framer-name="Staff Description"]', attireOrStaff);
        }
    }

    // 5. Countdown Timer (Dynamic Real-Time Calculation)
    function applyCountdown(content) {
        const iso = content.weddingDateISO || '2026-08-29T10:30:00';
        const targetDate = new Date(iso);
        if (isNaN(targetDate.getTime())) return;

        function updateDigits() {
            const diff = targetDate.getTime() - Date.now();
            const safeDiff = Math.max(0, diff);

            const days = Math.floor(safeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((safeDiff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((safeDiff / (1000 * 60)) % 60);
            const seconds = Math.floor((safeDiff / 1000) % 60);

            const pad2 = n => String(n).padStart(2, '0');
            const units = [pad2(days), pad2(hours), pad2(minutes), pad2(seconds)];

            document.querySelectorAll('[data-framer-name="Countdown Timer"]').forEach(timer => {
                const columns = timer.querySelectorAll(':scope > div > div');
                columns.forEach((col, colIdx) => {
                    if (colIdx < units.length) {
                        const val = units[colIdx];
                        const spans = col.querySelectorAll('span');
                        if (spans.length >= 2) {
                            if (val.length === 2) {
                                if (spans[0].textContent !== val[0]) spans[0].textContent = val[0];
                                if (spans[1].textContent !== val[1]) spans[1].textContent = val[1];
                            } else if (val.length > 2) {
                                const firstPart = val.slice(0, -1);
                                const lastDigit = val.slice(-1);
                                if (spans[0].textContent !== firstPart) spans[0].textContent = firstPart;
                                if (spans[1].textContent !== lastDigit) spans[1].textContent = lastDigit;
                            }
                        }
                    }
                });
            });
        }

        updateDigits();
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(updateDigits, 1000);
    }

    // 6. WhatsApp RSVP Integration
    function applyWhatsAppRSVP(content) {
        const logistics = content.logistics || {};
        const couple = content.couple || {};
        const contactNum = logistics.contactNumber || logistics.whatsappRsvp || content.whatsappRsvp;
        if (!contactNum) return;

        const cleanNum = contactNum.replace(/\D/g, '');
        const bride = (couple.bride && couple.bride.name) || couple.bride || 'Bride';
        const groom = (couple.groom && couple.groom.name) || couple.groom || 'Groom';
        const msg = encodeURIComponent(`Hi ${bride} & ${groom}! I would love to RSVP for your wedding celebrations.`);
        const waUrl = `https://wa.me/${cleanNum}?text=${msg}`;

        const rsvpButtons = document.querySelectorAll(
            '[data-framer-name="RSVP Form"] a, [data-framer-name="RSVP Form"] button, [data-framer-name="CTA - RSVP"] a, [data-framer-name="CTA - RSVP"] button'
        );
        rsvpButtons.forEach(btn => {
            if (btn.tagName === 'A') {
                btn.setAttribute('href', waUrl);
                btn.setAttribute('target', '_blank');
            } else {
                btn.onclick = () => window.open(waUrl, '_blank');
            }
        });
    }

    // 7. Section Toggles
    
    // 8. Rotating Photo Gallery Collage
    function applyGallery(content) {
        const gallery = content.gallery;
        if (!Array.isArray(gallery) || gallery.length === 0) return;
        const collage = document.querySelector('[data-framer-name="Photo Gallery"]');
        if (!collage) return;
        const imgs = collage.querySelectorAll('img');
        imgs.forEach((img, idx) => {
            const target = gallery[idx % gallery.length];
            if (img.getAttribute('src') !== target) {
                img.setAttribute('src', target);
                img.src = target;
            }
        });
    }

    function applySectionToggles(content) {
        const toggles = content.toggles || {};

        // RSVP Toggle
        if (toggles.enableRSVP === false || toggles.rsvp === false) {
            toggleElements(['[data-framer-name="RSVP Form"]', '[data-framer-name="RSVP"]'], false);
        } else if (toggles.enableRSVP === true || toggles.rsvp === true) {
            toggleElements(['[data-framer-name="RSVP Form"]', '[data-framer-name="RSVP"]'], true);
        }

        // Things to Know Toggle
        if (toggles.enableThingsToKnow === false) {
            toggleElements(['[data-framer-name="4 — Location &amp; Countdown"] [data-framer-name*="Item"]'], false);
        }

        // Audio Toggle
        if (toggles.enableAudio === false) {
            const player = document.getElementById('buddhist-audio-controller');
            if (player) player.style.setProperty('display', 'none', 'important');
        }
    }

    // 8. OpenGraph & Meta Tags
    function applyMetadata(content) {
        const couple = content.couple || {};
        const bride = (couple.bride && couple.bride.name) || couple.bride || '';
        const groom = (couple.groom && couple.groom.name) || couple.groom || '';
        if (bride && groom) {
            const fullTitle = `Mahabodhi Buddhist Wedding | ${groom} & ${bride} 🪷☸️`;
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) ogTitle.setAttribute('content', fullTitle);
            const twTitle = document.querySelector('meta[name="twitter:title"]');
            if (twTitle) twTitle.setAttribute('content', fullTitle);
        }
    }

    // -------------------------------------------------------------------------
    // FETCH & LOAD PIPELINE
    // -------------------------------------------------------------------------
    async function loadContent() {
        try {
            const res = await fetch('./content.json?_ts=' + Date.now(), { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const rawText = await res.text();
            if (rawText !== lastJsonRaw) {
                lastJsonRaw = rawText;
                const data = JSON.parse(rawText);
                console.log('[ContentManager] Loaded content.json successfully');
                applyAll(data);
            }
        } catch (err) {
            // Fallback for file:/// protocol or offline usage
            if (!activeContent && window.WEDDING_CONTENT) {
                console.warn('[ContentManager] Using fallback window.WEDDING_CONTENT:', err.message);
                applyAll(window.WEDDING_CONTENT);
            }
        }
    }

    // -------------------------------------------------------------------------
    // LIVE WATCHER / BACKGROUND POLLING (Every 1.5 seconds)
    // Updates website automatically when content.json is saved on disk
    // -------------------------------------------------------------------------
    function startLiveWatcher() {
        setInterval(async () => {
            try {
                const res = await fetch('./content.json?_poll=' + Date.now(), { cache: 'no-store' });
                if (res.ok) {
                    const rawText = await res.text();
                    if (rawText && rawText !== lastJsonRaw) {
                        console.log('⚡ [ContentManager] Detected changes in content.json! Auto-updating website...');
                        lastJsonRaw = rawText;
                        const updated = JSON.parse(rawText);
                        applyAll(updated);
                    }
                }
            } catch (e) {
                // Ignore transient network errors during local editing
            }
        }, 1500);
    }

    // -------------------------------------------------------------------------
    // DOM RESILIENCE: MutationObserver & Lifecycle Hooks
    // -------------------------------------------------------------------------
    function setupResilience() {
        // Observe DOM mutations to prevent Framer React hydration from reverting text
        const observer = new MutationObserver(() => {
            if (!isApplying && activeContent) {
                applyAll(activeContent);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Sync on viewport resize (desktop <-> tablet <-> mobile breakpoint switch)
        window.addEventListener('resize', () => {
            if (activeContent) applyAll(activeContent);
        }, { passive: true });

        window.addEventListener('orientationchange', () => {
            if (activeContent) applyAll(activeContent);
        }, { passive: true });

        // Staggered post-hydration safety syncs
        setTimeout(() => { if (activeContent) applyAll(activeContent); }, 300);
        setTimeout(() => { if (activeContent) applyAll(activeContent); }, 800);
        setTimeout(() => { if (activeContent) applyAll(activeContent); }, 1800);
        setTimeout(() => { if (activeContent) applyAll(activeContent); }, 3000);
    }

    // Initialize
    async function init() {
        await loadContent();
        setupResilience();
        startLiveWatcher();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', () => {
        if (activeContent) applyAll(activeContent);
    });

    // Expose global controller for debugging or programmatic manipulation
    window.ContentManager = {
        reload: loadContent,
        apply: applyAll,
        get: () => activeContent
    };
})();
