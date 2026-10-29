const fs = require('fs');
const path = require('path');

const tDir = 'E:/Unforgettable_Invites/Web_Templates/templates/08_unforgettable_buddhist_wedding';
const htmlFile = path.join(tDir, 'index.html');
const flagSimFile = path.join(tDir, 'scripts', 'flag-simulation.js');
const jsBundleFile = path.join(tDir, 'scripts', 'VR998DU3WSRaZIpYrcWhMoQxMWGXSrJFDK6jx2eUMjE.DKHZzuKc.mjs');

console.log('--- Optimizing Template 8 Performance ---');

// 1. Optimize flag-simulation.js
if (fs.existsSync(flagSimFile)) {
    let code = fs.readFileSync(flagSimFile, 'utf8');

    // Replace PNG textures with WebP
    code = code.replace(/\.\/images\/Right flag\.png/g, './images/Right flag.webp');
    code = code.replace(/\.\/images\/Left Flag\.png/g, './images/Left Flag.webp');

    // Add 30 FPS throttle + IntersectionObserver off-screen pause to renderFrame
    const oldRenderBlock = `gl.drawElements(gl.TRIANGLES, sharedMesh.indices.length, gl.UNSIGNED_INT, 0);
            requestAnimationFrame(renderFrame);
        }

        requestAnimationFrame(renderFrame);`;

    const newRenderBlock = `gl.drawElements(gl.TRIANGLES, sharedMesh.indices.length, gl.UNSIGNED_INT, 0);
        }

        let lastTime = 0;
        const fpsInterval = 1000 / 30; // Solid 30 FPS cap for 3D physics
        let isVisible = true;

        try {
            const io = new IntersectionObserver((entries) => {
                isVisible = entries[0].isIntersecting;
            }, { threshold: 0.05 });
            io.observe(canvas);
        } catch(e) {}

        function loop(now) {
            requestAnimationFrame(loop);
            if (!isVisible) return; // Zero GPU usage when scrolled past
            const elapsed = now - lastTime;
            if (elapsed < fpsInterval) return;
            lastTime = now - (elapsed % fpsInterval);
            renderFrame();
        }

        requestAnimationFrame(loop);`;

    // Replace render loop
    if (code.includes('gl.drawElements(gl.TRIANGLES, sharedMesh.indices.length, gl.UNSIGNED_INT, 0);')) {
        code = code.replace(/gl\.drawElements\(gl\.TRIANGLES, sharedMesh\.indices\.length, gl\.UNSIGNED_INT, 0\);[\s\S]*?requestAnimationFrame\(renderFrame\);\s*\}/, 
            `gl.drawElements(gl.TRIANGLES, sharedMesh.indices.length, gl.UNSIGNED_INT, 0);\n        }`);
        code = code.replace(/requestAnimationFrame\(renderFrame\);\s*\}\s*\/\/\s*8 Flags:/, 
            `${newRenderBlock}\n    }\n\n    // 8 Flags:`);
    }

    // Remove the global MutationObserver on document.body
    code = code.replace(/try\s*\{\s*let mountTimeout[\s\S]*?observer\.observe\(document\.body[\s\S]*?\}\s*catch\(e\)\s*\{\}/, `
    // Targeted mounts without global scroll-time DOM scanning
    setTimeout(mountBuddhistFlags, 400);
    setTimeout(mountBuddhistFlags, 1200);
    `);

    fs.writeFileSync(flagSimFile, code, 'utf8');
    console.log('✓ flag-simulation.js throttled to 30 FPS, WebP textures & MutationObserver removed');
}

// 2. Update index.html
if (fs.existsSync(htmlFile)) {
    let html = fs.readFileSync(htmlFile, 'utf8');

    // Remove live-sync.js script tag
    html = html.replace(/<script[^>]*src=["']\.\/scripts\/live-sync\.js["'][^>]*><\/script>\s*/gi, '');

    // Replace heavy PNGs with optimized WebP
    html = html.replace(/\.\/images\/Trees\.png/g, './images/Trees.webp');
    html = html.replace(/\.\/images\/lKVzZvE9zjHal1zLmfO4koCjo\.png/g, './images/lKVzZvE9zjHal1zLmfO4koCjo.webp');
    html = html.replace(/\.\/images\/Right flag\.png/g, './images/Right flag.webp');
    html = html.replace(/\.\/images\/Left Flag\.png/g, './images/Left Flag.webp');

    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log('✓ index.html updated: live-sync removed, WebP images linked');
}

// 3. Update JS Bundle
if (fs.existsSync(jsBundleFile)) {
    let bundle = fs.readFileSync(jsBundleFile, 'utf8');
    bundle = bundle.replace(/\.\/images\/lKVzZvE9zjHal1zLmfO4koCjo\.png/g, './images/lKVzZvE9zjHal1zLmfO4koCjo.webp');
    fs.writeFileSync(jsBundleFile, bundle, 'utf8');
    console.log('✓ JS bundle updated: repointed to 666 KB WebP hero');
}

console.log('--- Template 8 Optimization Complete ---');
