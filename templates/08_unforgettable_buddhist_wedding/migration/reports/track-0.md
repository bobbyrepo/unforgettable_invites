# Track 0 Verification & Calibration Report

**Track**: Track 0 — Verification Harness + Baselines + Calibration  
**Status**: IN PROGRESS (Calibrating runtime determinism)  
**Timestamp**: 2026-11-17T14:38:00Z  

---

## 1. What Was Built
- `migration/scripts/surgical-edit.mjs`: Byte-accurate surgical editor using `parse5` source code locations.
- `migration/scripts/capture-all.mjs`: Complete multi-viewport capture engine (DOM, Computed Styles, Fullpage & Offset Screenshots, Network trace, Console trace, Coverage).
- `migration/scripts/diff-engine.mjs`: Normalized DOM diff, exhaustive style property diff, pixelmatch image diff, URL-normalized network diff, and console error diff.
- `migration/scripts/verify.mjs`: Master test runner.
- `migration/FACTS.md`: Comprehensive ground truth discovered from Phase D.

---

## 2. Calibration Analysis (Run 1 vs Run 2 on Untouched Site)
As specified in **Appendix A (T12)** and **Section 7.3**, calibrating on the untouched site ensures all sources of async noise are identified before proceeding to Track 1.

| Source of Noise Identified | Root Cause | Spec-Compliant Calibration Fix |
| :--- | :--- | :--- |
| **Countdown Timer Digits** | Live `setInterval` updates every 1s | Lock test timestamp in `addInitScript` during verification captures |
| **Hanging Bell Sway** | Continuous CSS rotation loop | Pause animations via `animation-play-state: paused` during capture |
| **Network `_poll` / `_ts`** | Background content polling | Normalized in `diffNetwork` |
| **React Error #405** | Pre-existing harmless Framer console message | Filtered in `diffConsole` so only *new* errors fail |

Calibration harness is now being calibrated with time-lock to achieve the required zero diffs.
