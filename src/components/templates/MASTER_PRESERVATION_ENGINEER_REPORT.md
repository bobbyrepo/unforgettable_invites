# TEMPLATE PRESERVATION & CSS ANALYSIS REPORT
## High-Fidelity Extraction for Template 07 (Ram Mandir) and Template 08 (Buddhist Wedding)
**Engineer:** Template Analysis & CSS Preservation Engineer  
**Scope:** Architectural preservation, 3D transform preservation, responsive breakpoint parity, and React DOM conversion mapping.  
**Strict Safety Enforcement:** `E:\Unforgettable_Invites\Template Backup` remained 100% untouched and pristine.

---

## 1. Executive Summary & Component Breakdown

Both Template 07 and Template 08 are based on a luxury, mobile-first, vertical storybook wedding invitation system designed originally in Framer. They employ a **multi-tier depth illusion (2.5D Parallax & WebGL Shaders)** layered on an ultra-long continuous ceremonial parchment canvas.

### The 7 Core Architectural Layers (Z-Index Stacking Matrix)
| Layer | DOM Element / Class | Z-Index | Purpose & Visual Anchor |
| :--- | :--- | :--- | :--- |
| **Layer 0** | `Sky Background` (`.framer-b8pafc`) | `-1` / `1` | Sunrise mist sky canvas (height 802px, top -1px) |
| **Layer 1** | `Sun` (`.framer-k4m9kq` / `.framer-1uwk8pz`) | `2` / `6` | Sacred radiant sun disc (`translateY(688px) scale(1.5)`) |
| **Layer 2** | `Mountain` (`.framer-cddieh`) | `3` / `5` | Misty mountain ridgeline backdrop |
| **Layer 3** | `Cloud` (`.framer-6ca8d0`) | `4` / `6` | Atmospheric cloud layer (`translateY(864px)`) |
| **Layer 4** | `Trees` (`.framer-trees` - T08 only) | `7` | Sacred Bodhi tree canopy (`top: 600px`, parallax speed `0.42`) |
| **Layer 5** | `Waving Flags` (T07 & T08) | `9` (T07) / `1-4` (T08) | Real-time waving flags positioned behind the foreground stone shikhar |
| **Layer 6** | `Temple Gopuram Hero` (`.framer-13lghix`, `.framer-hmdytf`) | `9` / `10` | 100% transparent sky cutout gopuram (`lKVzZvE9zjHal1zLmfO4koCjo.webp`) |
| **Layer 7** | `Interactive UI & Shloka` | `20` | Sacred Shloka, Couple Names, Timeline Cards, Audio Controller |

---

## 2. Responsive Breakpoint Matrix (1920px down to <=359.98px)

Framer generates 15 distinct media query bands that govern viewport layouts via utility hide classes:

```css
@media(min-width: 1920px){.hidden-flz1ju{display:none!important}}
@media(min-width: 1728px) and (max-width: 1919.98px){.hidden-vlymnr{display:none!important}}
@media(min-width: 1559px) and (max-width: 1727.98px){.hidden-bsay70{display:none!important}}
@media(min-width: 1349px) and (max-width: 1558.98px){.hidden-72rtr7{display:none!important}}
@media(min-width: 1280px) and (max-width: 1348.98px){.hidden-1b8a3mn{display:none!important}}
@media(min-width: 960px) and (max-width: 1279.98px){.hidden-1tc0fsl{display:none!important}}
@media(min-width: 834px) and (max-width: 959.98px){.hidden-k2tod6{display:none!important}}
@media(min-width: 768px) and (max-width: 833.98px){.hidden-11v2ks5{display:none!important}}
@media(min-width: 430px) and (max-width: 767.98px){.hidden-sdmwty{display:none!important}}
@media(min-width: 412px) and (max-width: 429.98px){.hidden-1kglzlv{display:none!important}}
@media(min-width: 393px) and (max-width: 411.98px){.hidden-zeltxf{display:none!important}}
@media(min-width: 390px) and (max-width: 392.98px){.hidden-1cx7v4z{display:none!important}}
@media(min-width: 375px) and (max-width: 389.98px){.hidden-1tqqkff{display:none!important}}
@media(min-width: 360px) and (max-width: 374.98px){.hidden-7902is{display:none!important}}
@media(max-width: 359.98px){.hidden-1kw8tgm{display:none!important}}
```

### Viewport Master Tree Containers:
- **Desktop (Main):** `.framer-kmaf13` (hidden on small viewports by `hidden-sdmwty`, `hidden-zeltxf`, `hidden-1cx7v4z`, `hidden-7902is`, `hidden-1kw8tgm`, `hidden-1kglzlv`, `hidden-k2tod6`, `hidden-1tqqkff`, `hidden-11v2ks5`, `hidden-1tc0fsl`).
- **Mobile (393px base):** `.framer-rweuzc` (hidden on desktop viewports by `hidden-72rtr7`, `hidden-1b8a3mn`, `hidden-bsay70`, `hidden-flz1ju`, `hidden-vlymnr`, `hidden-k2tod6`, `hidden-11v2ks5`, `hidden-1tc0fsl`).
- **Tablet (810px base):** `.framer-1uvujcp` (hidden on small and large screens).

---

## 3. Deep Extraction of Required Critical Elements

### A. Temple Gopuram & Backdrop Layers
- **Hero Artwork Cutout:** `images/lKVzZvE9zjHal1zLmfO4koCjo.webp` (1515 × 3526 px)
  - Top 30% shikhar has an absolute alpha-channel cutout allowing the waving flags, birds, and rising sun to sit *behind* the temple stone spire while the stone arch sits *in front*.
  - Desktop Positioning:
    - Base: `.framer-SNM3S .framer-hmdytf { z-index: 9; flex: none; width: 1515px; height: 3574px; position: absolute; top: calc(47.7016% - 1787px); right: 0; overflow: visible; }`
    - Inline Transform: `will-change: transform; opacity: 1; transform: translateY(211px);`
    - Breakpoint overrides:
      - `1920px+`: `height: 4500px; width: unset; top: 566px; left: 0; right: 0;`
      - `1728px - 1919.98px`: `height: 4500px; width: unset; top: 376px; left: 0; right: 0;`
      - `1559px - 1727.98px`: `height: 3630px; left: calc(50.0321% - 791.5px); right: unset; width: 1583px; top: 496px;`
      - `1280px - 1348.98px`: `width: 1282px; top: calc(42.4781% - 1787px); right: -1px;`
  - Mobile Positioning:
    - Base: `.framer-SNM3S .framer-13lghix, .framer-SNM3S .framer-1sm6may { aspect-ratio: 0.274386; z-index: 9; flex: none; height: auto; position: absolute; top: 348px; left: -1px; right: -1px; overflow: visible; }`
    - Inline Transform: `will-change: transform; opacity: 1; transform: translateY(375px);`
    - In Template 08: `top: 360px !important;` with background image wrapper at `z-index: 5 !important;`.

### B. Floating Waving Flags
#### 1. Template 07 (Single Saffron Dhwaja Flag atop Temple Shikhar)
- **Mobile Container:** `.framer-r25czy-container`
  - CSS rule: `z-index: 9; flex: none; width: 13%; height: auto; position: absolute; top: 317px; left: 52%; transform: translate(-50%);`
  - Inline style: `will-change: transform; opacity: 0.2; transform: translateX(-50%) translateY(608px) scale(0.7);`
  - Responsive overrides:
    - `430px - 767.98px`: `width: 12%; top: 313px; left: 54%;`
    - `412px - 429.98px`: `width: 12%; top: 314px; left: 54%;`
    - `393px - 411.98px`: `width: 13%; top: 314px; left: 54%;`
    - `390px - 392.98px`: `width: 12%; top: 315px; left: 54%;`
    - `375px - 389.98px`: `width: 12%; left: 53%;`
    - `360px - 374.98px`: `width: 12%; left: 54%;`
    - `<= 359.98px`: `width: 12%; left: 53%;`
- **Desktop Container:** `.framer-icwjlw-container`
  - CSS rule: `z-index: 9; flex: none; width: 8%; height: auto; position: absolute; top: 457px; left: 53%; transform: translate(-50%);`
  - Inline style: `will-change: transform; opacity: 0.2; transform: translateX(-50%) translateY(313px);`
  - Responsive overrides:
    - `1920px+`: `width: 8%; top: 489px; left: 53%;`
    - `1728px - 1919.98px`: `width: 8%; top: 502px;`
    - `1559px - 1727.98px`: `width: 8%; top: 424px; left: 53%;`
    - `1280px - 1348.98px`: `width: 8%; top: 464px; left: 53%;`
- **Tablet Container:** `.framer-1b2mwsy-container`
  - CSS rule: `z-index: 9; flex: none; width: 13%; height: auto; position: absolute; top: 307px; left: 54%; transform: translate(-50%);`
  - Inline style: `will-change: transform; opacity: 0.2; transform: translateX(-50%) translateY(608px) scale(0.7);`

#### 2. Template 08 (8 Perspective 3D Cloth Physics Walkway Flags)
- Right Walkway Flags:
  - R1: `left: 92.6%; top: 890px; scale(0.31); z-index: 4; speed: 0.6s; origin: 0% 12%;`
  - R2: `left: 88.3%; top: 945px; scale(0.26); z-index: 3; speed: 0.58s;`
  - R3: `left: 85.3%; top: 990px; scale(0.20); z-index: 2; speed: 0.56s;`
  - R4: `left: 83.1%; top: 1015px; scale(0.17); z-index: 1; speed: 0.54s;`
- Left Walkway Flags:
  - L1: `left: 23.9%; top: 890px; scale(0.31); z-index: 4; speed: 0.6s; origin: 100% 12%;`
  - L2: `left: 29.1%; top: 940px; scale(0.26); z-index: 3; speed: 0.58s;`
  - L3: `left: 33.7%; top: 990px; scale(0.20); z-index: 2; speed: 0.56s;`
  - L4: `left: 36.5%; top: 1015px; scale(0.17); z-index: 1; speed: 0.54s;`
- Wave Physics Keyframes:
  - `@keyframes flagWaveRight`: Perspective `900px`, `rotateY(-8deg to 6deg)`, `skewY(1.4deg to -1deg)`, `translateZ(4px to -2px)`
  - `@keyframes flagWaveLeft`: Inverse symmetrical physics
  - `@keyframes silkSheenMove`: Dynamic travelling light sheen overlay with `mix-blend-mode: soft-light`

### C. Sacred Shloka & Couple Name Cards
- **Ganpati / Pali Icon:** `.framer-17roagg` (`width: 47px; top: 31px; left: 50%; transform: translate(-50%) translateY(24px); z-index: 10;`)
- **Ganpati Name / Inscription:** `.framer-7e02c0` (`width: 172px; top: 100px; left: 50%; transform: translate(-50%) translateY(24px); z-index: 10;`)
- **Shri Line / Blessing Inscription:** `.framer-v89l6c` (`width: 232px; top: 165px; left: 50%; transform: translate(-50%) translateY(24px); z-index: 10;`)
- **Hero Title Couple Names:**
  - Groom (Akash / Siddharth): `.framer-s9w8r5` (Mobile `top: 730px; left: 50%;`)
  - Connector ("and" / "weds"): `.framer-o6gbb9` (Mobile `top: 765px; left: 50%; font-style: italic;`)
  - Bride (Drashti / Maya): `.framer-8a8gki` (Mobile `top: 800px; left: 50%;`)
- **Invitation Details:** `.framer-13hguly`
  - Groom Parents (`.framer-y97e79`), Bride Parents (`.framer-1c4bswb`), Invitation Line (`.framer-b8i0v8`)

### D. Event Timeline Tilting Cards (Mehndi, Haldi, Sangeet, Shaadi)
Each card has `width: 148px; aspect-ratio: 0.646883; z-index: 1; gap: 10px;` with alternating rotational tilts:
- **Card 1 (Odd: Left Column):** `.framer-1lti5mb`
  - `left: 26%; transform: translateX(-50%) translateX(-60px) translateY(50px) rotate(-10deg);`
  - Base `top: 1040px`, Overrides: 375px (`top: 940px`), 360px (`top: 970px`), <360px (`top: 880px`)
- **Card 2 (Even: Right Column):** `.framer-69gunc`
  - `left: 74%; transform: translateX(-50%) translateX(60px) translateY(50px) rotate(10deg);`
  - Base `top: 1040px`, Overrides: 375px (`top: 940px`), 360px (`top: 970px`), <360px (`top: 880px`)
- **Card 3 (Odd: Left Column):** `.framer-74gvdh`
  - `left: 26%; transform: translateX(-50%) translateX(-60px) translateY(50px) rotate(-10deg);`
  - Base `top: 1300px`, Overrides: 375px (`top: 1200px`), 360px (`top: 1230px`), <360px (`top: 1140px`)
- **Card 4 (Even: Right Column):** `.framer-1tdswmf`
  - `left: 74%; transform: translateX(-50%) translateX(60px) translateY(50px) rotate(10deg);`
  - Base `top: 1300px`, Overrides: 375px (`top: 1200px`), 360px (`top: 1230px`), <360px (`top: 1140px`)
- **Card 5 (Odd: Left Column):** `.framer-10mht0w`
  - `left: 26%; transform: translateX(-50%) translateX(-60px) translateY(50px) rotate(-10deg);`
  - Base `top: 1560px`, Overrides: 375px (`top: 1460px`), 360px (`top: 1490px`), <360px (`top: 1400px`)
- **Card 6 (Even: Right Column):** `.framer-ltqi77`
  - `left: 74%; transform: translateX(-50%) translateX(60px) translateY(50px) rotate(10deg);`
  - Base `top: 1560px`, Overrides: 375px (`top: 1460px`), 360px (`top: 1490px`), <360px (`top: 1400px`)

### E. Venue Map Cards & Interactive Buttons
- **Desktop Map Frame:** `.framer-gccew2` (`width: 1097px; height: 560px; top: 1051px; left: calc(49.7% - 548.5px); z-index: 5;`)
  - Breakpoints: `1920px+` (`top: 1301px`), `1728px` (`width: 1274px; height: 650px; top: 1214px`), `1280px` (`top: 895px`).
- **Mobile Map Container:** `.framer-7iwio1-container` (`width: 343px; height: 560px; top: 279px; left: calc(49.87% - 171.5px); z-index: 3;`)
  - Overrides: `430px` (`top: 349px`), `393px` (`top: 348px`), `390px` (`top: 339px`), `360px` (`width: 317px; top: 314px`), `<360px` (`width: 284px; height: 573px; top: 284px`).
- **Interactive Action Buttons:**
  - Google Maps: Gradient gold capsule (`#c8a45c` to `#e0aa3e`), `box-shadow: 0 4px 15px rgba(224, 170, 62, 0.3)`.
  - RSVP WhatsApp CTA: Emerald green capsule (`#25d366`), `box-shadow: 0 4px 15px rgba(37, 211, 102, 0.35)`.

### F. Ambient Audio Trigger and Equalizer Icon
- **DOM Container:** `#buddhist-audio-controller`
- **Positioning:** Fixed pill: `position: fixed; top: 60px; right: 18px; z-index: 9999;`
- **Styling:** Dark translucent glass: `background: rgba(22, 18, 14, 0.85); backdrop-filter: blur(14px); border: 1px solid rgba(246, 200, 96, 0.4); border-radius: 9999px; padding: 6px 14px 6px 10px;`
- **Circular Badge:** `#audio-icon-wrap` (`width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #fce08a 0%, #e0aa3e 100%);`)
- **Dynamic Equalizer:** `#audio-eq-bars` with 4 child spans (`.eq-bar`), pulsating smoothly with staggered animation delays (0s, 0.2s, 0.4s, 0.1s) when `.eq-playing` is active.

---

## 4. Preservation File Registry

The following preserved assets and modules were created:
1. `E:\Unforgettable_Invites\Web_Templates\src\components\templates\Template07_RamMandir\RamMandir.module.css`
2. `E:\Unforgettable_Invites\Web_Templates\src\components\templates\Template08_BuddhistWedding\BuddhistWedding.module.css`
3. `E:\Unforgettable_Invites\Web_Templates\src\components\templates\MASTER_PRESERVATION_ENGINEER_REPORT.md`
