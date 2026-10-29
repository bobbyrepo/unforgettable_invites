// ==========================================================================
// WEDDING CONTENT MANAGER (SAFE TEXT-ONLY SYNC)
// Updates text nodes across Desktop, Tablet & Mobile without touching
// any CSS, margins, layouts, or Framer styling.
// ==========================================================================

(function() {
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

    function applyContent() {
        if (!window.WEDDING_CONTENT) return;
        const c = window.WEDDING_CONTENT;

        // Section 1: Hero
        if (c.hero) {
            safeUpdateText('[data-framer-name="Hero Title — Maya"]', c.hero.brideName);
            safeUpdateText('[data-framer-name="Bride Name — Maya"]', c.hero.brideName);
            safeUpdateText('[data-framer-name="Hero Title — and"]', c.hero.connector);
            safeUpdateText('[data-framer-name="Ampersand — and"]', c.hero.connector);
            safeUpdateText('[data-framer-name="Hero Title — Siddharth"]', c.hero.groomName);
            safeUpdateText('[data-framer-name="Groom Name — Siddharth"]', c.hero.groomName);

            if (c.hero.brideName && c.hero.groomName) {
                document.title = c.hero.brideName + ' & ' + c.hero.groomName + ' | Buddhist Wedding Invitation';
            }
        }

        // Section 2: Family
        if (c.family) {
            safeUpdateText('[data-framer-name="Groom Parents"]', c.family.groomParents);
            safeUpdateText('[data-framer-name="Bride Parents"]', c.family.brideParents);
            safeUpdateText('[data-framer-name="Invitation Line"]', c.family.invitationLine);
            safeUpdateText('[data-framer-name="Label — Daughter of"]', c.family.daughterOfLabel);
            safeUpdateText('[data-framer-name="Label — Events Intro"]', c.family.eventsIntroLabel);
        }

        // Section 3: Timeline
        if (c.timeline) {
            safeUpdateText('[data-framer-name="Timeline Heading"]', c.timeline.heading);
            safeUpdateText('[data-framer-name="Timeline Subtext"]', c.timeline.subtext);
        }

        // Section 4: Meet the Couple
        if (c.coupleStory) {
            safeUpdateText('[data-framer-name="Meet the Couple Heading"]', c.coupleStory.heading);
        }

        // Section 5: Things to Know
        if (c.thingsToKnow) {
            safeUpdateText('[data-framer-name="Things to Know Heading"]', c.thingsToKnow.heading);
            safeUpdateText('[data-framer-name="Things to Know Subtext"]', c.thingsToKnow.subtext);
            if (c.thingsToKnow.cards) {
                const k = c.thingsToKnow.cards;
                if (k.hashtag) {
                    safeUpdateText('[data-framer-name="Hashtag Title"]', k.hashtag.title);
                    safeUpdateText('[data-framer-name="Hashtag Description"]', k.hashtag.description);
                }
                if (k.weather) {
                    safeUpdateText('[data-framer-name="Weather Title"]', k.weather.title);
                    safeUpdateText('[data-framer-name="Weather Description"]', k.weather.description);
                }
                if (k.staff) {
                    safeUpdateText('[data-framer-name="Staff Title"]', k.staff.title);
                    safeUpdateText('[data-framer-name="Staff Description"]', k.staff.description);
                }
                if (k.parking) {
                    safeUpdateText('[data-framer-name="Parking Title"]', k.parking.title);
                    safeUpdateText('[data-framer-name="Parking Description"]', k.parking.description);
                }
            }
        }

        // Section 6: Countdown & RSVP
        if (c.countdownAndRsvp) {
            safeUpdateText('[data-framer-name="Countdown Heading"]', c.countdownAndRsvp.countdownHeading);
            safeUpdateText('[data-framer-name="Countdown Intro Text"]', c.countdownAndRsvp.countdownIntro);
            safeUpdateText('[data-framer-name="RSVP Form"] button, [data-framer-name="RSVP Form"] a', c.countdownAndRsvp.rsvpButtonText);
        }
    }

    // Run after Framer hydration mounts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyContent);
    } else {
        applyContent();
    }
    window.addEventListener('load', applyContent);

    // One gentle check after 1.2s to match Framer React hydration
    setTimeout(applyContent, 1200);
})();
