# Buddhist Wedding Template (08) — Modular React Migration & Architecture To-Do List

> **Project Goal**: Transition the monolithic, machine-compiled Framer template into a clean, modern, modular React/Next.js architecture with isolated CSS and effortless backend data integration.

---

## 📋 Phase 1: Quick Workspace Cleanup & Immediate Controls
- [ ] **1.1. Consolidate & Archive `index_remote.html`**
  - Move/archive `index_remote.html` out of the active template root into `_archive/`.
  - Ensure Next.js dynamic route (`/templates/[...path]`) serves `index.html` seamlessly with `<base>` tag.
  - **Outcome**: Cuts VS Code global search results by 50% immediately, eliminating duplicate hits.
- [ ] **1.2. Expose Countdown Section Spacing Controls**
  - Add explicit CSS variables in the template (`--countdown-shift-y`, `--countdown-photo-shift-y`) to easily move *"The countdown begins"*, the live timer (days, hours, minutes, seconds), and the family portrait up and down.
  - **Outcome**: Immediate control over countdown positioning without inspecting cluttered DOM trees.
- [ ] **1.3. Clean Audit of Content & Image Keys**
  - Map every piece of text and image slot (Couple names, parents, greeting note, event dates, venues, hashtags) into a single master reference map.

---

## ⚛️ Phase 2: Full React Componentization (Modular Architecture)
Transform the 1MB single-file HTML into clean, reusable, human-readable React components powered by **Tailwind CSS** and **Framer Motion**:

- [ ] **2.1. Component Tree Architecture Setup**
  - Create directory: `src/components/templates/08_buddhist/`
  - Establish component contracts and TypeScript interfaces (`BuddhistInviteData`, `EventItemProps`, `PhotoItemProps`).
- [ ] **2.2. Implement Modular Section Components**:
  - [ ] **`HeroSection.tsx`**:
    - Gateway arch backdrop, temple pillars, sunburst motif, floating flags.
    - Couple names ("Maya & Siddharth"), wedding date banner.
    - Floating Audio Flute music pill component.
  - [ ] **`CountdownSection.tsx`**:
    - *"The countdown begins"* header text.
    - Live countdown ticker (Days, Hours, Minutes, Seconds) with real-time interval logic.
    - Family / couple portrait container with golden floral divider.
  - [ ] **`CoupleStorySection.tsx`**:
    - *"Meet the Bride & Groom"* typography.
    - Golden Lotus Message Card Frame with customizable invitation text.
  - [ ] **`PhotoWheelSection.tsx`**:
    - Native `framer-motion` rotating circular carousel.
    - *"Almost time to celebrate"* center badge.
    - 6 rotating photo cards with scroll-bound physics and 100% transparent background.
  - [ ] **`TimelineSection.tsx`**:
    - Wedding Timeline Canvas desktop/mobile backdrop.
    - Event schedule cards (Haldi, Sangeet, Wedding Ceremony, Reception).
    - Floral divider flourishes and location pin badges.
  - [ ] **`LocationSection.tsx`**:
    - Location canvas backdrop, interactive map (Leaflet / Google Maps embed).
    - Venue addresses, directions CTA button, and logistics badges (valet, weather).
  - [ ] **`BlessingFooterSection.tsx`**:
    - Golden Buddha garden with lotus emblems, benediction prayer, and footer RSVP toggle.
- [ ] **2.3. Root Orchestrator (`BuddhistInvitePage.tsx`)**:
  - Assemble all modular sections.
  - Feed all text, dates, images, and audio via a single `data` prop.
  - **Outcome**: Any text can be found and updated in seconds by opening the exact section file.

---

## 🎨 Phase 3: CSS Separation & Backend Dynamic Styling
- [ ] **3.1. Extract All Custom Styles into Dedicated CSS**
  - Remove all inline `<style>` blocks from HTML.
  - Consolidate all overrides and positioning into `templates/08_unforgettable_buddhist_wedding/css/custom-controls.css` (or pure Tailwind utility classes).
- [ ] **3.2. Connect to Backend & Database Schema**
  - Store styling variables (`storyShift`, `countdownShift`, `timelineShift`) in the backend invite schema (`invite.customStyles`).
  - Allow the user or admin dashboard to adjust section positions dynamically via sliders/inputs.
- [ ] **3.3. CDN & Cloudflare R2 Asset Pipeline Sync**
  - Organize extracted CSS, JS bundles, and optimized webp/png assets into a clean folder structure for automated CDN uploads.
