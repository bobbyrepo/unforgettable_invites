// ==========================================================================
// UNFORGETTABLE INVITES — UNIVERSAL CLIENT & SECTION TOGGLE MANAGER
// Works across all 8 templates (01 through 08).
// Safely syncs couple names, parents, ceremonies, custom logos, photos,
// and enforces granular section toggles (RSVP, Valet, Attire, Music, etc.)
// ==========================================================================

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const clientSlug = urlParams.get('client');

    // Auto-hide the internal demo switcher whenever viewing a client invite
    if (clientSlug || urlParams.get('demo') === '0' || window.__IS_CLIENT_PROD__) {
        const switcher = document.getElementById('unified-template-switcher');
        if (switcher) switcher.style.setProperty('display', 'none', 'important');
    }

    if (!clientSlug) return;

    // Fast-path client loader: Check localStorage first, fallback to /api/clients
    let clientData = null;
    try {
        const local = JSON.parse(localStorage.getItem('unforgettable_clients') || '{}');
        if (local[clientSlug]) clientData = local[clientSlug];
    } catch(e) {}

    if (clientData) {
        applyAll(clientData);
    } else {
        fetch('/api/clients')
            .then(r => r.json())
            .then(data => {
                if (data && data[clientSlug]) {
                    applyAll(data[clientSlug]);
                }
            })
            .catch(() => {});
    }

    function applyAll(client) {
        window.CLIENT_DATA = client;
        applyContent(client);
        applySectionToggles(client);
        applyMedia(client);
    }

    // Helper to safely update text without breaking Framer layouts
    function safeUpdateText(selector, newText) {
        if (!newText) return;
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
            const p = container.querySelector('p.framer-text') || container.querySelector('p') || container;
            if (p && p.textContent !== newText) {
                p.textContent = newText;
            }
        });
    }

    // Helper to toggle section visibility
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

    function applyContent(client) {
        const couple = client.couple || {};
        const family = client.family || {};
        const logistics = client.logistics || {};

        // 1. Hero Names
        if (couple.bride) {
            safeUpdateText('[data-framer-name="Hero Title — Maya"]', couple.bride);
            safeUpdateText('[data-framer-name="Bride Name — Maya"]', couple.bride);
            safeUpdateText('[data-framer-name="BRIDE NAME"]', couple.bride);
            safeUpdateText('[data-framer-name="KIRAN"]', couple.bride);
        }
        if (couple.groom) {
            safeUpdateText('[data-framer-name="Hero Title — Siddharth"]', couple.groom);
            safeUpdateText('[data-framer-name="Groom Name — Siddharth"]', couple.groom);
            safeUpdateText('[data-framer-name="GROOM NAME"]', couple.groom);
            safeUpdateText('[data-framer-name="GROOM NAME "]', couple.groom);
        }
        if (couple.connector) {
            safeUpdateText('[data-framer-name="Hero Title — and"]', couple.connector);
            safeUpdateText('[data-framer-name="Ampersand — and"]', couple.connector);
            safeUpdateText('[data-framer-name="WEDS"]', couple.connector);
            safeUpdateText('[data-framer-name="&amp;"]', couple.connector);
        }

        if (couple.bride && couple.groom) {
            document.title = `${couple.bride} & ${couple.groom} | Wedding Invitation`;
        }

        // 2. Family Parents
        if (family.groomParents) {
            safeUpdateText('[data-framer-name="Groom Parents"]', family.groomParents);
            safeUpdateText('[data-framer-name="GROOM FAMILY"]', family.groomParents);
        }
        if (family.brideParents) {
            safeUpdateText('[data-framer-name="Bride Parents"]', family.brideParents);
            safeUpdateText('[data-framer-name="BRIDE FAMILY"]', family.brideParents);
        }

        // 3. Logistics & Things to Know
        if (couple.hashtag) {
            safeUpdateText('[data-framer-name="Hashtag Title"]', couple.hashtag);
            safeUpdateText('[data-framer-name="Hashtag"] p', couple.hashtag);
            safeUpdateText('[data-framer-name="#"]', couple.hashtag);
        }
        if (logistics.dressCode) {
            safeUpdateText('[data-framer-name="Staff Title"]', 'Attire & Theme');
            safeUpdateText('[data-framer-name="Staff Description"]', logistics.dressCode);
        }
        if (logistics.valetParking) {
            safeUpdateText('[data-framer-name="Parking Description"]', logistics.valetParking);
        }
        if (logistics.weather) {
            safeUpdateText('[data-framer-name="Weather Description"]', logistics.weather);
        }

        // 4. WhatsApp RSVP
        const rsvpNumber = logistics.whatsappRsvp || client.whatsappRsvp;
        if (rsvpNumber) {
            window.CLIENT_WHATSAPP_RSVP = rsvpNumber;
            const rsvpButtons = document.querySelectorAll('[data-framer-name="RSVP Form"] a, [data-framer-name="RSVP Form"] button, [data-framer-name="CTA - RSVP"] a, [data-framer-name="CTA - RSVP"] button');
            rsvpButtons.forEach(btn => {
                const cleanNum = rsvpNumber.replace(/\D/g, '');
                const bride = couple.bride || 'Bride';
                const groom = couple.groom || 'Groom';
                const msg = encodeURIComponent(`Hi ${bride} & ${groom}! I would love to RSVP for your wedding celebrations.`);
                const waUrl = `https://wa.me/${cleanNum}?text=${msg}`;
                if (btn.tagName === 'A') {
                    btn.setAttribute('href', waUrl);
                    btn.setAttribute('target', '_blank');
                } else {
                    btn.onclick = () => window.open(waUrl, '_blank');
                }
            });
        }
    }

    function applySectionToggles(client) {
        const toggles = client.toggles || {};

        // 1. RSVP Section Toggle
        const rsvpSelectors = [
            '[data-framer-name="RSVP Form"]',
            '[data-framer-name="RSVP"]',
            '[data-framer-name="RSVP "]',
            '[data-framer-name="CTA - RSVP"]',
            '[data-framer-name="PAGE 6"]',
            '[data-framer-name="PAGE 7"]',
            '[data-framer-name="Section 4"]'
        ];
        const showRsvp = toggles.rsvp !== false && toggles.enableRsvp !== false;
        toggleElements(rsvpSelectors, showRsvp);

        // 2. Valet Parking Toggle
        const valetSelectors = [
            '[data-framer-name="Parking Item"]',
            '[data-framer-name="Parking"]',
            '[data-framer-name="Divider 3"]'
        ];
        const showValet = toggles.valet !== false && toggles.enableValetParking !== false;
        toggleElements(valetSelectors, showValet);

        // 3. Dress Code / Attire Toggle
        const dressSelectors = [
            '[data-framer-name="Staff Item"]',
            '[data-framer-name="Staff"]',
            '[data-framer-name="Divider 2"]'
        ];
        const showDress = toggles.dressCode !== false && toggles.enableDressCode !== false;
        toggleElements(dressSelectors, showDress);

        // 4. Hashtag Toggle
        const hashtagSelectors = [
            '[data-framer-name="Hashtag Item"]',
            '[data-framer-name="Hashtag"]',
            '[data-framer-name="Divider 1"]'
        ];
        const showHashtag = toggles.hashtag !== false && toggles.enableHashtag !== false;
        toggleElements(hashtagSelectors, showHashtag);

        // 5. Weather Toggle
        const weatherSelectors = [
            '[data-framer-name="Weather Item"]',
            '[data-framer-name="Weather"]'
        ];
        const showWeather = toggles.weather === true || toggles.enableWeather === true;
        toggleElements(weatherSelectors, showWeather);

        // 6. Countdown Timer Toggle
        const countdownSelectors = [
            '[data-framer-name="Countdown"]',
            '[data-framer-name="Countdown Timer"]',
            '[data-framer-name="COUNTING THE DAYS"]',
            '[data-framer-name="PAGE 8"]'
        ];
        const showCountdown = toggles.countdown !== false && toggles.enableCountdown !== false;
        toggleElements(countdownSelectors, showCountdown);

        // 7. Meet the Couple / Our Story Toggle
        const storySelectors = [
            '[data-framer-name="3 — Meet the Couple"]',
            '[data-framer-name="PARAGRAPH STORY"]',
            '[data-framer-name="OUR STORY"]',
            '[data-framer-name="PAGE 5"]'
        ];
        const showStory = toggles.story !== false && toggles.enableStory !== false;
        toggleElements(storySelectors, showStory);

        // 8. Photo Gallery Toggle
        const gallerySelectors = [
            '[data-framer-name="Photo Gallery"]',
            '[data-framer-name="page5"]',
            '[data-framer-name="Frame Photo Slider"]'
        ];
        const showGallery = toggles.gallery !== false && toggles.enableGallery !== false;
        toggleElements(gallerySelectors, showGallery);

        // 9. Background Music Toggle
        const showMusic = toggles.music !== false && toggles.enableMusic !== false;
        const audioControllers = document.querySelectorAll('#buddhist-audio-controller, .audio-controller, #audio-icon-wrap');
        const audioElements = document.querySelectorAll('audio');
        if (!showMusic) {
            audioControllers.forEach(el => el.style.setProperty('display', 'none', 'important'));
            audioElements.forEach(a => {
                a.pause();
                a.src = '';
            });
        } else {
            audioControllers.forEach(el => el.style.removeProperty('display'));
        }
    }

    function applyMedia(client) {
        const media = client.media || {};

        // 1. Logo / Monogram Image Swap
        if (media.logoUrl) {
            const logoSelectors = [
                '[data-framer-name*="Logo"] img',
                '[data-framer-name*="Monogram"] img',
                '[data-framer-name="Logo Placeholder"] img',
                '[data-framer-name="Brand Logo"] img',
                '.framer-logo img'
            ];
            logoSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(img => {
                    img.src = media.logoUrl;
                    img.srcset = '';
                });
            });
        }

        // 2. Couple Photos Swap
        if (media.photos && Array.isArray(media.photos) && media.photos.length > 0) {
            const galleryImages = document.querySelectorAll('[data-framer-name="Photo Gallery"] img, [data-framer-name="page5"] img, [data-framer-name="Frame Photo Slider"] img');
            galleryImages.forEach((img, idx) => {
                if (media.photos[idx]) {
                    img.src = media.photos[idx];
                    img.srcset = '';
                }
            });
        }

        // 3. Couple Cutout Swap
        if (media.coupleCutout) {
            const cutoutImages = document.querySelectorAll('[data-framer-name="COUPLE CUT OUT"] img, [data-framer-name="COUPLE"] img, [data-framer-name="Couple"] img');
            cutoutImages.forEach(img => {
                img.src = media.coupleCutout;
                img.srcset = '';
            });
        }
    }

    // Run automatically after DOM is ready & Framer mounts
    function init() {
        if (clientData) {
            applyAll(clientData);
            // Re-apply after 800ms and 1500ms to override any Framer React hydration re-renders
            setTimeout(() => applyAll(clientData), 800);
            setTimeout(() => applyAll(clientData), 1500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('load', init);
})();
