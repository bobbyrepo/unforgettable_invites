# Buddhist Wedding Template (08) — Modular Architecture Roadmap & To-Do List

> **Project Goal**: Transition the monolithic, machine-compiled Framer template into a clean, modern, modular architecture with section-divided CSS, clean `content.json` data editing, dynamic multi-event custom invitations, and a fail-safe guarantee of **zero broken pixels**.

---

## 📋 Phase 1: Quick Workspace Cleanup & Immediate Controls
- [ ] **1.1. Consolidate & Archive `index_remote.html`**
  - Move/archive `index_remote.html` out of the active template root into `_archive/`.
  - Ensure Next.js dynamic route (`/templates/[...path]`) serves `index.html` seamlessly with `<base>` tag.
  - *Outcome*: Cuts VS Code global search results by 50% immediately, eliminating duplicate hits.
- [ ] **1.2. Expose Countdown Section Spacing Controls**
  - Add explicit CSS variables in the template (`--countdown-shift-y`, `--countdown-photo-shift-y`) to easily move *"The countdown begins"*, the live timer (days, hours, minutes, seconds), and the family portrait up and down.
  - *Outcome*: Immediate control over countdown positioning without inspecting cluttered DOM trees.
- [ ] **1.3. Clean Audit of Content & Image Keys**
  - Map every piece of text and image slot (Couple names, parents, greeting note, event dates, venues, hashtags) into a single master reference map.

---

## 🎨 Phase 2: Section-Divided Modular CSS Architecture
Divide all CSS out of HTML into clean, isolated, section-by-section stylesheets matching the React component mental model:

- [ ] **2.1. Establish `css/sections/` Folder Structure**:
  - `css/main.css` — Central orchestrator that imports all section modules.
  - `css/sections/01-hero.css` — Hero arch backdrop, couple typography, temple flags, music player pill.
  - `css/sections/02-countdown.css` — "The countdown begins", live timer, photo shift controls (`--countdown-shift-y`).
  - `css/sections/03-story.css` — "Meet the Bride & Groom", message card frame, story shift controls (`--desktop-story-shift`).
  - `css/sections/04-gallery.css` — Photo wheel gallery, 100% transparent background rule across all devices.
  - `css/sections/05-timeline.css` — Event itinerary cards, floral dividers, timeline canvas shift controls (`--desktop-timeline-canvas-shift`).
  - `css/sections/06-location.css` — Venue address cards, map container, weather & valet badges.
  - `css/sections/07-footer.css` — Golden Buddha garden, lotus sunburst emblem, closing benediction, RSVP toggle.
- [ ] **2.2. Clean HTML Link Integration**:
  - Replace all inline `<style>` overrides in `index.html` with a single `<link rel="stylesheet" href="./css/main.css">`.
  - *Outcome*: 100% pixel-perfect preservation with modular, readable CSS files.

---

## 📄 Phase 3: Centralized `content.json` Data Blueprint
- [ ] **3.1. Create `templates/08_unforgettable_buddhist_wedding/content.json`**:
  - Store all default text, couple details, greeting notes, countdown target dates, story cards, and itinerary events in pure, human-readable JSON.
- [ ] **3.2. Wire Template Engine to `content.json`**:
  - Allow editing text directly in `content.json` without ever opening or searching minified HTML files.

---

## 💌 Phase 4: Multi-Tier Customized Invitations for the Same Client
Enable a single couple (Client A) to create multiple invitation variations (e.g. Invite 1 = Wedding Only, Invite 2 = Haldi + Sangeet + Wedding, Invite 3 = All Events), while keeping the link in WhatsApp 100% clean with **only the brand name and couple slug** (`yourbrand.com/couple-slug`):

- [ ] **4.1. Admin Form Multi-Invite Builder**:
  - Add `[+ Create Customized Invitation]` in Admin Form.
  - Checkboxes to select which events to include (e.g. Haldi, Mehndi, Sangeet, Wedding, Reception).
  - Dynamic removal/hiding of omitted event cards, medallion badges, and unused locations.
- [ ] **4.2. Link State Transmission Alternatives (To Decide & Implement)**:
  - 🌟 **Alternative 1: Zero-Width Invisible Unicode Encoding (Top Preference)**:
    - *How it works*: Inserts invisible Unicode characters (`\u200C` Zero-Width Non-Joiner) at the end of the URL.
    - *Appearance in WhatsApp*: Looks 100% identical (`yourbrand.com/maya-and-siddharth`). No visible extra letters, numbers, or parameters.
    - *Decoding*: React/Next.js reads the trailing invisible character and loads the specific event tier.
  - 🔹 **Alternative 2: Stealth Token with Auto-Clearing URL (`history.replaceState`)**:
    - *How it works*: Link has a tiny discreet tag in WhatsApp (`.../maya-and-siddharth?v=1`). The instant the page loads (0.001s), `window.history.replaceState({}, '', '/maya-and-siddharth')` wipes it from the address bar.
    - *Appearance in Address Bar*: 100% clean brand + couple slug.
  - 🔹 **Alternative 3: Semantic Sub-Slugs**:
    - *How it works*: Clean, royal sub-URLs (e.g., `.../maya-and-siddharth/wedding` vs `.../maya-and-siddharth/family`).
  - 🔹 **Alternative 4: The Royal Guest Pass Modal**:
    - *How it works*: URL is 100% identical. On page open, a royal prompt asks the guest to tap their pass (e.g. "Family" vs "Wedding & Blessings").
  - *Note: We will review and test between Alternative 1 and Alternative 2 before final implementation.*

---

## 🌐 Phase 5: Backend Data Delivery Strategy
Evaluate and select between the two deployment architectures for serving personalized couple invites:

### 🔹 Option A: Server-Side Injection (SSR) — The Gold Standard
- **How it works**:
  - `content.json` sits on the backend server as the master blueprint.
  - When a guest visits `/[slug]`, the server fetches the couple's custom data from the database, merges it with `content.json`, and serves the complete personalized HTML.
- **Advantages**:
  - **Zero Flicker / No Spinners**: The page renders instantly with the couple's names already baked into the HTML.
  - **WhatsApp & Social Link Previews**: WhatsApp, iMessage, and Instagram crawlers immediately see the couple's names and photo in the rich preview card.
  - **100% Reliable**: Zero client-side network race conditions.
- **Considerations**: Requires a Node.js/Next.js/Edge runtime on the server.

### 🔹 Option B: Client-Side API Fetch (`fetch('/api/invites')`)
- **How it works**:
  - The template is hosted as static assets (HTML/CSS/JS) on a CDN (Cloudflare R2, AWS S3, Vercel).
  - When the browser opens the page, client-side JavaScript fires `fetch('/api/invites?slug=...')` to load the couple's data from the backend and updates the DOM elements dynamically.
- **Advantages**: Completely decoupled static CDN hosting; backend only serves lightweight JSON endpoints.
- **Considerations**: Potential split-second flash of default text (FOUC); WhatsApp link preview cards show generic text unless a separate bot prerenderer handles crawlers.

---

## ⚛️ Phase 6: Optional Native React Componentization (Future Phase)
- [ ] **6.1. Parallel Side-by-Side Development**
  - If desired in the future, build native React components (`HeroSection.tsx`, `CountdownSection.tsx`, `PhotoWheel.tsx`) in a separate directory (`src/components/templates/08_buddhist/`) without touching the working template.
- [ ] **6.2. Automated Pixel-Diff Verification**
  - Compare headless screenshots of the React version against the current template to ensure 100% visual fidelity before swapping.
