// =========================================================================
// OPTIMIZED 3D BUDDHIST TEMPLE SILK CLOTH SIMULATION (WebGL2)
// True 3D Vertex Physics + Realistic Shading + 24 FPS Locked Medium Setting
// =========================================================================

(function() {
    const vertexShaderSource = `#version 300 es
precision highp float;
layout(location=0) in vec2 aPos;
layout(location=1) in vec2 aUV;

uniform float uTime;
uniform float uSpeed;
uniform float uWindStrength;
uniform float uIsLeft;

out vec2 vUV;
out vec3 vNormal;
out vec3 vPos;
out float vIsLeft;

vec3 computeDisplacedPos(vec2 uv) {
    float u = (uIsLeft > 0.5) ? (1.0 - uv.x) : uv.x;
    float v = uv.y;
    float t = uTime * uSpeed;

    // Firm anchor at flagpole & top rod
    float poleClamp = smoothstep(0.015, 0.12, u);
    float rodClamp  = smoothstep(0.015, 0.12, v);
    float anchorMask = poleClamp * rodClamp;

    // Freedom expands gently downward
    float drapeFreedom = 0.40 + 0.60 * pow(v, 0.85);
    float env = anchorMask * drapeFreedom;

    // Distinct rolling wave harmonics across silk drape
    float r = length(vec2(u, v * 0.75));
    float pr = 12.0 * r - 3.2 * t;
    float pv = 9.0 * v - 2.8 * t;
    float pu = 10.0 * u - 2.4 * t;
    float pdiag = 8.0 * u + 6.0 * v - 3.4 * t;

    // Ripple wave pattern
    float wavePattern = 0.36 * sin(pr) 
                      + 0.30 * sin(pv) 
                      + 0.22 * sin(pu) 
                      + 0.18 * sin(pdiag);

    // Doubled displacement & wave amplitude: 0.36 (was 0.18)
    float zAmp = uWindStrength * 0.36;
    float z = env * wavePattern * zAmp;

    // Doubled lateral & vertical silk drape drift
    float xSign = (uIsLeft > 0.5) ? 1.0 : -1.0;
    float xOff = xSign * env * 0.045 * cos(pu) * uWindStrength;
    float yOff = env * 0.024 * sin(pv) * uWindStrength;

    float posX = (uv.x * 2.0 - 1.0) + xOff;
    float posY = ((1.0 - v) * 2.0 - 1.0) + yOff;

    return vec3(posX, posY, z);
}

void main() {
    vec3 p = computeDisplacedPos(aUV);

    // Normal calculation
    float delta = 0.02;
    vec3 pR = computeDisplacedPos(vec2(min(aUV.x + delta, 1.0), aUV.y));
    vec3 pD = computeDisplacedPos(vec2(aUV.x, min(aUV.y + delta, 1.0)));

    vec3 dX = pR - p;
    vec3 dY = p - pD;
    vec3 n = normalize(cross(dX, dY));
    if (n.z < 0.0) n = -n;

    gl_Position = vec4(p.x, p.y, p.z * 0.5, 1.0);
    vUV = aUV;
    vNormal = n;
    vPos = p;
    vIsLeft = uIsLeft;
}
`;

    const fragmentShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform float uShading;
uniform float uBrightness;
uniform float uSheen;

in vec2 vUV;
in vec3 vNormal;
in vec3 vPos;
in float vIsLeft;

out vec4 fragColor;

void main() {
    vec4 texColor = texture(uTex, vUV);
    if (texColor.a < 0.05) discard;

    vec3 lightDir = normalize(vec3(-0.35, 0.70, 0.65));
    float diff = max(dot(vNormal, lightDir), 0.0);
    float ambient = 0.60;
    float lightIntensity = ambient + (1.0 - ambient) * diff;

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfVec), 0.0), 16.0);

    vec3 shaded = texColor.rgb * mix(1.0, lightIntensity, uShading);
    shaded += vec3(1.0, 0.92, 0.75) * spec * uSheen * texColor.a;
    shaded *= uBrightness;

    fragColor = vec4(shaded, texColor.a);
}
`;

    function buildMesh(cols, rows) {
        const vertices = [];
        const uvs = [];
        const indices = [];

        for (let r = 0; r <= rows; r++) {
            const v = r / rows;
            for (let c = 0; c <= cols; c++) {
                const u = c / cols;
                vertices.push(u * 2 - 1, (1 - v) * 2 - 1);
                uvs.push(u, v);
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const i0 = r * (cols + 1) + c;
                const i1 = i0 + 1;
                const i2 = (r + 1) * (cols + 1) + c;
                const i3 = i2 + 1;
                indices.push(i0, i2, i1, i1, i2, i3);
            }
        }

        return {
            vertices: new Float32Array(vertices),
            uvs: new Float32Array(uvs),
            indices: new Uint16Array(indices)
        };
    }

    const sharedMesh = buildMesh(22, 44);
    const imageCache = {};

    function preloadImage(url, callback) {
        const cached = imageCache[url];
        if (cached && cached.complete && cached.naturalWidth > 0) {
            callback(cached);
            return;
        }
        if (cached && !cached.complete) {
            cached.addEventListener('load', () => {
                if (cached.naturalWidth > 0) callback(cached);
            }, { once: true });
            return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        imageCache[url] = img;

        img.addEventListener('load', () => {
            if (img.naturalWidth > 0) {
                callback(img);
            }
        }, { once: true });

        img.addEventListener('error', () => {
            console.warn('Flag texture load retry:', url);
            // Retry once without crossOrigin if needed
            setTimeout(() => {
                const retryImg = new Image();
                retryImg.src = url;
                retryImg.addEventListener('load', () => {
                    if (retryImg.naturalWidth > 0) callback(retryImg);
                }, { once: true });
            }, 500);
        }, { once: true });
    }

    function initFlagCanvas(canvas, cfg) {
        if (canvas.__webglInitialized) return;
        canvas.__webglInitialized = true;

        const gl = canvas.getContext('webgl2', {
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: 'low-power'
        });
        if (!gl) return;

        function compileShader(type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        }

        const prog = gl.createProgram();
        gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vertexShaderSource));
        gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource));
        gl.linkProgram(prog);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, sharedMesh.vertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        const tbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
        gl.bufferData(gl.ARRAY_BUFFER, sharedMesh.uvs, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sharedMesh.indices, gl.STATIC_DRAW);

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // Clean transparent placeholder (zero yellow box artifact)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

        preloadImage(cfg.texture, function(img) {
            if (!img || img.naturalWidth === 0) return;
            try {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            } catch (err) {
                console.warn('Could not bind WebGL flag texture:', err);
            }
        });

        const uTexLoc = gl.getUniformLocation(prog, 'uTex');
        const uIsLeftLoc = gl.getUniformLocation(prog, 'uIsLeft');
        const uTimeLoc = gl.getUniformLocation(prog, 'uTime');
        const uSpeedLoc = gl.getUniformLocation(prog, 'uSpeed');
        const uWindStrengthLoc = gl.getUniformLocation(prog, 'uWindStrength');
        const uShadingLoc = gl.getUniformLocation(prog, 'uShading');
        const uBrightnessLoc = gl.getUniformLocation(prog, 'uBrightness');
        const uSheenLoc = gl.getUniformLocation(prog, 'uSheen');

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);

        // Doubled speed and vivid wave folds
        const speed = 0.90;
        const folds = 1.25;
        const shading = 0.45;
        const sheen = 0.16;
        const brightness = 1.0;

        // 24 frames per second locked
        const targetFPS = 24;
        const frameInterval = 1000 / targetFPS;
        let lastFrameTime = 0;

        const startTime = performance.now();
        let isVisible = !document.hidden;

        // Sleep WebGL rendering cleanly when user switches tabs
        document.addEventListener('visibilitychange', () => {
            isVisible = !document.hidden;
        });

        function renderFrame(now) {
            requestAnimationFrame(renderFrame);

            if (!canvas.isConnected || !isVisible) return;

            if (!now) now = performance.now();
            const delta = now - lastFrameTime;
            if (delta < frameInterval) return;

            lastFrameTime = now - (delta % frameInterval);

            const time = (now - startTime) / 1000 + (cfg.phase || 0);

            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.useProgram(prog);
            gl.bindVertexArray(vao);

            gl.uniform1i(uTexLoc, 0);
            gl.uniform1f(uTimeLoc, time);
            gl.uniform1f(uSpeedLoc, speed);
            gl.uniform1f(uWindStrengthLoc, folds);
            gl.uniform1f(uIsLeftLoc, cfg.isLeft ? 1.0 : 0.0);
            gl.uniform1f(uShadingLoc, shading);
            gl.uniform1f(uSheenLoc, sheen);
            gl.uniform1f(uBrightnessLoc, brightness);

            gl.drawElements(gl.TRIANGLES, sharedMesh.indices.length, gl.UNSIGNED_SHORT, 0);
        }

        requestAnimationFrame(renderFrame);
    }

    const flagConfigs = [
        // Walkway Pillars — Active silk cloth ripple physics on ALL poles
        { className: 'buddhist-flag-right-1', prefix: '--flag-r1', phase: 0.0, isLeft: false, texture: './images/Right flag.webp', animated: true },
        { className: 'buddhist-flag-right-2', prefix: '--flag-r2', phase: 1.4, isLeft: false, texture: './images/Right flag.webp', animated: true },
        { className: 'buddhist-flag-right-3', prefix: '--flag-r3', phase: 2.8, isLeft: false, texture: './images/Right flag.webp', animated: true },
        { className: 'buddhist-flag-right-4', prefix: '--flag-r4', phase: 4.2, isLeft: false, texture: './images/Right flag.webp', animated: true },
        { className: 'buddhist-flag-left-1',  prefix: '--flag-l1', phase: 0.8, isLeft: true,  texture: './images/Left Flag.webp',  animated: true },
        { className: 'buddhist-flag-left-2',  prefix: '--flag-l2', phase: 2.2, isLeft: true,  texture: './images/Left Flag.webp',  animated: true },
        { className: 'buddhist-flag-left-3',  prefix: '--flag-l3', phase: 3.6, isLeft: true,  texture: './images/Left Flag.webp',  animated: true },
        { className: 'buddhist-flag-left-4',  prefix: '--flag-l4', phase: 5.0, isLeft: true,  texture: './images/Left Flag.webp',  animated: true }
    ];

    function getVisibleTemples() {
        const temples = Array.from(document.querySelectorAll('[data-framer-name="Temple"]'));
        const visible = [];
        temples.forEach(t => {
            const style = window.getComputedStyle(t);
            const rect = t.getBoundingClientRect();
            if (style.display !== 'none' && style.visibility !== 'hidden' && (rect.width > 20 || t.offsetWidth > 20)) {
                visible.push(t);
            }
        });
        if (visible.length > 0) return visible;
        if (temples.length > 0) return [temples[0]];
        return [];
    }

    // Attach MutationObserver so React / Framer client hydration never detaches flags permanently
    function attachTempleObserver(temple) {
        if (temple.__buddhistFlagsObserver) return;
        const observer = new MutationObserver(() => {
            const hasAllFlags = flagConfigs.every(cfg => temple.querySelector('.' + cfg.className));
            if (!hasAllFlags) {
                mountBuddhistFlags();
            }
        });
        observer.observe(temple, { childList: true });
        temple.__buddhistFlagsObserver = observer;
    }

    function mountBuddhistFlags() {
        const activeTemples = getVisibleTemples();
        if (!activeTemples || activeTemples.length === 0) return false;

        activeTemples.forEach(temple => {
            attachTempleObserver(temple);

            flagConfigs.forEach(cfg => {
                let container = temple.querySelector('.' + cfg.className);
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'buddhist-pillar-flag-container ' + cfg.className;

                    if (cfg.animated) {
                        const canvas = document.createElement('canvas');
                        canvas.className = 'buddhist-flag-webgl-canvas';
                        canvas.width = 195;
                        canvas.height = 748;
                        container.appendChild(canvas);
                        temple.appendChild(container);
                        initFlagCanvas(canvas, cfg);
                    } else {
                        const img = document.createElement('img');
                        img.className = 'buddhist-flag-static-img';
                        img.src = cfg.texture;
                        img.width = 195;
                        img.height = 748;
                        img.alt = 'Buddhist Flag';
                        img.loading = 'eager';
                        img.decoding = 'sync';
                        container.appendChild(img);
                        temple.appendChild(container);
                    }
                } else {
                    if (cfg.animated) {
                        const canvas = container.querySelector('.buddhist-flag-webgl-canvas');
                        if (canvas && !canvas.__webglInitialized) {
                            initFlagCanvas(canvas, cfg);
                        }
                    }
                }
            });
        });
        return true;
    }

    // Multi-phase hydration lifecycle mounts
    mountBuddhistFlags();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountBuddhistFlags);
    }
    window.addEventListener('load', mountBuddhistFlags);

    // Guard against delayed Framer SSR -> React hydration DOM replacement
    [100, 300, 600, 1000, 1500, 2500, 4000].forEach(delay => {
        setTimeout(mountBuddhistFlags, delay);
    });

    // Periodic heartbeat to guarantee flags never vanish across all viewports
    setInterval(() => {
        mountBuddhistFlags();
    }, 2000);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            mountBuddhistFlags();
        }, 150);
    });
})();
