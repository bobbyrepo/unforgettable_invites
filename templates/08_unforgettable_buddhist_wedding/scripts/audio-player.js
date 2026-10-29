(function() {
    // -------------------------------------------------------------
    // Audio Player Controller
    // -------------------------------------------------------------
    const audioBtn = document.getElementById('buddhist-audio-controller');
    const audio = document.getElementById('buddhist-audio-element');
    const eqBars = document.getElementById('audio-eq-bars');
    let isPlaying = false;

    function toggleAudio() {
        if (isPlaying) {
            audio.pause();
            eqBars.classList.remove('eq-playing');
            isPlaying = false;
        } else {
            audio.play().then(() => {
                eqBars.classList.add('eq-playing');
                isPlaying = true;
            }).catch(() => {
                console.log('Audio autoplay prevented by user interaction policy');
            });
        }
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', toggleAudio);
    }

    // Auto-start on first user interaction anywhere
    const startAudioOnce = function() {
        if (!isPlaying && audio) {
            audio.play().then(() => {
                eqBars.classList.add('eq-playing');
                isPlaying = true;
            }).catch(() => {});
        }
        window.removeEventListener('click', startAudioOnce);
        window.removeEventListener('scroll', startAudioOnce);
        window.removeEventListener('touchstart', startAudioOnce);
    };
    window.addEventListener('click', startAudioOnce, { passive: true });
    window.addEventListener('scroll', startAudioOnce, { passive: true });
    window.addEventListener('touchstart', startAudioOnce, { passive: true });

    // -------------------------------------------------------------
})();