# Template 09: Buddha React (Next.js) — Blueprint v2.2
**Final engineering plan. Supersedes v2.1.**  
*Every known defect from the v1 and v2.1 reviews is fixed here, and every remaining risk has a named test or gate that catches it.*

---

## 1. Goal and Non-Goals

- **Goal**: A clean Next.js/React port of Template 08 with measurable visual parity at three primary widths, dynamic data, and no Framer runtime.
- **Non-Goals**: Pixel parity between breakpoints (T08 is not a reliable oracle there), shipping WebGL cloth in the first release, and any claim of zero bugs. The plan promises gates that catch bugs, not their absence.

---

## 2. What Changed from v2.1

| v2.1 Defect | v2.2 Fix |
| :--- | :--- |
| `zoom: calc(100cqw / 1536)` is invalid and left 768–1023px unscaled | One valid `--u` length per stage (section 5), no zoom |
| `export const metadataBase` is not a valid page export | `metadataBase` lives in `layout.tsx` |
| `clearProps` leaves CSS-hidden content for reduced-motion users | Hidden state exists only under `prefers-reduced-motion: no-preference` |
| SSR paints resting state, then GSAP jumps to Frame 0 | Pre-hydration `.pre` class replaced by a per-section `data-motion` attribute, switched by GSAP, with a `<noscript>` override |
| WebP OG image, hosted in T08's folder | 1200×630 JPEG under 300 KB in T09's own folder, versioned URL |
| Lossy WebP re-encoded by `next/image` | Lossless masters in, Next does the single encode |
| Free-text event dates, stored `lifecycleStatus`, one-literal `templateId` | ISO timestamps with offset, derived lifecycle, `TemplateId` union |
| Full-page diff, vague 0.5% | Per-section crops, fixed pixelmatch settings, frozen clock, masks |
| Smoke viewports gated against T08 | Smoke gated on invariants; T08 diff is advisory there |
| Hardcoded names in metadata | Loaded from data by slug |

---

## 3. Architecture Decisions

| Area | Decision |
| :--- | :--- |
| **Framework** | Next.js App Router, version pinned in Sprint 0 |
| **Rendering** | Sections are Server Components. Only motion, countdown and audio are Client Components, which keeps first-party JS small |
| **Styling** | CSS Modules, semantic class names, design tokens as CSS variables |
| **Motion** | GSAP + ScrollTrigger via `@gsap/react`. No Framer Motion |
| **Test Tooling** | Playwright only (extraction, diffing, invariants). No Puppeteer |
| **Layout** | Document flow between sections, scaled stage projection inside them |
| **Flags** | Tier 1 sliced CSS mesh ships. Tier 2 WebGL is an optional, gated Sprint 5 |
| **Deploy** | Vercel |

---

## 4. Directory Structure

```
src/components/templates/Template09_BuddhaReact/
├── index.ts
├── Template09.tsx                  # server: orchestrates sections
├── Template09.module.css           # stage, tokens, layer scale
├── stage-tokens.generated.css      # generated from extraction JSON
├── sections/01-Hero ... 07-Footer/ # <Section>.tsx + .module.css + components/
├── widgets/AudioController.tsx     # (client)
├── motion/useStageMotion.ts        # (client)
└── motion/Countdown.tsx            # (client)

data/
├── content.default.json            # identical copy to T08
├── content.stress.json             # long names, 3-line addresses, 6 events
└── settled/*.json                  # extraction output per viewport

tools/
├── extract-settled.ts              # Playwright scroll-through extractor
└── gen-tokens.ts                   # JSON to stage-tokens.generated.css and the element map

tests/
├── parity.spec.ts                  # Per-section pixelmatch tests
├── invariants.spec.ts              # Invariant tests across smoke viewports
└── perf                            # Lighthouse CI configuration
```

---

## 5. Layout System (Valid, Continuous, Fallback-Safe)

Three art-directed stages, each with its own reference width. Inside a stage everything scales smoothly from one length variable, `--u`, which equals one design pixel.

```css
.stage {
  container-type: inline-size;
  container-name: stage;
  width: 100%;
  max-width: 1536px;
  margin-inline: auto;
}

@media (max-width: 767.98px) {
  .stage { max-width: 480px; }
}

/* Fallback for old webviews: viewport units */
.stageInner {
  --u: calc(min(100vw, 480px) / 393);
  position: relative;
}

@media (min-width: 768px) {
  .stageInner { --u: calc(100vw / 810); }
}

@media (min-width: 1024px) {
  .stageInner { --u: calc(min(100vw, 1536px) / 1536); }
}

/* Modern: container units, no scrollbar jitter */
@supports (width: 1cqw) {
  .stageInner { --u: calc(100cqw / 393); }
  @container stage (min-width: 768px) {
    .stageInner { --u: calc(100cqw / 810); }
  }
  @container stage (min-width: 1024px) {
    .stageInner { --u: calc(100cqw / 1536); }
  }
}

.pageRoot {
  overflow-x: clip;
  background: #0b0704;
}
```

### Rules That Keep This Correct:
- `--u` is length divided by number, which is a valid length. It is never fed into `clamp()` with unitless bounds.
- `cqw` resolves against the nearest ancestor container, so `--u` is set on `.stageInner`, a child of `.stage`.
- All sizes are `calc(N * var(--u))`. Per-stage numbers (for example hero name size 140 mobile, 171 desktop) are unitless tokens in `stage-tokens.generated.css`, used as `calc(var(--hero-name-size) * var(--u))`.
- Tablet and desktop are separate compositions. A jump at 1024px is expected and reviewed, not a bug.
- `overflow-x: clip` replaces `hidden` so sticky and fixed children behave.

### Sections: Flow Plus Stage Art
- Each section is `position: relative; isolation: isolate;` and sits in normal flow.
- Scenic layers are absolutely positioned using `left/top/width/height` from the extraction JSON, all in `calc(N * var(--u))`, each with an explicit `aspect-ratio`.
- Text-heavy sections (Meet Couple, Timeline, Location) are flow-first. Their art is a decorative backdrop; cards stack in flow, and tilt comes from `:nth-child(odd/even)` (+6deg / −6deg), so any number of events works.
- Section height is `min-height: calc(var(--stage-h) * var(--u))`, so long content grows the section and pushes the next one down.

### Layer Scale
Z-indexes are local to each section. Only the audio pill is global.

| Token | Value | Use |
| :--- | :--- | :--- |
| `--z-back` | `1` | sky, backdrop |
| `--z-mid` | `2` | sun, mountains, clouds, trees |
| `--z-arch` | `3` | stone arch, alcove |
| `--z-card` | `4` | cards, portrait |
| `--z-text` | `5` | names, dials, shloka |
| `--z-audio` | `99`| floating pill (page level) |

---

## 6. Element Map is Generated, Never Hand-Written

1. `tools/extract-settled.ts` loads T08 at 393, 810 and 1536, scrolls through the whole page in steps, returns to top, waits for animations to settle, then reads rects and computed styles.
2. It keeps only the visible variant per element: `display` not `none`, `visibility` not `hidden`, rect `width` and `height` above zero.
3. A small hand-curated `role-map.json` maps each surviving node (by image source, text or position) to a semantic name such as `heroBrideName`.
4. `gen-tokens.ts` emits `stage-tokens.generated.css` and the element map table from the JSON.

---

## 7. Motion (GSAP)

CSS default is the finished resting state. Hidden starting states exist only when motion is allowed.

```css
@media (prefers-reduced-motion: no-preference) {
  [data-motion='pending'] [data-animate] { opacity: 0; }
}
```

```html
<noscript>
  <style>
    [data-motion='pending'] [data-animate] { opacity: 1 !important; }
  </style>
</noscript>
```

```typescript
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// One call per section, so each section animates when it scrolls in.
// The server renders each section with data-motion='pending' as a constant prop;
// only this hook changes it, so React never re-applies it.
export function useSectionMotion(root: React.RefObject<HTMLElement>) {
  useGSAP(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(el.querySelectorAll('[data-animate]'), {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });

      el.dataset.motion = 'active'; // same tick as the from-tween, so no flash

      el.querySelectorAll<HTMLElement>('[data-parallax]').forEach((layer) => {
        const f = Number(layer.dataset.parallax); // fraction of scroll distance
        const dist = window.innerHeight + el.offsetHeight;
        gsap.fromTo(
          layer,
          { y: -f * dist / 2 },
          {
            y: f * dist / 2,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    });

    // reduced motion: nothing runs and nothing is hidden, so content is already at rest
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, { scope: root });
}
```

- **Parallax factors**: sky 0.05, sun 0.10, clouds 0.20, Bodhi canopy 0.42. Each parallax layer is oversized by `f * dist / 2` top and bottom so no edge is revealed.
- Frame 0 offsets are set only through GSAP. Nothing in CSS offsets an element.
- `ScrollTrigger.refresh()` runs after fonts, and again after the hero images load.
- GSAP is free for commercial use under its current license; confirm the terms at `gsap.com` before launch.

---

## 8. Flags: Two Tiers, Fail Closed

- **Tier 1 (ships, always the default)**: 6–8 vertical image slices, each a CSS keyframe with staggered `rotateY`, `skewY` and `transform-origin`. Zero WebGL.
- **Tier 2 (optional Sprint 5, ships only if it passes device testing)**: Dynamic import, enabled only when every signal passes: WebGL2 context created, `navigator.deviceMemory` defined and at least 4, `hardwareConcurrency` at least 6, `connection.saveData` not set, reduced-motion off, and a 500 ms frame-rate probe at or above 50 fps.
- Missing signals mean Tier 1. iOS therefore stays on Tier 1 unless a tested allowlist is added. No user-agent sniffing for WhatsApp.

---

## 9. Audio

- The pill is the only guaranteed start. It renders at page root as a sibling of the stage, never inside it: container containment makes the stage the anchor for fixed children, so inside it the pill would stop sticking to the viewport. It is a real `<button>` with `aria-pressed`, a visible label, and a pulsing ring.
- Playback may also start on the first `pointerup` anywhere when `audio.startOnFirstTap` is true. `scroll` and `touchstart` are not used because they do not grant user activation.
- Pause on `visibilitychange` hidden. Remember mute for the session. The EQ bars animate only while playing.

---

## 10. Countdown

- Target is `events[0].startISO`, which carries a `+05:30` offset, so it is correct on any device clock zone.
- The server renders a placeholder with fixed dimensions (no layout shift). The client ticks after mount, aligned to second boundaries, and pauses while the tab is hidden.
- After the start time the dials switch to a *Today* or *Celebrated* state. The state is derived, never stored.

---

## 11. Data Contract

```typescript
export type TemplateId =
  | '07_unforgettable_buddha'
  | '08_unforgettable_buddhist_wedding'
  | '09_unforgettable_buddha_react';

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface WeddingInviteData {
  slug: string;
  templateId: TemplateId;
  locale: 'en' | 'hi' | 'mr';
  timeZone: 'Asia/Kolkata';
  couple: {
    bride: { name: string; parents?: string; titles?: string; bio?: string; photo?: ImageAsset; };
    groom: { name: string; parents?: string; titles?: string; bio?: string; photo?: ImageAsset; };
    connector?: string;
    note?: string;
    portrait: ImageAsset;
  };
  shloka?: { text: string; translation?: string; };
  gallery: ImageAsset[];
  events: Array<{
    id: string;
    title: string;
    startISO: string; // e.g. 2026-12-04T11:00:00+05:30
    endISO?: string;
    venueName: string;
    venueAddress: string;
    mapUrl?: string;
    lat?: number;
    lng?: number;
    badges?: Array<'weather' | 'valet' | 'attire'>;
  }>;
  rsvp: { kind: 'whatsapp' | 'phone' | 'url'; target: string; label?: string; };
  audio?: { title: string; src: string; startOnFirstTap?: boolean; };
  share: { ogImage: string; title?: string; description?: string; };
}

// Derived at render time, never stored:
// getLifecycle(data, now): 'UPCOMING' | 'WEDDING_DAY' | 'ARCHIVED'
// Day and time labels come from Intl.DateTimeFormat with timeZone: 'Asia/Kolkata'.
```

---

## 12. Images, Fonts, Sharing

- **Images**: Commit lossless masters. Use `next/image` with `images.formats` set to AVIF and WebP and an explicit qualities list, so there is exactly one encode. Pre-encoded lossy files are not fed back through the optimizer. Only the true LCP image gets `priority`, and it is chosen from a Lighthouse run, not guessed.
- **Fonts**: `next/font/local` for *Miofarin* and *Brother Signature*, `display: 'swap'`, preloaded. *Noto Serif Devanagari* covers Hindi and Marathi text. Devanagari names lose the signature script look, so Sprint 0 records a design decision on a substitute display face.
- **Licensing**: Confirm both custom fonts allow web embedding and redistribution inside a sold template before Sprint 2. If not, pick replacements now.
- **Sharing**: `metadataBase` is set once in `layout.tsx`. `generateMetadata` loads data by slug and returns title, description and a 1200×630 JPEG under 300 KB, with a versioned filename because WhatsApp caches previews hard. Verify with a real share to a test chat.

---

## 13. Parity Protocol (What the Gate Actually Measures)

### Setup (Identical for Both Templates)
- Same fixture (`content.default.json`), same fonts loaded (`document.fonts.ready`), same viewport, same frozen clock (`page.clock`), same masks over the countdown dials and audio EQ.
- Playwright runs in the pinned Playwright Docker image locally and in CI, because Windows and Linux render text differently and baselines must come from one environment.
- T09 is captured with `reducedMotion: 'reduce'` so it is at rest. T08 is captured after the scroll-through settle at `scrollY = 0`.

### Metrics & Quality Gates
| Gate | Rule |
| :--- | :--- |
| **Section pixel diff** | `pixelmatch` threshold: `0.1`, anti-aliasing ignored, mismatched pixels at most **0.5%** of each cropped section |
| **Section crops** | Ranges come from the extraction JSON, each aligned to its section top |
| **Rect tolerance** | **±1 px** on `x, y, width, height` for every mapped element |
| **Primary viewports** | **393×852**, **810×1080**, **1536×864**, both gates enforced |
| **Parallax** | Rect checks at scroll offsets 0, 50% and 100% of each section, within the expected factor **±1 px** |

### Smoke Viewports (360, 412, 1280, 1920) are Gated on Invariants, Not on T08:
- No horizontal scroll.
- No text box intersecting another text box.
- Every card and text box fully inside its section.
- CLS under 0.05.
- Screenshots attached to the PR for human review. The T08 diff is reported but advisory.
- **Stress Fixture**: The same invariants run on `content.stress.json`.

---

## 14. Performance Budgets (Provisional Until Measured in Sprint 3.5)

| Metric | Target | Measured With |
| :--- | :--- | :--- |
| **LCP on throttled 4G, mid-range Android profile** | under 2.2 s | Lighthouse CI |
| **First-load JS (gzip)** | under 135 KB total, under 25 KB first-party | Next bundle analyzer |
| **Above-the-fold image bytes** | under 600 KB | Lighthouse network log |
| **All assets after full scroll** | under 3.2 MB | Lighthouse network log |
| **CLS** | under 0.05 | Lighthouse CI |
| **Animation** | no long tasks over 50 ms during scroll | Chrome tracing on a real mid-range Android |

*The Next runtime and GSAP sizes above are estimates. If the analyzer disagrees, the target is revisited in Sprint 3.5, not silently ignored.*

---

## 15. Accessibility

- Meaningful images get alt text from the data. Decorative art uses `alt=''`.
- Gold-on-dark and sandstone-on-parchment text must meet WCAG AA contrast, checked per token in CI.
- Audio pill has an accessible name and state. All interactive elements show focus.
- Reduced motion shows the finished page with no animation.
- Headings follow a single logical order.

---

## 16. Risk Register

| Risk | Caught By |
| :--- | :--- |
| **Wrong settled rects captured (in-flight animation)** | Scroll-through extractor plus rect gate |
| **Text overlap with long names** | Stress fixture invariants |
| **Font swap shifts layout** | CLS gate, `next/font` preload |
| **WebView lacks container query units** | `vw` fallback block, tested on an old Android WebView |
| **Low-end device stutter** | Tier 1 default, real-device trace |
| **WhatsApp shows no preview** | Real share test, JPEG size and absolute URL |
| **Baseline drift between machines** | Single pinned Playwright image |
| **Font license blocks sale** | Sprint 0 licensing check |
| **Bundle bloat** | Analyzer check in CI |

---

## 17. Sprint Runbook with Exit Criteria

### 🏃 Sprint 0: Decisions
- Pin Next.js, Playwright and GSAP versions. Confirm the Next image settings used here (formats, qualities) exist in the pinned version. Confirm font licenses. Choose the Devanagari display face. Freeze `content.default.json` and `content.stress.json`. Set up the Playwright Docker image and CI skeleton.
- **Exit**: All items recorded in the repo, CI runs an empty test.

### 🏃 Sprint 1: Extraction
- Register the template ID. Scaffold the directory. Build and run the extractor at 393, 810, 1536. Generate tokens and the element map.
- **Exit**: Settled JSON committed, element map reviewed by hand once, spot-checked against T08 DevTools, and T08's parallax offset at `scrollY = 0` measured and recorded.

### 🏃 Sprint 2: Static Placement (No Motion)
- Hero, Countdown, Meet Couple, Gallery, Timeline, Location, Footer, audio pill, in that order. Use the generated tokens only.
- **Exit per section**: Its parity test passes before the next section starts.

### 🏃 Sprint 3: Parity Gate
- Run full section diffs, rect checks, stress invariants and smoke invariants.
- **Exit**: All gates green in CI on the pinned image.

### 🏃 Sprint 3.5: Performance and Device Pass
- Lighthouse CI, bundle analyzer, real mid-range Android trace in a WhatsApp link, OG share test, old-WebView check.
- **Exit**: Budgets met or revised with written reasons.

### 🏃 Sprint 4: Motion
- Frame 0 entrances, parallax, bell sway, EQ bars, no-flash behavior, reduced-motion path.
- **Exit**: Parallax checks green, no flash on a slow-3G reload, reduced motion shows finished page.

### 🏃 Sprint 5 (Optional): Tier 2 WebGL Cloth
- Ship only if it holds 55+ fps on the target test devices and never regresses Tier 1.
- **Exit**: Feature flag on, or the sprint is dropped with no impact on release.

---

## 18. Definition of Done

- All CI gates green on the pinned image: parity, invariants, accessibility, budgets.
- Stress fixture renders with no overlap or overflow.
- A real share to WhatsApp shows the correct card.
- Both custom fonts are licensed for the intended use.
- Reduced motion, no-JS and slow-network paths were checked by hand once.
- No merge without the visual and invariant suites passing.
