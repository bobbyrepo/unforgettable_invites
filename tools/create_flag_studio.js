const flagStudioScript = `
<!-- =====================================================================
     VISUAL FLAG STUDIO: Drag, Drop, Scale & Live 4-Way Positioning Gizmo
     ===================================================================== -->
<div id="visual-flag-studio" style="
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #fff;
    user-select: none;
    pointer-events: auto;
">
    <!-- Floating Toggle Button -->
    <button id="vfs-toggle-btn" onclick="toggleFlagStudio()" style="
        background: rgba(26, 20, 18, 0.92);
        color: #f6c860;
        border: 1px solid rgba(246, 200, 96, 0.5);
        border-radius: 9999px;
        padding: 8px 18px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 12px rgba(246,200,96,0.25);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: transform 0.15s ease, background 0.15s ease;
    ">
        <span>🚩 Flag Studio (Drag & Scale)</span>
        <span id="vfs-toggle-icon">▼</span>
    </button>

    <!-- Main Control Panel -->
    <div id="vfs-panel" style="
        margin-top: 10px;
        width: 320px;
        background: rgba(22, 17, 16, 0.96);
        border: 1px solid rgba(246, 200, 96, 0.4);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(246,200,96,0.15);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        flex-direction: column;
        gap: 14px;
    ">
        <!-- Header & Target Selector -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #f6c860; font-weight: 700;">Active Pillar Flag</span>
            <div style="display: flex; gap: 6px;">
                <button id="vfs-tab-r1" onclick="selectFlag('r1')" style="padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 6px; border: 1px solid #f6c860; background: #f6c860; color: #1a1412; cursor: pointer;">Flag 1</button>
                <button id="vfs-tab-r2" onclick="selectFlag('r2')" style="padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; cursor: pointer;">Flag 2</button>
            </div>
        </div>

        <!-- Coordinates HUD -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; background: rgba(0,0,0,0.35); padding: 10px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.08);">
            <div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase;">X Position</div>
                <div id="vfs-val-x" style="font-size: 13px; font-weight: 700; color: #f6c860; margin-top: 2px;">92.5%</div>
            </div>
            <div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase;">Y Height</div>
                <div id="vfs-val-y" style="font-size: 13px; font-weight: 700; color: #f6c860; margin-top: 2px;">890px</div>
            </div>
            <div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase;">Scale</div>
                <div id="vfs-val-scale" style="font-size: 13px; font-weight: 700; color: #f6c860; margin-top: 2px;">0.31</div>
            </div>
        </div>

        <!-- 4-Way Directional D-Pad -->
        <div>
            <div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 6px; display: flex; justify-content: space-between;">
                <span>Move in 4 Directions</span>
                <span style="font-size: 10px; color: rgba(246,200,96,0.8);">or use Keyboard Arrows</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; width: 150px; margin: 0 auto;">
                <div></div>
                <button onclick="nudge(0, -5)" title="Move UP" style="padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-weight: bold;">▲</button>
                <div></div>
                <button onclick="nudge(-0.25, 0)" title="Move LEFT" style="padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-weight: bold;">◀</button>
                <button onclick="centerOnPillar()" title="Quick Align" style="padding: 8px; border-radius: 8px; border: 1px solid rgba(246,200,96,0.3); background: rgba(246,200,96,0.15); color: #f6c860; cursor: pointer; font-size: 10px; font-weight: 700;">🎯</button>
                <button onclick="nudge(0.25, 0)" title="Move RIGHT" style="padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-weight: bold;">▶</button>
                <div></div>
                <button onclick="nudge(0, 5)" title="Move DOWN" style="padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.1); color: #fff; cursor: pointer; font-weight: bold;">▼</button>
                <div></div>
            </div>
        </div>

        <!-- Scale Slider -->
        <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.6); margin-bottom: 4px;">
                <span>Scale / Size</span>
                <span id="vfs-slider-scale-label">0.31</span>
            </div>
            <input id="vfs-scale-slider" type="range" min="0.10" max="0.60" step="0.01" value="0.31" oninput="setScale(this.value)" style="width: 100%; cursor: pointer; accent-color: #f6c860;">
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 8px; margin-top: 4px;">
            <button id="vfs-save-btn" onclick="saveFlagSettings()" style="
                flex: 1;
                background: linear-gradient(135deg, #f6c860, #e0a838);
                color: #1a1412;
                border: none;
                border-radius: 10px;
                padding: 10px 14px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(246, 200, 96, 0.4);
                transition: transform 0.1s ease, filter 0.1s ease;
            ">
                💾 Save to index.html
            </button>
            <button onclick="copyFlagCSS()" style="
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.18);
                border-radius: 10px;
                padding: 10px 12px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
            " title="Copy CSS to clipboard">📋 Copy</button>
        </div>
        <div id="vfs-status-msg" style="font-size: 11px; text-align: center; color: #4ade80; display: none; font-weight: 600;"></div>
    </div>
</div>

<script id="antigravity-visual-flag-studio-script">
(function() {
    let currentFlag = 'r1';
    let isPanelOpen = true;

    // Live state
    window.vfsState = {
        r1: { x: 92.5, y: 890, scale: 0.31, rotate: 0 },
        r2: { x: 82.0, y: 680, scale: 0.35, rotate: 0 }
    };

    // Read current CSS on load
    function readCurrentVariables() {
        const style = getComputedStyle(document.documentElement);
        ['r1', 'r2'].forEach(id => {
            const rawX = style.getPropertyValue('--flag-' + id + '-x').trim();
            const rawY = style.getPropertyValue('--flag-' + id + '-y').trim();
            const rawScale = style.getPropertyValue('--flag-' + id + '-scale').trim();

            if (rawX) window.vfsState[id].x = parseFloat(rawX) || window.vfsState[id].x;
            if (rawY) window.vfsState[id].y = parseFloat(rawY) || window.vfsState[id].y;
            if (rawScale) window.vfsState[id].scale = parseFloat(rawScale) || window.vfsState[id].scale;
        });
        updateHUD();
    }

    window.toggleFlagStudio = function() {
        isPanelOpen = !isPanelOpen;
        document.getElementById('vfs-panel').style.display = isPanelOpen ? 'flex' : 'none';
        document.getElementById('vfs-toggle-icon').innerText = isPanelOpen ? '▼' : '▲';
    };

    window.selectFlag = function(flagId) {
        currentFlag = flagId;
        const tab1 = document.getElementById('vfs-tab-r1');
        const tab2 = document.getElementById('vfs-tab-r2');

        if (flagId === 'r1') {
            tab1.style.background = '#f6c860';
            tab1.style.color = '#1a1412';
            tab1.style.border = '1px solid #f6c860';
            tab2.style.background = 'rgba(255,255,255,0.08)';
            tab2.style.color = '#fff';
            tab2.style.border = '1px solid rgba(255,255,255,0.2)';
        } else {
            tab2.style.background = '#f6c860';
            tab2.style.color = '#1a1412';
            tab2.style.border = '1px solid #f6c860';
            tab1.style.background = 'rgba(255,255,255,0.08)';
            tab1.style.color = '#fff';
            tab1.style.border = '1px solid rgba(255,255,255,0.2)';
        }
        updateHUD();
        highlightActiveFlag();
    };

    window.nudge = function(dx, dy) {
        window.vfsState[currentFlag].x = Math.round((window.vfsState[currentFlag].x + dx) * 10) / 10;
        window.vfsState[currentFlag].y = Math.round(window.vfsState[currentFlag].y + dy);
        applyToDOM(currentFlag);
        updateHUD();
    };

    window.setScale = function(val) {
        window.vfsState[currentFlag].scale = parseFloat(val);
        applyToDOM(currentFlag);
        updateHUD();
    };

    window.centerOnPillar = function() {
        // Quick presets
        if (currentFlag === 'r1') {
            window.vfsState.r1.x = 92.5;
            window.vfsState.r1.y = 890;
            window.vfsState.r1.scale = 0.31;
        } else {
            window.vfsState.r2.x = 81.5;
            window.vfsState.r2.y = 690;
            window.vfsState.r2.scale = 0.34;
        }
        applyToDOM(currentFlag);
        updateHUD();
    };

    function applyToDOM(id) {
        const s = window.vfsState[id];
        document.documentElement.style.setProperty('--flag-' + id + '-x', s.x + '%');
        document.documentElement.style.setProperty('--flag-' + id + '-y', s.y + 'px');
        document.documentElement.style.setProperty('--flag-' + id + '-scale', s.scale);
    }

    function updateHUD() {
        const s = window.vfsState[currentFlag];
        document.getElementById('vfs-val-x').innerText = s.x + '%';
        document.getElementById('vfs-val-y').innerText = s.y + 'px';
        document.getElementById('vfs-val-scale').innerText = s.scale.toFixed(2);
        document.getElementById('vfs-slider-scale-label').innerText = s.scale.toFixed(2);
        document.getElementById('vfs-scale-slider').value = s.scale;
    }

    function highlightActiveFlag() {
        const el1 = document.querySelector('.buddhist-flag-right-1');
        const el2 = document.querySelector('.buddhist-flag-right-2');
        if (el1) el1.style.outline = currentFlag === 'r1' ? '2px dashed rgba(246, 200, 96, 0.7)' : 'none';
        if (el2) el2.style.outline = currentFlag === 'r2' ? '2px dashed rgba(246, 200, 96, 0.7)' : 'none';
    }

    // Direct On-Screen Drag & Drop
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialX = 0;
    let initialY = 0;

    function attachDragHandles() {
        ['buddhist-flag-right-1', 'buddhist-flag-right-2'].forEach((cls, idx) => {
            const flagId = idx === 0 ? 'r1' : 'r2';
            const el = document.querySelector('.' + cls);
            if (!el || el.__dragAttached) return;
            el.__dragAttached = true;
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'grab';

            el.addEventListener('mousedown', function(e) {
                if (e.button !== 0) return;
                isDragging = true;
                currentFlag = flagId;
                selectFlag(flagId);
                el.style.cursor = 'grabbing';
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                initialX = window.vfsState[flagId].x;
                initialY = window.vfsState[flagId].y;
                e.preventDefault();
            });

            // Mousewheel scale on flag
            el.addEventListener('wheel', function(e) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.01 : -0.01;
                let newScale = Math.round((window.vfsState[flagId].scale + delta) * 100) / 100;
                newScale = Math.max(0.10, Math.min(0.60, newScale));
                window.vfsState[flagId].scale = newScale;
                applyToDOM(flagId);
                updateHUD();
            }, { passive: false });
        });
    }

    window.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const temple = document.querySelector('[data-framer-name="Temple"]');
        const templeWidth = temple ? temple.offsetWidth : window.innerWidth;
        const dxPixels = e.clientX - dragStartX;
        const dyPixels = e.clientY - dragStartY;

        const dxPercent = (dxPixels / templeWidth) * 100;
        window.vfsState[currentFlag].x = Math.round((initialX + dxPercent) * 10) / 10;
        window.vfsState[currentFlag].y = Math.round(initialY + dyPixels);

        applyToDOM(currentFlag);
        updateHUD();
    });

    window.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            const el1 = document.querySelector('.buddhist-flag-right-1');
            const el2 = document.querySelector('.buddhist-flag-right-2');
            if (el1) el1.style.cursor = 'grab';
            if (el2) el2.style.cursor = 'grab';
        }
    });

    // Keyboard Arrow Keys Control
    window.addEventListener('keydown', function(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            // Check if user is typing in an input
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
            e.preventDefault();
            const step = e.shiftKey ? 1.0 : 0.2;
            const stepY = e.shiftKey ? 10 : 2;

            if (e.key === 'ArrowLeft') nudge(-step, 0);
            if (e.key === 'ArrowRight') nudge(step, 0);
            if (e.key === 'ArrowUp') nudge(0, -stepY);
            if (e.key === 'ArrowDown') nudge(0, stepY);
        }
    });

    // Save to Server
    window.saveFlagSettings = function() {
        const btn = document.getElementById('vfs-save-btn');
        const status = document.getElementById('vfs-status-msg');
        btn.innerText = 'Saving...';

        const payload = {
            '--flag-r1-x': window.vfsState.r1.x + '%',
            '--flag-r1-y': window.vfsState.r1.y + 'px',
            '--flag-r1-scale': window.vfsState.r1.scale.toFixed(2),
            '--flag-r2-x': window.vfsState.r2.x + '%',
            '--flag-r2-y': window.vfsState.r2.y + 'px',
            '--flag-r2-scale': window.vfsState.r2.scale.toFixed(2)
        };

        fetch('/api/save-flags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            btn.innerText = '💾 Save to index.html';
            status.innerText = '✅ Saved permanently to index.html!';
            status.style.display = 'block';
            setTimeout(() => { status.style.display = 'none'; }, 3000);
        })
        .catch(err => {
            btn.innerText = '💾 Save to index.html';
            status.innerText = 'Copied to clipboard (offline mode)';
            status.style.display = 'block';
            copyFlagCSS();
        });
    };

    window.copyFlagCSS = function() {
        const css = 
\`/* Right Flag 1 */
--flag-r1-x: \${window.vfsState.r1.x}%;
--flag-r1-y: \${window.vfsState.r1.y}px;
--flag-r1-scale: \${window.vfsState.r1.scale.toFixed(2)};

/* Right Flag 2 */
--flag-r2-x: \${window.vfsState.r2.x}%;
--flag-r2-y: \${window.vfsState.r2.y}px;
--flag-r2-scale: \${window.vfsState.r2.scale.toFixed(2)};\`;

        navigator.clipboard.writeText(css).then(() => {
            const status = document.getElementById('vfs-status-msg');
            status.innerText = '📋 CSS copied to clipboard!';
            status.style.display = 'block';
            setTimeout(() => { status.style.display = 'none'; }, 2500);
        });
    };

    // Initialize
    window.addEventListener('load', () => {
        readCurrentVariables();
        attachDragHandles();
        highlightActiveFlag();
    });
    setTimeout(() => {
        readCurrentVariables();
        attachDragHandles();
        highlightActiveFlag();
    }, 600);
})();
</script>
`;

console.log('Script length:', flagStudioScript.length);
