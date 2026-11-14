/**
 * Unforgettable Invites — Dynamic Modular Component Loader
 * Loads section partials asynchronously into [data-include] slots
 * and initializes page lifecycle events once all sections are in DOM.
 */

(function () {
    async function initModularPage() {
        const slots = Array.from(document.querySelectorAll('[data-include]'));
        if (slots.length === 0) return;

        // Fetch all section partials in parallel
        await Promise.all(slots.map(async (slot) => {
            const path = slot.getAttribute('data-include');
            try {
                const res = await fetch(path);
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const html = await res.text();
                
                // Replace the slot with parsed HTML
                const template = document.createElement('template');
                template.innerHTML = html.trim();
                slot.replaceWith(template.content);
            } catch (err) {
                console.error(`[Modular Loader] Failed to load "${path}":`, err);
            }
        }));

        window.__modularLoaded = true;
        document.dispatchEvent(new CustomEvent('modular-ready'));
        window.dispatchEvent(new CustomEvent('resize'));

        if (typeof window.__triggerFramerAppear === 'function') {
            window.__triggerFramerAppear();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModularPage);
    } else {
        initModularPage();
    }
})();
