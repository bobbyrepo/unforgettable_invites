---
name: wedding-theme-transformer
description: >-
  Comprehensive end-to-end framework and Standard Operating Procedure (SOP) for analyzing digital 
  wedding invitation templates, auditing codebase images & DOM placement, conducting structured 
  interactive theme discovery, and crafting precise AI image generation prompts (ChatGPT/DALL-E 3, 
  FLUX.1, Midjourney, Photoshop Generative Expand) with exact dimensions and 1-to-1 file replacement mapping.
---

# Wedding Invitation Template Theme Transformer & AI Image SOP

This skill is the canonical runbook for taking any existing digital wedding invitation template (e.g. Ram Mandir, Radha Krishna, Meenakshi, Udaipur Palace, Bodh Gaya Buddhist) and seamlessly transforming its entire visual identity, cultural theme, and artwork into a brand-new masterpiece without breaking code, responsive breakpoints, or layout coordinates.

---

## 🏗️ 4-Phase Core Architecture Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Codebase & Image Deep Audit                                        │
│ • Run automated image dimension and format scanner                          │
│ • Deconstruct DOM placement, z-index layers, and CSS absolute coordinates   │
│ • Inventory transparency requirements (PNG/WebP with alpha channel)         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Visual Element Deconstruction                                      │
│ • Foreground: Walkway/carpet perspective, couple placement (from behind)   │
│ • Midground: Temple sanctum, entrance gate, balustrades, flower basins     │
│ • Background: Central spire / gopuram, sacred trees, mountain horizon       │
│ • Sky / Negative Space: Transparent cutouts for WebGL particle physics      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Structured Interactive Theme Discovery (The 7-Step User Interview) │
│ • Cultural / Architectural Anchor (Bodh Gaya, Ayodhya, Madurai, Jaipur)     │
│ • Apex Spire & Flag/Crest options (Silk mantra banners vs Kalash)           │
│ • Floral & Pathway Décor (White marble lotus basins vs Brass Urlis)         │
│ • Couple Attire & Color Palette (Banarasi saree vs Raw-silk sherwani)       │
│ • Sky Particles & Fauna (Drifting Bodhi leaves, lotus petals, cranes)       │
│ • Lower Arch Framing (Carved Torana arch enclosing countdown clock)         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Model-Specific Prompt Engineering & Drop-in Integration            │
│ • ChatGPT (DALL·E 3 / GPT-4o) 9:16 vertical + reference image protocol      │
│ • FLUX.1 (schnell/dev) widescreen crisp architectural prompt protocol       │
│ • Photoshop / Canva Generative Expand prompt for ultra-tall scroll banners  │
│ • Flat orthogonal 2D texture prompt for 3D WebGL cloth simulation flags     │
│ • 1-to-1 file renaming, cache-busting, and verification                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Phase 1: Codebase & Image Deep Audit (Technical Inspection)

Before generating any AI prompts or touching artwork, perform a rigorous audit of the template.

### 1. Automated Image Scanner
Run the bundled audit script against the target template folder:
```powershell
node "<path-to-skill>/scripts/audit_template_images.js" "E:/Unforgettable Invites/Template Backup/08_unforgettable_buddhist_wedding"
```
This utility:
1. Inspects image binary headers (`PNG`, `WebP VP8X`, `JPEG`, `SVG`) to extract exact pixel dimensions (`width × height`).
2. Scans `index.html` and stylesheets to determine where each image is bound.
3. Automatically classifies each image into its architectural role.

### 2. The 5 Core Template Image Roles

| Role | Typical Dimensions | Aspect Ratio | Target Placement & Function |
| :--- | :---: | :---: | :--- |
| **1. Master Vertical Hero** | `1515 × 3526 px` | `1:2.33` (`9:21`) | Opening screen viewport. Must feature transparent sky at top 30% for particle shaders and empty negative space at bottom 40% for the countdown clock. |
| **2. Continuous Scroll Backdrop** | `1515 × 9148 px` (or `1515 × 2500 px` tile) | `1:6.04` | Extends behind all timeline ceremony cards. Must have vertical filigree borders with clean center negative space. |
| **3. Social Preview Card (OG)** | `1200 × 630 px` | `16:9` | WhatsApp, Instagram, Telegram link unfurling preview card. |
| **4. 3D Cloth Simulation Texture** | `390 × 1496 px` | `1:3.84` | Completely flat 2D orthogonal graphic loaded into WebGL shaders for dynamic waving cloth physics. |
| **5. High-Res Sanctum Inset** | `1024 × 1024 px` | `1:1` | Close-up replacement for central sanctum deity / Buddha statue to avoid low-pixel blur. |

---

## 🎨 Phase 2: Visual Composition & Layer Deconstruction

Every digital wedding invitation template consists of distinct visual planes. When looking at any reference image or template, deconstruct it into these specific zones:

```
┌────────────────────────────────────────────────────────────┐
│ ZONE 1: Apex Sky & Spire (Top 0% – 30%)                    │
│ • Transparent cutout sky for WebGL particles / flying birds│
│ • Central architectural pinnacle (spire, gopuram, shikhara)│
│ • Fluttering silk prayer streamer flags / kalash           │
├────────────────────────────────────────────────────────────┤
│ ZONE 2: Grand Sanctum & Procession (Middle 30% – 60%)      │
│ • Central sanctum with seated deity / divine motif         │
│ • Bride & Groom seen from behind walking away hand-in-hand │
│ • Symmetrical grand stairs, balustrades, butter lamps      │
│ • Flanking water basins / urns with blooming lotuses       │
├────────────────────────────────────────────────────────────┤
│ ZONE 3: Archway & Interactive Floor (Bottom 60% – 100%)    │
│ • Carved Torana or scalloped architectural arch            │
│ • Ceremonial carpet / stone walkway extending to viewer    │
│ • 100% clean flat negative cream space for countdown timer │
└────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> **The Secret of Ultra-Tall Scroll Images:**
> AI models (ChatGPT, Midjourney, FLUX) CANNOT generate a 9,000-pixel tall image in one shot without squishing the architecture into a 200-pixel blurry smudge.
> **The Industry Solution:** Generate the top architectural scene in standard vertical resolution (`1024 × 1792`), then extend the floor downwards into a plain cream arch using **Generative Expand** or **Photoshop Outpainting**.

---

## 💬 Phase 3: The Structured Interactive Theme Discovery Interview (7-Step SOP)

Never make assumptions about what the client or user wants. Always present a structured, multi-choice interview before crafting prompts:

### Step 1: Cultural & Architectural Anchor
*Ask the user:*
> "Which cultural or architectural world should this invitation inhabit?"
- **Option A (Bodh Gaya Buddhist):** Ancient stepped pyramidal sandstone spire of Mahabodhi Temple, Bodhi tree branches, serene morning mist.
- **Option B (Vedic Ayodhya Mandir):** Carved pink sandstone shikhara, ornate pillars, grand golden kalash.
- **Option C (South Indian Heritage / Madurai):** Majestic Dravidian Gopuram with multi-tiered sculpted deities, temple pond with floating brass urlis.
- **Option D (Royal Rajputana Palace / Udaipur):** White marble jharokhas, scalloped arches, peacock gardens, Pichola lake backdrop.
- **Option E (Modern Pastel Floral Elegance):** Wisteria arches, blush pink roses, gilded Victorian ironwork, dreamy starlight.

### Step 2: Temple Landmark & Sacred Atmosphere
*Ask the user:*
> "What time of day and spiritual mood should the lighting convey?"
- **Option A (Golden Hour Sunrise):** Soft amber and saffron sun rays, morning dew, gentle atmospheric mist.
- **Option B (Twilight / Sandhya Aarti):** Deep indigo and crimson sky, thousands of glowing oil lamps (diyas), sacred temple fire glow.
- **Option C (Noon Divine Radiance):** Crisp clear cerulean blue sky, brilliant white marble reflections, sharp architectural shadows.

### Step 3: Apex Spire & Flag / Crest Elements
*Ask the user:*
> "What crowns the temple or building pinnacle?"
- **Option A:** Tall vertical white and golden silk prayer streamer flags fluttering in the breeze, inscribed with chanting mantras.
- **Option B:** Saffron swallowtail flag (*Dhwaja*) waving proudly with a sacred emblem (e.g. Om, Trishul, Surya).
- **Option C:** Pure golden Kalash and Amalas with royal brass finials and temple spires.

### Step 4: Flora & Walkway Perimeter Décor
*Ask the user:*
> "What lines the walkway on both sides of the couple?"
- **Option A:** Carved white marble basins filled with fresh pink and white blooming lotus flowers and floating stone butter lamps.
- **Option B:** Large antique brass *urlis* with orange marigolds, red roses, and floating tea-light candles.
- **Option C:** Royal palm trees, jasmine floral swags, and stone statues of elephants bearing lotus garlands.

### Step 5: Couple Attire & Styling
*Ask the user:*
> "What are the bride and groom wearing (seen strictly from behind walking up the steps)?"
- **Option A:** Bride in royal crimson Banarasi silk saree with gold zari lotus borders; Groom in tailored ivory sherwani with saffron silk stole.
- **Option B:** Bride in pastel blush-pink lehenga with heavy champagne gold zardozi work; Groom in cream raw-silk bandhgala.
- **Option C:** Bride in traditional South Indian Kanjivaram red-and-gold saree with temple jewellery; Groom in pure white silk veshti and angavastram with gold border.

### Step 6: Sky Atmosphere & Particle Shaders
*Ask the user:*
> "What floating particles and animated creatures fly in the background sky?"
- **Option A:** Drifting translucent golden Bodhi leaves (*Ficus religiosa*) and floating lotus petals with soaring white cranes.
- **Option B:** Golden stardust embers, falling orange marigold petals, and flocking pigeons.
- **Option C:** Soft flower showers (*Pushpavrishti*) with gentle cloud drift.

### Step 7: Lower Arch & Countdown Framing
*Ask the user:*
> "How should the live countdown clock area be framed at the bottom?"
- **Option A:** Carved sandstone Buddhist Torana archway with an ivory ceremonial lotus runner carpet.
- **Option B:** Royal scalloped Mughal/Rajput arch with gold leaf filigree borders.
- **Option C:** Garland of white tuberose and mogra flowers framing a solid parchment negative space.

---

## 🛠️ Phase 4: Model-Specific AI Prompt Engineering Protocols

Once the user selects their design choices, output copy-paste ready prompts strictly adhering to these formulas:

### 1. ChatGPT (DALL·E 3 / GPT-4o) Prompt Formula
DALL·E 3 thrives on descriptive, atmospheric natural language. Always specify:
1. Composition aspect ratio (`vertical 9:16 portrait`).
2. Exact camera perspective (symmetrical frontal eye-level view).
3. Couple viewed **strictly from behind walking away** (crucial for wedding invitations so anyone can imagine themselves as the couple).
4. Artistic medium: `"Royal gouache watercolor painting style on textured cream parchment paper"`.
5. Transparent sky guidance: `"clean uniform sky at top for easy transparency cutouts"`.

```text
[Aspect Ratio & Medium]
Vertical 9:16 royal Indian [Theme] wedding invitation background painting.

[Background Architecture]
At the top center stands [Landmark Architecture] under [Atmosphere/Lighting]. Flanking the pinnacle are [Apex Spire Elements]. In the distance, [Misty Horizon/Trees].

[Center Subject - Couple]
In the center, a bride and groom are seen strictly from behind, walking away together hand-in-hand up the grand ancient stone staircase toward the inner sanctum.
- Bride: [Detailed Saree/Lehenga Attire, Fabrics, Jewelry]
- Groom: [Detailed Sherwani/Kurta Attire, Stole, Fabrics]

[Perimeter Décor]
The grand staircase is flanked symmetrically by [Balustrades, Floral Urns, Butter Lamps/Diyas].

[Foreground & Lower Frame]
The lower portion transitions into [Carved Archway] framing an open, empty, clean negative space over an [Ivory/Sandstone Carpet] designed to host a digital countdown timer.

[Aesthetic Finishing]
Royal gouache watercolor painting style on aged cream parchment paper texture, soft golden hour lighting, symmetrical architectural perspective, ultra-detailed craftsmanship.
```

### 2. Accompanying Reference Image Prompt (For ChatGPT)
When the user attaches an existing template hero image:
```text
Use the attached image as a strict reference for composition, camera angle, perspective, and royal gouache watercolor painting style.

Create a brand new painting transforming this into a royal Indian [Theme] wedding:
1. Replace the background temple with [New Landmark/Architecture].
2. Flank the spire with [New Flag/Crest Elements].
3. Keep the bride and groom seen from behind walking away up the grand stairs: [New Bride Attire] and [New Groom Attire].
4. Replace the perimeter decor with [New Floral Urns & Lamps].
5. Lower frame: [New Archway & Carpet].
Maintain the same soft watercolor brushwork, golden hour sunrise mist, and aged cream parchment texture.
```

### 3. FLUX.1 (schnell / dev) Prompt Formula
FLUX excels at rigid architectural geometry, stone relief, and symmetry.
- **Recommended Settings:** Width `1344`, Height `768` (16:9) or Width `896`, Height `1536` (9:16 vertical), Steps `4` (schnell) or `28` (dev), Guidance Scale `3.5`.
- **Syntax:** Dense comma-separated descriptors with style weight `(royal wedding invitation background:1.2)`, ending with `--ar 9:16 --style raw`.

### 4. Generative Expand / Outpainting Prompt (Photoshop / Canva / Midjourney)
To seamlessly stretch the floor downwards into the countdown clock space without squishing details:
```text
Symmetrical carved [Sandstone/Marble] [Torana/Scalloped] archway enclosing a plain empty cream parchment negative space, flanked on left and right by vertical golden [Lotus/Floral] vine borders, seamless continuation of the stone floor and ceremonial carpet.
```

### 5. Flat 2D Orthogonal Silk Banner Prompt (For 3D WebGL Cloth Shaders)
For physics-simulated flags, **never** generate 3D folds in the prompt:
```text
A perfectly flat, straight-on 2D graphic design of a sacred [Buddhist/Vedic/Royal] silk prayer banner. Frontal orthogonal view, zero perspective tilt, zero 3D cloth folds or wrinkles, transparent background.

1. LAYOUT & SHAPE: A clean vertical rectangular silk banner texture with a triangular swallowtail bottom edge adorned with golden hanging tassels.
2. EMBLEM & TEXT: In the upper section, sacred calligraphic [Mantra/Inscriptions] vertically arranged in glowing rich gold ink. At the bottom, a perfectly symmetrical blooming [Lotus/Emblem].
3. BORDERS: Intricate golden brocade geometric border running down both vertical edges.
4. MATERIAL & COLOR: Warm ivory and rich gold silk fabric texture, clean vector-sharp edges, perfectly flat and uncreased for 3D physics rendering.
```

---

## 🚀 Phase 5: Drop-in Replacement & Codebase Integration

Once the user generates the artwork, follow these exact integration rules:

1. **Format & Resolution Match:**
   - Always export in WebP or PNG matching the exact native dimensions audited in Phase 1.
2. **File Renaming & Drop-in:**
   - Save the file directly with the exact hash/name required by the template (e.g., `images/lKVzZvE9zjHal1zLmfO4koCjo.webp`).
3. **Alpha Channel / Sky Cutout:**
   - If the template features an animated sky or falling particle canvas behind the temple, remove the background sky from the hero image using remove.bg, Photoshop, or transparent cutout tools.
4. **CSS Calibration & Verification:**
   - Adjust `--flag-*-x`, `--flag-*-y`, and `--flag-*-scale` if flags were repositioned.
   - Run local server test: `http://localhost:5050/templates/<template_folder>/index.html` to verify HTTP 200 and visual parity.

---

## 🗂️ Complete File & Path Reference

* **Audit Script:** [`scripts/audit_template_images.js`](./scripts/audit_template_images.js)
* **Master Templates Directory:** `E:/Unforgettable Invites/Web_Templates/templates/`
* **Template Backups:** `E:/Unforgettable Invites/Template Backup/`
* **Design Assets Vault:** `E:/Unforgettable Invites/Design_Assets_Vault/`
