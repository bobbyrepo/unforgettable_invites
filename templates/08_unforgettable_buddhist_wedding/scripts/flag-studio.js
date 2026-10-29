/**
 * Visual Flag Studio & Live Drag-and-Drop Positioning Controller
 * Enables direct on-screen dragging, wheel scaling, keyboard nudging, and persistence for all 8 Buddhist Walkway Flags.
 */
(function() {
    'use strict';

    const FLAG_IDS = ['r1', 'r2', 'r3', 'r4', 'l1', 'l2', 'l3', 'l4'];

    const FLAG_META = {
        r1: { label: 'R1 (Front Right)',   cls: 'buddhist-flag-right-1', defaultX: 92.5, defaultY: 890,  defaultScale: 0.31 },
        r2: { label: 'R2 (Mid-Front R)',   cls: 'buddhist-flag-right-2', defaultX: 88.0, defaultY: 945,  defaultScale: 0.26 },
        r3: { label: 'R3 (Mid-Back R)',    cls: 'buddhist-flag-right-3', defaultX: 85.0, defaultY: 990,  defaultScale: 0.20 },
        r4: { label: 'R4 (Back Right)',    cls: 'buddhist-flag-right-4', defaultX: 83.0, defaultY: 1015, defaultScale: 0.17 },
        l1: { label: 'L1 (Front Left)',    cls: 'buddhist-flag-left-1',  defaultX: 24.0, defaultY: 890,  defaultScale: 0.31 },
        l2: { label: 'L2 (Mid-Front L)',   cls: 'buddhist-flag-left-2',  defaultX: 29.0, defaultY: 940,  defaultScale: 0.26 },
        l3: { label: 'L3 (Mid-Back L)',    cls: 'buddhist-flag-left-3',  defaultX: 34.0, defaultY: 990,  defaultScale: 0.20 },
        l4: { label: 'L4 (Back Left)',     cls: 'buddhist-flag-left-4',  defaultX: 36.5, defaultY: 1015, defaultScale: 0.17 }
    };

    let activeFlag = 'r1';
    let isPanelOpen = true;
    let dragEnabled = true;

    // Live state store
    window.vfsState = {};
    FLAG_IDS.forEach(id => {
        window.vfsState[id] = {
            x: FLAG_META[id].defaultX,
            y: FLAG_META[id].defaultY,
            scale: FLAG_META[id].defaultScale
        };
    });

    // Read current CSS variables on load
    function readCSSVariables() {
        const style = getComputedStyle(document.documentElement);
        FLAG_IDS.forEach(id => {
            const rawX = style.getPropertyValue(`--flag-${id}-x`).trim();
            const rawY = style.getPropertyValue(`--flag-${id}-y`).trim();
            const rawScale = style.getPropertyValue(`--flag-${id}-scale`).trim();

            if (rawX) {
                const parsedX = parseFloat(rawX);
                if (!isNaN(parsedX)) window.vfsState[id].x = parsedX;
            }
            if (rawY) {
                const parsedY = parseFloat(rawY);
                if (!isNaN(parsedY)) window.vfsState[id].y = parsedY;
            }
            if (rawScale) {
                const parsedScale = parseFloat(rawScale);
                if (!isNaN(parsedScale)) window.vfsState[id].scale = parsedScale;
            }
        });
        updateHUD();
    }

    function applyToDOM(id) {
        const s = window.vfsState[id];
        document.documentElement.style.setProperty(`--flag-${id}-x`, `${s.x}%`);
        document.documentElement.style.setProperty(`--flag-${id}-y`, `${s.y}px`);
        document.documentElement.style.setProperty(`--flag-${id}-scale`, `${s.scale}`);
    }

    function applyAllToDOM() {
        FLAG_IDS.forEach(id => applyToDOM(id));
    }

    // Direct UI Injection: Flag Studio Panel
    function injectStudioUI() {
        if (document.getElementById('visual-flag-studio')) return;

        const container = document.createElement('div');
        container.id = 'visual-flag-studio';
        container.innerHTML = `
        <style>
            #visual-flag-studio {
                position: fixed;
                top: 18px;
                right: 18px;
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
                transition: transform 0.15s ease, background 0.15s ease;
            }
            #vfs-toggle-btn:hover {
                transform: scale(1.02);
                background: rgba(35, 27, 24, 0.96);
            }
            #vfs-panel {
                margin-top: 8px;
                width: 320px;
                background: rgba(20, 15, 14, 0.96);
                border: 1px solid rgba(246, 200, 96, 0.35);
                border-radius: 16px;
                padding: 14px 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.85), 0 0 20px rgba(246,200,96,0.12);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                display: flex;
                flex-direction: column;
                gap: 12px;
                box-sizing: border-box;
            }
            .vfs-tab-btn {
                flex: 1;
                padding: 5px 6px;
                font-size: 11px;
                font-weight: 700;
                border-radius: 6px;
                border: 1px solid rgba(255,255,255,0.18);
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
                padding: 7px;
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.15);
                background: rgba(255,255,255,0.08);
                color: #fff;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                transition: background 0.1s ease;
            }
            .vfs-dpad-btn:hover {
                background: rgba(246, 200, 96, 0.25);
                border-color: #f6c860;
            }
            /* Flag Drag Hover & Selection Outlines */
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
            <span>🚩 Flag Studio (Drag & Drop)</span>
            <span id="vfs-toggle-icon">▼</span>
        </button>

        <div id="vfs-panel">
            <!-- Mode Switcher & Drag Toggle -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #f6c860; font-weight: 700;">Active Flag</span>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #86efac; cursor: pointer;">
                    <input type="checkbox" id="vfs-drag-toggle" checked style="accent-color: #22c55e;">
                    <span>Drag Mode ON</span>
                </label>
            </div>

            <!-- Side Tabs: Right Walkway -->
            <div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.45); text-transform: uppercase; margin-bottom: 4px;">Right Walkway (R1–R4)</div>
                <div style="display: flex; gap: 4px;">
                    <button class="vfs-tab-btn active" data-flag="r1">R1 (Front)</button>
                    <button class="vfs-tab-btn" data-flag="r2">R2</button>
                    <button class="vfs-tab-btn" data-flag="r3">R3</button>
                    <button class="vfs-tab-btn" data-flag="r4">R4 (Back)</button>
                </div>
            </div>

            <!-- Side Tabs: Left Walkway -->
            <div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.45); text-transform: uppercase; margin-bottom: 4px;">Left Walkway (L1–L4)</div>
                <div style="display: flex; gap: 4px;">
                    <button class="vfs-tab-btn" data-flag="l1">L1 (Front)</button>
                    <button class="vfs-tab-btn" data-flag="l2">L2</button>
                    <button class="vfs-tab-btn" data-flag="l3">L3</button>
                    <button class="vfs-tab-btn" data-flag="l4">L4 (Back)</button>
                </div>
            </div>

            <!-- Coordinates HUD -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; background: rgba(0,0,0,0.4); padding: 8px 10px; border-radius: 8px; text-align: center; border: 1px solid rgba(255,255,255,0.06);">
                <div>
                    <div style="font-size: 9px; color: rgba(255,255,255,0.5); text-transform: uppercase;">X Pos</div>
                    <div id="vfs-val-x" style="font-size: 12px; font-weight: 700; color: #f6c860; margin-top: 1px;">92.5%</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: rgba(255,255,255,0.5); text-transform: uppercase;">Y Pos</div>
                    <div id="vfs-val-y" style="font-size: 12px; font-weight: 700; color: #f6c860; margin-top: 1px;">890px</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: rgba(255,255,255,0.5); text-transform: uppercase;">Scale</div>
                    <div id="vfs-val-scale" style="font-size: 12px; font-weight: 700; color: #f6c860; margin-top: 1px;">0.31</div>
                </div>
            </div>

            <!-- 4-Way Directional D-Pad & Nudge -->
            <div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 4px; display: flex; justify-content: space-between;">
                    <span>Direct Drag or D-Pad</span>
                    <span style="font-size: 9px; color: rgba(246,200,96,0.8);">Arrow keys supported</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 140px; margin: 0 auto;">
                    <div></div>
                    <button class="vfs-dpad-btn" id="vfs-btn-up" title="Move UP">▲</button>
                    <div></div>
                    <button class="vfs-dpad-btn" id="vfs-btn-left" title="Move LEFT">◀</button>
                    <button class="vfs-dpad-btn" id="vfs-btn-reset" title="Reset this flag to default" style="font-size: 10px; color: #f6c860;">↺</button>
                    <button class="vfs-dpad-btn" id="vfs-btn-right" title="Move RIGHT">▶</button>
                    <div></div>
                    <button class="vfs-dpad-btn" id="vfs-btn-down" title="Move DOWN">▼</button>
                    <div></div>
                </div>
            </div>

            <!-- Scale Slider -->
            <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 3px;">
                    <span>Scale (or use Mousewheel on flag)</span>
                    <span id="vfs-slider-scale-label" style="color: #f6c860; font-weight: 700;">0.31</span>
                </div>
                <input id="vfs-scale-slider" type="range" min="0.10" max="0.60" step="0.01" value="0.31" style="width: 100%; cursor: pointer; accent-color: #f6c860;">
            </div>

            <!-- Save & Copy Controls -->
            <div style="display: flex; gap: 8px; margin-top: 2px;">
                <button id="vfs-save-btn" style="
                    flex: 1;
                    background: linear-gradient(135deg, #f6c860, #e0a838);
                    color: #1a1412;
                    border: none;
                    border-radius: 8px;
                    padding: 9px 12px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(246, 200, 96, 0.35);
                    transition: transform 0.1s ease;
                ">💾 Save to Files</button>
                <button id="vfs-copy-btn" style="
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    border-radius: 8px;
                    padding: 9px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                " title="Copy clean CSS variables to clipboard">📋 Copy</button>
            </div>
            <div id="vfs-status-msg" style="font-size: 11px; text-align: center; color: #4ade80; display: none; font-weight: 600;"></div>
        </div>
        `;
        document.body.appendChild(container);

        bindStudioEvents();
    }

    function updateHUD() {
        const s = window.vfsState[activeFlag];
        if (!s) return;

        const valX = document.getElementById('vfs-val-x');
        const valY = document.getElementById('vfs-val-y');
        const valScale = document.getElementById('vfs-val-scale');
        const scaleLabel = document.getElementById('vfs-slider-scale-label');
        const scaleSlider = document.getElementById('vfs-scale-slider');

        if (valX) valX.innerText = s.x.toFixed(1) + '%';
        if (valY) valY.innerText = Math.round(s.y) + 'px';
        if (valScale) valScale.innerText = s.scale.toFixed(2);
        if (scaleLabel) scaleLabel.innerText = s.scale.toFixed(2);
        if (scaleSlider) scaleSlider.value = s.scale;

        // Update active tab buttons
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
        const s = window.vfsState[activeFlag];
        s.x = Math.round((s.x + dx) * 10) / 10;
        s.y = Math.round(s.y + dy);
        applyToDOM(activeFlag);
        updateHUD();
    }

    function setScale(newScale) {
        const s = window.vfsState[activeFlag];
        s.scale = Math.max(0.10, Math.min(0.60, Math.round(newScale * 100) / 100));
        applyToDOM(activeFlag);
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
                initialX = window.vfsState[id].x;
                initialY = window.vfsState[id].y;
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
                initialX = window.vfsState[id].x;
                initialY = window.vfsState[id].y;
                e.stopPropagation();
            }, { passive: true });

            // Wheel scaling directly on flag
            container.addEventListener('wheel', function(e) {
                if (!dragEnabled) return;
                e.preventDefault();
                e.stopPropagation();
                selectFlag(id);
                const delta = e.deltaY < 0 ? 0.01 : -0.01;
                setScale(window.vfsState[id].scale + delta);
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

        const s = window.vfsState[activeFlag];
        s.x = Math.round((initialX + dxPercent) * 10) / 10;
        s.y = Math.round(initialY + dyPixels);

        applyToDOM(activeFlag);
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

    // Touch move & touch end
    window.addEventListener('touchmove', function(e) {
        if (!isDragging || e.touches.length !== 1) return;
        const temple = document.querySelector('[data-framer-name="Temple"]');
        const templeWidth = temple ? temple.offsetWidth : window.innerWidth;

        const dxPixels = e.touches[0].clientX - dragStartX;
        const dyPixels = e.touches[0].clientY - dragStartY;
        const dxPercent = (dxPixels / templeWidth) * 100;

        const s = window.vfsState[activeFlag];
        s.x = Math.round((initialX + dxPercent) * 10) / 10;
        s.y = Math.round(initialY + dyPixels);

        applyToDOM(activeFlag);
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

        const payload = {};
        FLAG_IDS.forEach(id => {
            const s = window.vfsState[id];
            payload[`--flag-${id}-x`] = `${s.x}%`;
            payload[`--flag-${id}-y`] = `${Math.round(s.y)}px`;
            payload[`--flag-${id}-scale`] = s.scale.toFixed(2);
        });

        fetch('/api/save-flags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (btn) btn.innerText = '💾 Save to Files';
            if (status) {
                status.innerText = '✅ Saved permanently to flags.css & HTML!';
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
        let css = '/* Buddhist Walkway Flags Coordinates */\n:root {\n';
        FLAG_IDS.forEach(id => {
            const s = window.vfsState[id];
            css += `    --flag-${id}-x: ${s.x}%;\n`;
            css += `    --flag-${id}-y: ${Math.round(s.y)}px;\n`;
            css += `    --flag-${id}-scale: ${s.scale.toFixed(2)};\n`;
        });
        css += '}\n';

        navigator.clipboard.writeText(css).then(() => {
            const status = document.getElementById('vfs-status-msg');
            if (status) {
                status.innerText = '📋 All 8 flag variables copied!';
                status.style.display = 'block';
                setTimeout(() => { status.style.display = 'none'; }, 2500);
            }
        });
    }

    function bindStudioEvents() {
        // Toggle panel open/close
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

        // Drag mode toggle checkbox
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

        // Tab buttons
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
            window.vfsState[activeFlag].x = def.defaultX;
            window.vfsState[activeFlag].y = def.defaultY;
            window.vfsState[activeFlag].scale = def.defaultScale;
            applyToDOM(activeFlag);
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

    // Startup initialization
    function init() {
        injectStudioUI();
        readCSSVariables();
        attachFlagDragHandlers();
        highlightActiveFlag();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Periodic check to ensure dynamic flags (created by flag-simulation.js) get drag handlers
    const checkInterval = setInterval(() => {
        attachFlagDragHandlers();
        if (document.querySelectorAll('.buddhist-pillar-flag-container').length >= 8) {
            clearInterval(checkInterval);
        }
    }, 400);

    window.addEventListener('load', () => {
        readCSSVariables();
        attachFlagDragHandlers();
        highlightActiveFlag();
    });
})();
