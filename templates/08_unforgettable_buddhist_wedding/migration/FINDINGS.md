# Findings & Intrinsic Runtime Asynchrony (Track 0 Calibration)

## 1. Intrinsic Dynamic Elements in Untouched Site
During Track 0 calibration (running the exact same untouched site twice on `http://localhost:8099/index.html`):
1. **Live Countdown Timer (`content-manager.js`)**:
   - `setInterval(updateDigits, 1000)` continuously runs and changes the countdown digit text and span widths in real time. Between Run 1 and Run 2, real wall-clock seconds pass, causing digit changes (`inline-size` and text differences).
2. **Infinite Hanging Bell CSS Sway (`framer.CmgPE89d.mjs` / CSS keyframe loop)**:
   - The hanging bells have an active continuous sway animation (`rotate(2.57deg)` vs `rotate(2.60deg)`).
3. **Timestamped Polling (`content-manager.js`)**:
   - `fetch('./content.json?_ts=' + Date.now())` and `_poll` URLs differ by query timestamp.
4. **Framer React Invariant #405**:
   - An expected benign warning from Framer React runtime when running outside framer.com editor context.

## 2. Mitigation for Machine Calibration
To achieve deterministic machine diffs:
- Freeze Date.now() / mock time in `addInitScript` during verification captures so countdown timer remains on identical second.
- Pause continuous CSS keyframe animations (like hanging bell sways) during snapshot capture.
- Normalize URL timestamps (`_ts`, `_poll`, `loadStart`).
