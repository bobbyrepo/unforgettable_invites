/**
 * Visual Flag Studio & Multi-Device Responsive Positioning Controller
 * Enables on-screen drag-and-drop, scale, arrow nudging, and responsive persistence
 * across Desktop (>=1280px), Laptop (960-1279px), Tablet (768-959px), and Mobile (<768px).
 */
(function() {
    'use strict';

    const FLAG_IDS = ['r1', 'r2', 'r3', 'r4', 'l1', 'l2', 'l3', 'l4'];

    const FLAG_META = {
        r1: { label: 'R1 (Front Right)',   cls: 'buddhist-flag-right-1', defaultX: 92.6, defaultY: 890,  defaultScale: 0.31 },
        r2: { label: 'R2 (Mid-Front R)',   cls: 'buddhist-flag-right-2', defaultX: 88.3, defaultY: 945,  defaultScale: 0.26 },
        r3: { label: 'R3 (Mid-Back R)',    cls: 'buddhist-flag-right-3', defaultX: 85.3, defaultY: 990,  defaultScale: 0.20 },
        r4: { label: 'R4 (Back Right)',    cls: 'buddhist-flag-right-4', defaultX: 83.1, defaultY: 1015, defaultScale: 0.17 },
        l1: { label: 'L1 (Front Left)',    cls: 'buddhist-flag-left-1',  defaultX: 23.9, defaultY: 890,  defaultScale: 0.31 },
        l2: { label: 'L2 (Mid-Front L)',   cls: 'buddhist-flag-left-2',  defaultX: 29.1, defaultY: 940,  defaultScale: 0.26 },
        l3: { label: 'L3 (Mid-Back L)',    cls: 'buddhist-flag-left-3',  defaultX: 33.7, defaultY: 990,  defaultScale: 0.20 },
        l4: { label: 'L4 (Back Left)',     cls: 'buddhist-flag-left-4',  defaultX: 36.5, defaultY: 1015, defaultScale: 0.17 }
    };

    const BREAKPOINTS = [
        { id: 'desktop', label: '🖥️ Desktop', min: 1280, max: 99999, query: '' },
        { id: 'laptop',  label: '💻 Laptop',  min: 960,  max: 1279.98, query: '@media (min-width: 960px) and (max-width: 1279.98px)' },
        { id: 'tablet',  label: '📱 Tablet',  min: 768,  max: 959.98,  query: '@media (min-width: 768px) and (max-width: 959.98px)' },
        { id: 'mobile',  label: '📱 Mobile',  min: 0,    max: 767.98,  query: '@media (max-width: 767.98px)' }
    ];

    function detectCurrentBreakpoint() {
        const w = window.innerWidth;
        if (w >= 1280) return 'desktop';
        if (w >= 960)  return 'laptop';
        if (w >= 768)  return 'tablet';
        return 'mobile';
    }

    let activeBreakpoint = detectCurrentBreakpoint();
    let activeFlag = 'r1';
    let isPanelOpen = true;
    let dragEnabled = true;

    // Multi-device responsive state store
    window.vfsResponsiveState = {
        desktop: {},
        laptop: {},
        tablet: {},
        mobile: {}
    };

    // Initialize defaults per breakpoint
    BREAKPOINTS.forEach(bp => {
        FLAG_IDS.forEach(id => {
            const def = FLAG_META[id];
            let scaleAdj = 1.0;
            let yAdj = 0;
            if (bp.id === 'laptop') { scaleAdj = 0.92; yAdj = 0; }
            else if (bp.id === 'tablet') { scaleAdj = 0.82; yAdj = -40; }
            else if (bp.id === 'mobile') { scaleAdj = 0.58; yAdj = -310; }

            window.vfsResponsiveState[bp.id][id] = {
                x: def.defaultX,
                y: Math.round(def.defaultY + yAdj),
                scale: Math.round(def.defaultScale * scaleAdj * 100) / 100
            };
        });
    });

    // Try restoring from localStorage
    try {
        const saved = localStorage.getItem('vfs_flags_responsive');
        if (saved) {
            const parsed = JSON.parse(saved);
            BREAKPOINTS.forEach(bp => {
                if (parsed[bp.id]) {
                    FLAG_IDS.forEach(id => {
                        if (parsed[bp.id][id]) {
                            window.vfsResponsiveState[bp.id][id] = parsed[bp.id][id];
                        }
                    });
                }
            });
        }
    } catch (e) {}

    // Read current CSS variables on load for current device
    function readCSSVariables() {
        const style = getComputedStyle(document.documentElement);
        FLAG_IDS.forEach(id => {
            const rawX = style.getPropertyValue(`--flag-${id}-x`).trim();
            const rawY = style.getPropertyValue(`--flag-${id}-y`).trim();
            const rawScale = style.getPropertyValue(`--flag-${id}-scale`).trim();

            if (rawX) {
                const parsedX = parseFloat(rawX);
                if (!isNaN(parsedX)) window.vfsResponsiveState[activeBreakpoint][id].x = parsedX;
            }
            if (rawY) {
                const parsedY = parseFloat(rawY);
                if (!isNaN(parsedY)) window.vfsResponsiveState[activeBreakpoint][id].y = parsedY;
            }
            if (rawScale) {
                const parsedScale = parseFloat(rawScale);
                if (!isNaN(parsedScale)) window.vfsResponsiveState[activeBreakpoint][id].scale = parsedScale;
            }
        });
        updateHUD();
    }

    function applyLiveCSS() {
        let styleEl = document.getElementById('vfs-live-overrides');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'vfs-live-overrides';
            document.head.appendChild(styleEl);
        }

        let css = '';
        BREAKPOINTS.forEach(bp => {
            let bpRules = '';
            FLAG_IDS.forEach(id => {
                const s = window.vfsResponsiveState[bp.id][id];
                if (s) {
                    bpRules += `    --flag-${id}-x: ${s.x.toFixed(1)}% !important;\n`;
                    bpRules += `    --flag-${id}-y: ${Math.round(s.y)}px !important;\n`;
                    bpRules += `    --flag-${id}-scale: ${s.scale.toFixed(2)} !important;\n`;
                }
            });

            if (bp.id === 'desktop') {
                css += `:root {\n${bpRules}}\n`;
            } else {
                css += `${bp.query} {\n  :root {\n${bpRules}  }\n}\n`;
            }
        });

        styleEl.textContent = css;

        // Auto-persist in localStorage
        try {
            localStorage.setItem('vfs_flags_responsive', JSON.stringify(window.vfsResponsiveState));
        } catch (e) {}
    }

    function injectStudioUI() {
        if (document.getElementById('visual-flag-studio')) return;

        const container = document.createElement('div');
        container.id = 'visual-flag-studio';
        container.innerHTML = `
        <style>
            #visual-flag-studio {
                position: fixed;
                top: 14px;
                right: 14px;
                z-index: 2147483647;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #fff;
                user-select: none;
                pointer-events: auto;
            }
            #vfs-toggle-btn {
                background: rgba(22, 17, 16, 0.94);
                color: #f6c860;
                border: 1px solid rgba(246, 200, 96, 0.45);
                border-radius: 9999px;
                padding: 7px 16px;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 12px rgba(246,200,96,0.2);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                transition: transform 0.15s ease;
            }
            #vfs-toggle-btn:hover {
                transform: scale(1.02);
            }
            #vfs-panel {
                margin-top: 8px;
                width: 330px;
                max-height: 90vh;
                overflow-y: auto;
                background: rgba(20, 15, 14, 0.96);
                border: 1px solid rgba(246, 200, 96, 0.35);
                border-radius: 16px;
                padding: 12px 14px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.85), 0 0 20px rgba(246,200,96,0.12);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                display: flex;
                flex-direction: column;
                gap: 10px;
                box-sizing: border-box;
            }
            .vfs-bp-btn {
                flex: 1;
                padding: 5px 4px;
                font-size: 10px;
                font-weight: 700;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.15);
                background: rgba(255,255,255,0.06);
                color: #ddd;
                cursor: pointer;
                transition: all 0.12s ease;
            }
            .vfs-bp-btn.active {
                background: #f6c860 !important;
                color: #1a1412 !important;
                border-color: #f6c860 !important;
            }
            .vfs-tab-btn {
                flex: 1;
                padding: 5px 3px;
                font-size: 11px;
                font-weight: 700;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.15);
                background: rgba(255,255,255,0.06);
                color: #ddd;
                cursor: pointer;
                transition: all 0.12s ease;
            }
            .vfs-tab-btn.active {
                background: #f6c860 !important;
                color: #1a1412 !important;
                border-color: #f6c860 !important;
            }
            .vfs-dpad-btn {
                padding: 6px;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.15);
                background: rgba(255,255,255,0.08);
                color: #fff;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                transition: background 0.1s ease;
            }
            .vfs-dpad-btn:hover {
                background: rgba(246, 200, 96, 0.25);
                border-color: #f6c860;
            }
            .buddhist-pillar-flag-container.vfs-interactive {
                pointer-events: auto !important;
                cursor: grab !important;
            }
            .buddhist-pillar-flag-container.vfs-interactive * {
                pointer-events: auto !important;
                cursor: grab !important;
            }
            .buddhist-pillar-flag-container.vfs-dragging,
            .buddhist-pillar-flag-container.vfs-dragging * {
                cursor: grabbing !important;
            }
            .buddhist-pillar-flag-container.vfs-selected {
                outline: 2px dashed #f6c860 !important;
                outline-offset: 4px;
            }
        </style>

        <button id="vfs-toggle-btn">
            <span>🚩 Flag Studio (Responsive)</span>
            <span id="vfs-toggle-icon">▼</span>
        </button>

        <div id="vfs-panel">
            <!-- Header & Viewport Width Display -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 6px;">
                <span id="vfs-viewport-display" style="font-size: 11px; color: #86efac; font-weight: 700;">Width: ${window.innerWidth}px</span>
                <label style="display: flex; align-items: center; gap: 4px; font-size: 11px; color: #f6c860; cursor: pointer;">
                    <input type="checkbox" id="vfs-drag-toggle" checked style="accent-color: #22c55e;">
                    <span>Drag Mode</span>
                </label>
            </div>

            <!-- Responsive Device Breakpoint Selector -->
            <div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 3px;">Active Device Tier</div>
                <div style="display: flex; gap: 3px;">
                    <button class="vfs-bp-btn ${activeBreakpoint === 'desktop' ? 'active' : ''}" data-bp="desktop">Desktop</button>
                    <button class="vfs-bp-btn ${activeBreakpoint === 'laptop' ? 'active' : ''}" data-bp="laptop">Laptop</button>
                    <button class="vfs-bp-btn ${activeBreakpoint === 'tablet' ? 'active' : ''}" data-bp="tablet">Tablet</button>
                    <button class="vfs-bp-btn ${activeBreakpoint === 'mobile' ? 'active' : ''}" data-bp="mobile">Mobile</button>
                </div>
            </div>

            <!-- Flag Selectors: Right Walkway -->
            <div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.45); text-transform: uppercase; margin-bottom: 3px;">Right Walkway (R1–R4)</div>
                <div style="display: flex; gap: 3px;">
                    <button class="vfs-tab-btn active" data-flag="r1">R1 (Front)</button>
                    <button class="vfs-tab-btn" data-flag="r2">R2</button>
                    <button class="vfs-tab-btn" data-flag="r3">R3</button>
                    <button class="vfs-tab-btn" data-flag="r4">R4 (Back)</button>
                </div>
            </div>

            <!-- Flag Selectors: Left Walkway -->
            <div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.45); text-transform: uppercase; margin-bottom: 3px;">Left Walkway (L1–L4)</div>
                <div style="display: flex; gap: 3px;">
                    <button class="vfs-tab-btn" data-flag="l1">L1 (Front)</button>
                    <button class="vfs-tab-btn" data-flag="l2">L2</button>
                    <button class="vfs-tab-btn" data-flag="l3">L3</button>
                    <button class="vfs-tab-btn" data-flag="l4">L4 (Back)</button>
                </div>
            </div>

            <!-- Coordinates HUD -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; background: rgba(0,0,0,0.45); padding: 6px 8px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.06);">
                <div>
                    <div style="font-size: 8px; color: rgba(255,255,255,0.5); text-transform: uppercase;">X Pos</div>
                    <div id="vfs-val-x" style="font-size: 11px; font-weight: 700; color: #f6c860;">92.6%</div>
                </div>
                <div>
                    <div style="font-size: 8px; color: rgba(255,255,255,0.5); text-transform: uppercase;">Y Pos</div>
                    <div id="vfs-val-y" style="font-size: 11px; font-weight: 700; color: #f6c860;">890px</div>
                </div>
                <div>
                    <div style="font-size: 8px; color: rgba(255,255,255,0.5); text-transform: uppercase;">Scale</div>
                    <div id="vfs-val-scale" style="font-size: 11px; font-weight: 700; color: #f6c860;">0.31</div>
                </div>
            </div>

            <!-- 4-Way D-Pad & Nudge -->
            <div>
                <div style="font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 3px; display: flex; justify-content: space-between;">
                    <span>Direct Drag or D-Pad</span>
                    <span style="font-size: 8px; color: rgba(246,200,96,0.8);">Shift+Arrow = Fast</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; width: 120px; margin: 0 auto;">
                    <div></div>
                    <button class="vfs-dpad-btn" id="vfs-btn-up" title="Move UP">▲</button>
                    <div></div>
                    <button class="vfs-dpad-btn" id="vfs-btn-left" title="Move LEFT">◀</button>
                    <button class="vfs-dpad-btn" id="vfs-btn-reset" title="Reset this flag" style="font-size: 9px; color: #f6c860;">↺</button>
                    <button class="vfs-dpad-btn" id="vfs-btn-right" title="Move RIGHT">▶</button>
                    <div></div>
                    <button class="vfs-dpad-btn" id="vfs-btn-down" title="Move DOWN">▼</button>
                    <div></div>
                </div>
            </div>

            <!-- Scale Slider -->
            <div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.6); margin-bottom: 2px;">
                    <span>Scale</span>
                    <span id="vfs-slider-scale-label" style="color: #f6c860; font-weight: 700;">0.31</span>
                </div>
                <input id="vfs-scale-slider" type="range" min="0.06" max="0.55" step="0.01" value="0.31" style="width: 100%; cursor: pointer; accent-color: #f6c860;">
            </div>

            <!-- Save & Copy Controls -->
            <div style="display: flex; gap: 6px; margin-top: 2px;">
                <button id="vfs-save-btn" style="
                    flex: 1;
                    background: linear-gradient(135deg, #f6c860, #e0a838);
                    color: #1a1412;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(246, 200, 96, 0.35);
                ">💾 Save to Files</button>
                <button id="vfs-copy-btn" style="
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                " title="Copy clean responsive CSS to clipboard">📋 Copy CSS</button>
            </div>
            <div id="vfs-status-msg" style="font-size: 10px; text-align: center; color: #4ade80; display: none; font-weight: 600;"></div>
        </div>
        `;
        document.body.appendChild(container);

        bindStudioEvents();
    }

    function updateHUD() {
        const bpState = window.vfsResponsiveState[activeBreakpoint];
        const s = bpState ? bpState[activeFlag] : null;
        if (!s) return;

        const valX = document.getElementById('vfs-val-x');
        const valY = document.getElementById('vfs-val-y');
        const valScale = document.getElementById('vfs-val-scale');
        const scaleLabel = document.getElementById('vfs-slider-scale-label');
        const scaleSlider = document.getElementById('vfs-scale-slider');
        const vpDisplay = document.getElementById('vfs-viewport-display');

        if (valX) valX.innerText = s.x.toFixed(1) + '%';
        if (valY) valY.innerText = Math.round(s.y) + 'px';
        if (valScale) valScale.innerText = s.scale.toFixed(2);
        if (scaleLabel) scaleLabel.innerText = s.scale.toFixed(2);
        if (scaleSlider) scaleSlider.value = s.scale;
        if (vpDisplay) vpDisplay.innerText = `${activeBreakpoint.toUpperCase()} (${window.innerWidth}px)`;

        // Update active breakpoint buttons
        document.querySelectorAll('.vfs-bp-btn').forEach(btn => {
            if (btn.getAttribute('data-bp') === activeBreakpoint) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update active flag buttons
        document.querySelectorAll('.vfs-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-flag') === activeFlag) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        highlightActiveFlag();
    }

    function selectFlag(flagId) {
        if (!FLAG_META[flagId]) return;
        activeFlag = flagId;
        updateHUD();
    }

    function selectBreakpoint(bpId) {
        if (!window.vfsResponsiveState[bpId]) return;
        activeBreakpoint = bpId;
        updateHUD();
    }

    function highlightActiveFlag() {
        FLAG_IDS.forEach(id => {
            const meta = FLAG_META[id];
            const el = document.querySelector('.' + meta.cls);
            if (el) {
                if (id === activeFlag) {
                    el.classList.add('vfs-selected');
                } else {
                    el.classList.remove('vfs-selected');
                }
            }
        });
    }

    function nudge(dx, dy) {
        const s = window.vfsResponsiveState[activeBreakpoint][activeFlag];
        s.x = Math.round((s.x + dx) * 10) / 10;
        s.y = Math.round(s.y + dy);
        applyLiveCSS();
        updateHUD();
    }

    function setScale(newScale) {
        const s = window.vfsResponsiveState[activeBreakpoint][activeFlag];
        s.scale = Math.max(0.06, Math.min(0.60, Math.round(newScale * 100) / 100));
        applyLiveCSS();
        updateHUD();
    }

    // Direct Drag-and-Drop Implementation
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialX = 0;
    let initialY = 0;

    function attachFlagDragHandlers() {
        FLAG_IDS.forEach(id => {
            const meta = FLAG_META[id];
            const container = document.querySelector('.' + meta.cls);
            if (!container || container.__vfsDragAttached) return;
            container.__vfsDragAttached = true;

            if (dragEnabled) {
                container.classList.add('vfs-interactive');
            }

            // Mouse down
            container.addEventListener('mousedown', function(e) {
                if (!dragEnabled || e.button !== 0) return;
                isDragging = true;
                selectFlag(id);

                container.classList.add('vfs-dragging');
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                initialX = window.vfsResponsiveState[activeBreakpoint][id].x;
                initialY = window.vfsResponsiveState[activeBreakpoint][id].y;
                e.preventDefault();
                e.stopPropagation();
            });

            // Touch start
            container.addEventListener('touchstart', function(e) {
                if (!dragEnabled || e.touches.length !== 1) return;
                isDragging = true;
                selectFlag(id);

                container.classList.add('vfs-dragging');
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                initialX = window.vfsResponsiveState[activeBreakpoint][id].x;
                initialY = window.vfsResponsiveState[activeBreakpoint][id].y;
                e.stopPropagation();
            }, { passive: true });

            // Wheel scaling directly on flag
            container.addEventListener('wheel', function(e) {
                if (!dragEnabled) return;
                e.preventDefault();
                e.stopPropagation();
                selectFlag(id);
                const delta = e.deltaY < 0 ? 0.01 : -0.01;
                setScale(window.vfsResponsiveState[activeBreakpoint][id].scale + delta);
            }, { passive: false });
        });
    }

    // Global drag move & end
    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const temple = document.querySelector('[data-framer-name="Temple"]');
        const templeWidth = temple ? temple.offsetWidth : window.innerWidth;

        const dxPixels = e.clientX - dragStartX;
        const dyPixels = e.clientY - dragStartY;
        const dxPercent = (dxPixels / templeWidth) * 100;

        const s = window.vfsResponsiveState[activeBreakpoint][activeFlag];
        s.x = Math.round((initialX + dxPercent) * 10) / 10;
        s.y = Math.round(initialY + dyPixels);

        applyLiveCSS();
        updateHUD();
    });

    window.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            document.querySelectorAll('.buddhist-pillar-flag-container').forEach(el => {
                el.classList.remove('vfs-dragging');
            });
        }
    });

    window.addEventListener('touchmove', function(e) {
        if (!isDragging || e.touches.length !== 1) return;
        const temple = document.querySelector('[data-framer-name="Temple"]');
        const templeWidth = temple ? temple.offsetWidth : window.innerWidth;

        const dxPixels = e.touches[0].clientX - dragStartX;
        const dyPixels = e.touches[0].clientY - dragStartY;
        const dxPercent = (dxPixels / templeWidth) * 100;

        const s = window.vfsResponsiveState[activeBreakpoint][activeFlag];
        s.x = Math.round((initialX + dxPercent) * 10) / 10;
        s.y = Math.round(initialY + dyPixels);

        applyLiveCSS();
        updateHUD();
    }, { passive: true });

    window.addEventListener('touchend', function() {
        if (isDragging) {
            isDragging = false;
            document.querySelectorAll('.buddhist-pillar-flag-container').forEach(el => {
                el.classList.remove('vfs-dragging');
            });
        }
    });

    // Keyboard Arrow Controls
    window.addEventListener('keydown', function(e) {
        if (!dragEnabled) return;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault();
            const stepX = e.shiftKey ? 1.0 : 0.2;
            const stepY = e.shiftKey ? 10 : 2;

            if (e.key === 'ArrowLeft')  nudge(-stepX, 0);
            if (e.key === 'ArrowRight') nudge(stepX, 0);
            if (e.key === 'ArrowUp')    nudge(0, -stepY);
            if (e.key === 'ArrowDown')  nudge(0, stepY);
        }
    });

    function saveAllFlags() {
        const btn = document.getElementById('vfs-save-btn');
        const status = document.getElementById('vfs-status-msg');
        if (btn) btn.innerText = 'Saving...';

        fetch('/api/save-flags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: window.vfsResponsiveState })
        })
        .then(res => res.json())
        .then(data => {
            if (btn) btn.innerText = '💾 Save to Files';
            if (status) {
                status.innerText = '✅ Saved permanently across all devices!';
                status.style.display = 'block';
                setTimeout(() => { status.style.display = 'none'; }, 3000);
            }
        })
        .catch(err => {
            if (btn) btn.innerText = '💾 Save to Files';
            if (status) {
                status.innerText = 'Copied to clipboard (offline mode)';
                status.style.display = 'block';
            }
            copyFlagCSS();
        });
    }

    function copyFlagCSS() {
        let css = '/* Responsive Buddhist Walkway Flags Coordinates */\n';
        BREAKPOINTS.forEach(bp => {
            let inner = '';
            FLAG_IDS.forEach(id => {
                const s = window.vfsResponsiveState[bp.id][id];
                inner += `    --flag-${id}-x: ${s.x.toFixed(1)}%;\n`;
                inner += `    --flag-${id}-y: ${Math.round(s.y)}px;\n`;
                inner += `    --flag-${id}-scale: ${s.scale.toFixed(2)};\n`;
            });
            if (bp.id === 'desktop') {
                css += `/* Desktop (min-width: 1280px) */\n:root {\n${inner}}\n\n`;
            } else {
                css += `/* ${bp.label} */\n${bp.query} {\n  :root {\n${inner}  }\n}\n\n`;
            }
        });

        navigator.clipboard.writeText(css).then(() => {
            const status = document.getElementById('vfs-status-msg');
            if (status) {
                status.innerText = '📋 All responsive variables copied!';
                status.style.display = 'block';
                setTimeout(() => { status.style.display = 'none'; }, 2500);
            }
        });
    }

    function bindStudioEvents() {
        const toggleBtn = document.getElementById('vfs-toggle-btn');
        const panel = document.getElementById('vfs-panel');
        const icon = document.getElementById('vfs-toggle-icon');

        if (toggleBtn) {
            toggleBtn.onclick = function() {
                isPanelOpen = !isPanelOpen;
                panel.style.display = isPanelOpen ? 'flex' : 'none';
                icon.innerText = isPanelOpen ? '▼' : '▲';
            };
        }

        const dragToggle = document.getElementById('vfs-drag-toggle');
        if (dragToggle) {
            dragToggle.onchange = function() {
                dragEnabled = this.checked;
                document.querySelectorAll('.buddhist-pillar-flag-container').forEach(el => {
                    if (dragEnabled) {
                        el.classList.add('vfs-interactive');
                    } else {
                        el.classList.remove('vfs-interactive');
                    }
                });
            };
        }

        // Breakpoint selector buttons
        document.querySelectorAll('.vfs-bp-btn').forEach(btn => {
            btn.onclick = function() {
                selectBreakpoint(this.getAttribute('data-bp'));
            };
        });

        // Flag selector tab buttons
        document.querySelectorAll('.vfs-tab-btn').forEach(btn => {
            btn.onclick = function() {
                selectFlag(this.getAttribute('data-flag'));
            };
        });

        // D-Pad buttons
        const upBtn = document.getElementById('vfs-btn-up');
        const downBtn = document.getElementById('vfs-btn-down');
        const leftBtn = document.getElementById('vfs-btn-left');
        const rightBtn = document.getElementById('vfs-btn-right');
        const resetBtn = document.getElementById('vfs-btn-reset');

        if (upBtn)    upBtn.onclick    = () => nudge(0, -4);
        if (downBtn)  downBtn.onclick  = () => nudge(0, 4);
        if (leftBtn)  leftBtn.onclick  = () => nudge(-0.25, 0);
        if (rightBtn) rightBtn.onclick = () => nudge(0.25, 0);
        if (resetBtn) resetBtn.onclick = () => {
            const def = FLAG_META[activeFlag];
            window.vfsResponsiveState[activeBreakpoint][activeFlag].x = def.defaultX;
            window.vfsResponsiveState[activeBreakpoint][activeFlag].y = def.defaultY;
            window.vfsResponsiveState[activeBreakpoint][activeFlag].scale = def.defaultScale;
            applyLiveCSS();
            updateHUD();
        };

        // Scale slider
        const scaleSlider = document.getElementById('vfs-scale-slider');
        if (scaleSlider) {
            scaleSlider.oninput = function() {
                setScale(parseFloat(this.value));
            };
        }

        // Save & Copy
        const saveBtn = document.getElementById('vfs-save-btn');
        const copyBtn = document.getElementById('vfs-copy-btn');
        if (saveBtn) saveBtn.onclick = saveAllFlags;
        if (copyBtn) copyBtn.onclick = copyFlagCSS;
    }

    // Auto-detect viewport on resize
    window.addEventListener('resize', () => {
        const detected = detectCurrentBreakpoint();
        if (detected !== activeBreakpoint) {
            activeBreakpoint = detected;
            updateHUD();
        } else {
            const vpDisplay = document.getElementById('vfs-viewport-display');
            if (vpDisplay) vpDisplay.innerText = `${activeBreakpoint.toUpperCase()} (${window.innerWidth}px)`;
        }
    });

    function init() {
        injectStudioUI();
        readCSSVariables();
        applyLiveCSS();
        attachFlagDragHandlers();
        highlightActiveFlag();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Periodic check to ensure dynamic flags get drag handlers
    const checkInterval = setInterval(() => {
        attachFlagDragHandlers();
        if (document.querySelectorAll('.buddhist-pillar-flag-container').length >= 8) {
            clearInterval(checkInterval);
        }
    }, 400);

    window.addEventListener('load', () => {
        readCSSVariables();
        applyLiveCSS();
        attachFlagDragHandlers();
        highlightActiveFlag();
    });
})();
