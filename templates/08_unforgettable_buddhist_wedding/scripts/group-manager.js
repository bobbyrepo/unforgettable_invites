/**
 * Unforgettable Invites — Semantic Content Group Manager
 * Groups related elements together so that moving a group container moves
 * all nested components with identical relative gaps and zero layout drift.
 * 
 * Groups established:
 * 1. #group-hero-invitation (.group-invitation-card)
 *    - Shri Ganeshaaya Namaha, Buddha medallion, parents, couple names, and downwards scroll arrow.
 * 2. #group-wedding-timeline (.group-wedding-timeline)
 *    - Wedding Timeline heading, subtext, peacock backdrop, and all 6 event cards.
 * 3. #group-meet-the-couple (.group-meet-the-couple)
 *    - Meet the Bride and Groom heading, story backdrop image, and message scroll cards.
 * 4. #group-rotating-collage (.group-rotating-collage)
 *    - Rotating photo gallery/collage and 'Almost time to celebrate' text.
 */
(function () {
    'use strict';

    // 1. Inject styling for groups
    try {
        const styleId = 'unforgettable-group-manager-css';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* Group 1: Hero Invitation Card & Scroll Arrow */
                .group-invitation-card {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 10;
                    transform: translateY(var(--group-hero-invitation-offset-y, 0px));
                    transition: transform 0.2s ease-out;
                }
                .group-invitation-card > * {
                    pointer-events: auto;
                }

                /* Group 2: Wedding Timeline Content & Event Cards (Excluding Section Backdrops) */
                .group-wedding-timeline {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 3;
                    transform: translateY(var(--group-wedding-timeline-offset-y, 0px));
                    transition: transform 0.2s ease-out;
                }
                .group-wedding-timeline > * {
                    pointer-events: auto;
                }

                /* Group 3: Meet the Bride & Groom Story */
                .group-meet-the-couple {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 2;
                    transform: translateY(var(--group-meet-the-couple-offset-y, 0px));
                    transition: transform 0.2s ease-out;
                }
                .group-meet-the-couple > * {
                    pointer-events: auto;
                }

                /* Group 4: Rotating Collage & Celebration Text */
                .group-rotating-collage {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 3;
                    transform: translateY(var(--group-rotating-collage-offset-y, 0px));
                    transition: transform 0.2s ease-out;
                }
                .group-rotating-collage > * {
                    pointer-events: auto;
                }

                /* Mobile-specific: Natural-flow Flex Column Stack for Group 1 (Zero Overlap) & Group 2 Upward Shift */
                @media (max-width: 809px) {
                    /* Move Group 1 (Invitation Details + Scroll Arrow) above to remove empty blank space */
                    .group-invitation-card {
                        transform: translateY(var(--group-hero-invitation-offset-y, -100px)) !important;
                    }

                    /* Move Group 2 (Wedding Timeline Content & Cards) on mobile */
                    .group-wedding-timeline {
                        transform: translateY(var(--group-wedding-timeline-offset-y, -170px)) !important;
                    }

                    /* Move Group 3 (Meet Bride & Groom Heading + Message Card) upwards on mobile */
                    .group-meet-the-couple {
                        transform: translateY(var(--group-meet-the-couple-offset-y, -100px)) !important;
                    }

                    /* Peacock Trim Ornament: removed from Group 2, positioned at the bottom below cards */
                    [data-framer-name="2 — Wedding Timeline"] [data-framer-name="Peacock Ornament"] {
                        position: absolute !important;
                        left: 50% !important;
                        top: var(--peacock-ornament-top, 1680px) !important;
                        bottom: auto !important;
                        transform: translateX(-50%) !important;
                        z-index: 5 !important;
                        display: block !important;
                        width: 166px !important;
                        height: 65px !important;
                    }

                    /* Single unified flow container on mobile */
                    [data-framer-name="Invitation Details"] {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: flex-start !important;
                        height: auto !important;
                        max-width: 260px !important;
                        width: 260px !important;
                        left: 50% !important;
                        top: 920px !important;
                        transform: translateX(-50%) !important;
                        overflow: visible !important;
                    }

                    /* Convert all child elements from absolute coordinates to natural document flow */
                    [data-framer-name="Invitation Details"] > * {
                        position: static !important;
                        top: auto !important;
                        bottom: auto !important;
                        left: auto !important;
                        right: auto !important;
                        transform: none !important;
                        margin: 0 !important;
                        width: auto !important;
                        max-width: 100% !important;
                        text-align: center !important;
                    }

                    /* 1. Ganpati Name (img) */
                    [data-framer-name="Invitation Details"] [data-framer-name="Ganpati Name (img)"] {
                        order: 1 !important;
                        width: 83px !important;
                        height: 26px !important;
                        margin-bottom: 4px !important;
                    }

                    /* 2. Ganpati Icon */
                    [data-framer-name="Invitation Details"] [data-framer-name="Ganpati Icon"] {
                        order: 2 !important;
                        width: 47px !important;
                        height: 65px !important;
                        margin-bottom: 8px !important;
                    }

                    /* 3. Shri Line (img) */
                    [data-framer-name="Invitation Details"] [data-framer-name="Shri Line (img)"] {
                        order: 3 !important;
                        width: 195px !important;
                        height: 38px !important;
                        margin-bottom: 12px !important;
                    }

                    /* 4. Groom Parents (Grows naturally, pushes elements below down) */
                    [data-framer-name="Invitation Details"] [data-framer-name*="Groom Parents"] {
                        order: 4 !important;
                        margin-bottom: 8px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name*="Groom Parents"] p {
                        margin: 0 !important;
                        text-align: center !important;
                        white-space: normal !important;
                        line-height: 1.35 !important;
                    }

                    /* 5. Invitation Line (Wraps into lines, pushes couple names down) */
                    [data-framer-name="Invitation Details"] [data-framer-name="Invitation Line"] {
                        order: 5 !important;
                        width: 100% !important;
                        margin-bottom: 14px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name="Invitation Line"] p {
                        margin: 0 !important;
                        text-align: center !important;
                        white-space: normal !important;
                        line-height: 1.4 !important;
                    }

                    /* 6. Groom Name — Siddharth */
                    [data-framer-name="Invitation Details"] [data-framer-name*="Groom Name"] {
                        order: 6 !important;
                        margin-bottom: 2px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name*="Groom Name"] p {
                        --framer-font-size: 46px !important;
                        font-size: 46px !important;
                        line-height: 1.1 !important;
                        margin: 0 !important;
                    }

                    /* 7. Ampersand — & */
                    [data-framer-name="Invitation Details"] [data-framer-name*="Ampersand"] {
                        order: 7 !important;
                        margin-bottom: 2px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name*="Ampersand"] p {
                        --framer-font-size: 34px !important;
                        font-size: 34px !important;
                        line-height: 1 !important;
                        margin: 0 !important;
                    }

                    /* 8. Bride Name — Maya */
                    [data-framer-name="Invitation Details"] [data-framer-name*="Bride Name"] {
                        order: 8 !important;
                        margin-bottom: 10px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name*="Bride Name"] p {
                        --framer-font-size: 46px !important;
                        font-size: 46px !important;
                        line-height: 1.1 !important;
                        margin: 0 !important;
                    }

                    /* 9. Daughter of */
                    [data-framer-name="Invitation Details"] [data-framer-name*="Daughter of"] {
                        order: 9 !important;
                        margin-bottom: 6px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name*="Daughter of"] p {
                        margin: 0 !important;
                        text-align: center !important;
                    }

                    /* 10. Bride Parents */
                    [data-framer-name="Invitation Details"] [data-framer-name*="Bride Parents"] {
                        order: 10 !important;
                        margin-bottom: 20px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name*="Bride Parents"] p {
                        margin: 0 !important;
                        text-align: center !important;
                        white-space: normal !important;
                        line-height: 1.35 !important;
                    }

                    /* 11. Events Intro: decreased font size */
                    [data-framer-name="Invitation Details"] [data-framer-name*="Events Intro"] {
                        order: 11 !important;
                        margin-bottom: 2px !important;
                    }
                    [data-framer-name="Invitation Details"] [data-framer-name*="Events Intro"] p {
                        --framer-font-size: 14px !important;
                        font-size: 14px !important;
                        letter-spacing: 0.5px !important;
                        margin: 0 !important;
                        text-align: center !important;
                    }

                    /* 12. Scroll Arrow: placed below Events Intro, increased prominent size */
                    [data-framer-name="Invitation Details"] [data-framer-name="Scroll Arrow"] {
                        order: 12 !important;
                        position: static !important;
                        top: auto !important;
                        bottom: auto !important;
                        left: auto !important;
                        right: auto !important;
                        transform: none !important;
                        margin: 6px auto 0 auto !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                        width: 44px !important;
                        height: 95px !important;
                        pointer-events: auto !important;
                        opacity: 1 !important;
                    }

                    [data-framer-name="Invitation Details"] [data-framer-name="Scroll Arrow"] > div {
                        height: 95px !important;
                        width: 35px !important;
                        transform: scale(0.55) !important;
                        transform-origin: top center !important;
                        opacity: 1 !important;
                    }

                    /* Card internal text flow (Title -> Time -> Day -> Date -> Venue -> More details)
                       is defined universally across all breakpoints in css/overrides.css */
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }
    } catch (e) {}

    let isSyncing = false;

    function cleanupGroups() {
        // Desktop / Tablet cleanup: unwrap all groups and restore original DOM structure
        const g2 = document.getElementById('group-wedding-timeline');
        if (g2) {
            const pillarsRow = document.querySelector('[data-framer-name="Pillars Row"]');
            const timelineSection = document.querySelector('[data-framer-name="2 — Wedding Timeline"]');
            
            while (g2.firstChild) {
                const child = g2.firstChild;
                const framerName = child.getAttribute && child.getAttribute('data-framer-name');
                if (pillarsRow && ['1', '2', '3', '4', '5', '6'].includes(framerName)) {
                    pillarsRow.appendChild(child);
                } else if (timelineSection) {
                    timelineSection.insertBefore(child, g2);
                } else if (g2.parentNode) {
                    g2.parentNode.insertBefore(child, g2);
                }
            }
            if (g2.parentNode) g2.parentNode.removeChild(g2);
        }

        const g1 = document.getElementById('group-hero-invitation');
        if (g1) {
            const heroSection = document.querySelector('[data-framer-name="1 — Hero & Invitation"]') || g1.parentNode;
            while (g1.firstChild) {
                if (heroSection) heroSection.insertBefore(g1.firstChild, g1);
                else g1.parentNode.insertBefore(g1.firstChild, g1);
            }
            if (g1.parentNode) g1.parentNode.removeChild(g1);
        }

        const g3 = document.getElementById('group-meet-the-couple');
        if (g3) {
            const coupleSection = document.querySelector('[data-framer-name="3 — Meet the Couple"]') || g3.parentNode;
            while (g3.firstChild) {
                if (coupleSection) coupleSection.insertBefore(g3.firstChild, g3);
                else g3.parentNode.insertBefore(g3.firstChild, g3);
            }
            if (g3.parentNode) g3.parentNode.removeChild(g3);
        }

        const g4 = document.getElementById('group-rotating-collage');
        if (g4) {
            const coupleSection = document.querySelector('[data-framer-name="3 — Meet the Couple"]') || g4.parentNode;
            while (g4.firstChild) {
                if (coupleSection) coupleSection.insertBefore(g4.firstChild, g4);
                else g4.parentNode.insertBefore(g4.firstChild, g4);
            }
            if (g4.parentNode) g4.parentNode.removeChild(g4);
        }
    }

    function syncGroups() {
        if (isSyncing) return;
        isSyncing = true;

        try {
            // STRICT DESKTOP / TABLET GUARD: Groups are strictly for mobile screens <= 809px
            if (window.innerWidth > 809) {
                cleanupGroups();
                return;
            }

            // Group 1: Hero Invitation Details & Scroll Arrow
            const arrow = document.querySelector('[data-framer-name="Scroll Arrow"]');
            const details = document.querySelector('[data-framer-name="Invitation Details"]');
            let g1 = document.getElementById('group-hero-invitation');

            if (arrow && details) {
                if (!g1) {
                    g1 = document.createElement('div');
                    g1.id = 'group-hero-invitation';
                    g1.className = 'group-invitation-card';
                    g1.setAttribute('data-group-name', 'Hero Invitation & Scroll Arrow');
                    const parent = arrow.parentElement || details.parentElement;
                    if (parent) {
                        parent.insertBefore(g1, arrow.parentElement === parent ? arrow : details);
                    }
                }

                if (window.innerWidth <= 809) {
                    // Mobile: Arrow is placed inside Invitation Details directly below Events Intro
                    if (!details.contains(arrow)) {
                        details.appendChild(arrow);
                    }
                    if (!g1.contains(details)) {
                        g1.appendChild(details);
                    }
                } else {
                    // Desktop: Arrow and Details are siblings inside Group 1
                    if (!g1.contains(arrow)) {
                        g1.appendChild(arrow);
                    }
                    if (!g1.contains(details)) {
                        g1.appendChild(details);
                    }
                }
            }

            // Group 2: Wedding Timeline Content & Event Cards (Excluding Section Backdrops)
            const timelineSection = document.querySelector('[data-framer-name="2 — Wedding Timeline"]');
            if (timelineSection) {
                // Ensure Section 2 itself is not tagged with group-wedding-timeline
                if (timelineSection.id === 'group-wedding-timeline') {
                    timelineSection.id = '';
                    timelineSection.classList.remove('group-wedding-timeline');
                    timelineSection.style.transform = '';
                    timelineSection.style.background = '';
                }

                // Restore backdrops visibility in Section 2
                const peacockBackdrop = timelineSection.querySelector('[data-framer-name="Peacock Backdrop"]');
                const pillarBackdrop = timelineSection.querySelector('[data-framer-name="Pillar Backdrop"]');
                if (peacockBackdrop) peacockBackdrop.style.display = '';
                if (pillarBackdrop) pillarBackdrop.style.display = '';

                let g2 = document.getElementById('group-wedding-timeline');
                if (!g2) {
                    g2 = document.createElement('div');
                    g2.id = 'group-wedding-timeline';
                    g2.className = 'group-wedding-timeline';
                    g2.setAttribute('data-group-name', 'Wedding Timeline Content & Event Cards');
                    timelineSection.appendChild(g2);
                }

                // Move all timeline content (heading, subtext, 6 cards, ornaments) into Group 2
                // Leaving Peacock Backdrop, Pillar Backdrop, and Peacock Trim Ornament outside g2 in Section 2
                const timelineItems = timelineSection.querySelectorAll(`
                    [data-framer-name="Timeline Heading"],
                    [data-framer-name="Timeline Subtext"],
                    [data-framer-name="1"],
                    [data-framer-name="2"],
                    [data-framer-name="3"],
                    [data-framer-name="4"],
                    [data-framer-name="5"],
                    [data-framer-name="6"],
                    [data-framer-name*="Timeline Ornament"],
                    [data-framer-name*="Pillar Ornament"]
                `);

                timelineItems.forEach(item => {
                    if (!g2.contains(item)) {
                        g2.appendChild(item);
                    }
                });

                // Ensure Peacock Trim Ornament is kept out of Group 2
                const peacockOrnament = timelineSection.querySelector('[data-framer-name="Peacock Ornament"]');
                if (peacockOrnament && g2.contains(peacockOrnament)) {
                    timelineSection.appendChild(peacockOrnament);
                }
            }

            // Group 3 & Group 4: Inside Meet the Couple
            const coupleSection = document.querySelector('[data-framer-name="3 — Meet the Couple"]');
            if (coupleSection) {
                // Group 3: Meet the Bride & Groom Story (Heading, Message Card & Message Text ONLY — Backdrop kept outside)
                const heading = coupleSection.querySelector('[data-framer-name="Meet the Couple Heading"]');
                const backdrop = coupleSection.querySelector('[data-framer-name="Section Backdrop"]');
                const messageCard = coupleSection.querySelector('[data-framer-name="Message Card Frame"]');
                let g3 = document.getElementById('group-meet-the-couple');

                // Ensure Section Backdrop remains outside g3 as direct section background
                if (backdrop && g3 && g3.contains(backdrop)) {
                    coupleSection.insertBefore(backdrop, g3);
                }

                if (heading || messageCard) {
                    if (!g3) {
                        g3 = document.createElement('div');
                        g3.id = 'group-meet-the-couple';
                        g3.className = 'group-meet-the-couple';
                        g3.setAttribute('data-group-name', 'Meet the Bride and Groom Story');
                        coupleSection.appendChild(g3);
                    }
                    if (heading && !g3.contains(heading)) g3.appendChild(heading);
                    if (messageCard && !g3.contains(messageCard)) g3.appendChild(messageCard);
                }

                // Group 4: Rotating Photo Collage & Celebration Text
                const collage = coupleSection.querySelector('[data-framer-name="Photo Gallery"]');
                const celebrationText = coupleSection.querySelector('[data-framer-name*="dont check my spelling"]');
                let g4 = document.getElementById('group-rotating-collage');

                if (collage || celebrationText) {
                    if (!g4) {
                        g4 = document.createElement('div');
                        g4.id = 'group-rotating-collage';
                        g4.className = 'group-rotating-collage';
                        g4.setAttribute('data-group-name', 'Rotating Photo Collage & Celebration Text');
                        coupleSection.appendChild(g4);
                    }
                    if (collage && !g4.contains(collage)) g4.appendChild(collage);
                    if (celebrationText && !g4.contains(celebrationText)) g4.appendChild(celebrationText);
                }
            }
        } catch (err) {
            console.warn('[group-manager] Sync notice:', err);
        } finally {
            isSyncing = false;
        }
    }

    // Move utility helper exposed globally
    window.moveGroup = function (groupNameOrId, yOffsetPx) {
        const idMap = {
            'invitation': 'group-hero-invitation',
            'timeline': 'group-wedding-timeline',
            'couple': 'group-meet-the-couple',
            'collage': 'group-rotating-collage'
        };
        const varMap = {
            'group-hero-invitation': '--group-hero-invitation-offset-y',
            'group-wedding-timeline': '--group-wedding-timeline-offset-y',
            'group-meet-the-couple': '--group-meet-the-couple-offset-y',
            'group-rotating-collage': '--group-rotating-collage-offset-y'
        };
        const targetId = idMap[groupNameOrId] || groupNameOrId.replace(/^#/, '');
        const el = document.getElementById(targetId);
        if (el) {
            const offset = typeof yOffsetPx === 'number' ? `${yOffsetPx}px` : yOffsetPx;
            const varName = varMap[targetId];
            if (varName) {
                el.style.setProperty(varName, offset);
                document.documentElement.style.setProperty(varName, offset);
            }
            el.style.setProperty('transform', `translateY(${offset})`, 'important');
            console.log(`[group-manager] Moved #${targetId} by ${offset}`);
            return true;
        }
        console.warn(`[group-manager] Group not found: ${groupNameOrId}`);
        return false;
    };

    window.GROUPS = {
        INVITATION: '#group-hero-invitation',
        TIMELINE: '#group-wedding-timeline',
        COUPLE: '#group-meet-the-couple',
        COLLAGE: '#group-rotating-collage'
    };

    // Run on lifecycle events
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncGroups);
    } else {
        syncGroups();
    }

    window.addEventListener('load', syncGroups);
    window.addEventListener('resize', () => {
        setTimeout(syncGroups, 100);
    });

    // MutationObserver to withstand Framer React hydration on mobile
    try {
        const observer = new MutationObserver(() => {
            if (window.innerWidth <= 809) {
                const g1 = document.getElementById('group-hero-invitation');
                const g2 = document.getElementById('group-wedding-timeline');
                const g3 = document.getElementById('group-meet-the-couple');
                const g4 = document.getElementById('group-rotating-collage');
                if (!g1 || !g2 || !g3 || !g4) {
                    syncGroups();
                }
            }
        });
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    } catch (e) {}

    // Periodic safety passes for late hydration on mobile
    setTimeout(() => { if (window.innerWidth <= 809) syncGroups(); }, 300);
    setTimeout(() => { if (window.innerWidth <= 809) syncGroups(); }, 800);
    setTimeout(() => { if (window.innerWidth <= 809) syncGroups(); }, 2000);
})();
