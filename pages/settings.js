(function () {
    const STORAGE_KEY = 'tatua-settings';

    const fontStacks = {
        asap: "'Asap', -apple-system, BlinkMacSystemFont, sans-serif",
        lexend: "'Lexend Deca', -apple-system, BlinkMacSystemFont, sans-serif",
        inter: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    };

    const defaults = {
        theme: 'purple',
        mode: 'light',
        fontScale: 100,
        spacing: 1,
        radius: 4,
        font: 'asap'
    };

    function loadSettings() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            return Object.assign({}, defaults, saved || {});

        } catch (e) {
            return { ...defaults };
        }
    }

    function saveSettings(s) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(s)
        );
    }

    /* =========================================================
       CORE: always runs, on every page, panel or no panel.
       This is what makes settings PERSIST across pages.
       ========================================================= */
    function applyCore(s) {

        const html = document.documentElement;

        html.setAttribute('data-theme', s.theme);
        html.setAttribute('data-mode', s.mode);

        html.style.fontSize = s.fontScale + '%';

        html.style.setProperty('--space-scale', s.spacing);
        html.style.setProperty('--radius-base', s.radius + 'px');
        html.style.setProperty('--font-body', fontStacks[s.font]);
    }

    /* =========================================================
       PANEL SYNC: only runs if the settings panel markup
       actually exists on this page (currently: home.html only).
       ========================================================= */
    function applyPanel(s) {

        /* Sync theme buttons */
        document
            .querySelectorAll('[data-theme-btn]')
            .forEach(btn => {
                btn.setAttribute(
                    'aria-pressed',
                    btn.dataset.themeBtn === s.theme
                );
            });

        /* Sync light/dark buttons */
        document
            .querySelectorAll('[data-mode-btn]')
            .forEach(btn => {
                btn.setAttribute(
                    'aria-pressed',
                    btn.dataset.modeBtn === s.mode
                );
            });

        const fontScaleEl = document.getElementById('fontScale');
        const fontScaleValueEl = document.getElementById('fontScaleValue');
        if (fontScaleEl) fontScaleEl.value = s.fontScale;
        if (fontScaleValueEl) fontScaleValueEl.textContent = s.fontScale + '%';

        const spacingEl = document.getElementById('spacing');
        const spacingValueEl = document.getElementById('spacingValue');
        if (spacingEl) spacingEl.value = s.spacing;
        if (spacingValueEl) {
            spacingValueEl.textContent =
                s.spacing < 0.95
                    ? 'Compact'
                    : s.spacing > 1.05
                        ? 'Relaxed'
                        : 'Default';
        }

        const radiusEl = document.getElementById('radius');
        const radiusValueEl = document.getElementById('radiusValue');
        if (radiusEl) radiusEl.value = s.radius;
        if (radiusValueEl) radiusValueEl.textContent = s.radius + 'px';

        const fontFamilyEl = document.getElementById('fontFamily');
        if (fontFamilyEl) fontFamilyEl.value = s.font;
    }

    function applySettings(s) {
        applyCore(s);
        applyPanel(s);
    }

    /* =========================================================
       INITIAL STATE — runs on every page
       ========================================================= */

    let state = loadSettings();

    applySettings(state);

    /* =========================================================
       UPDATE STATE
       ========================================================= */

    function update(partial) {

        state = Object.assign(
            {},
            state,
            partial
        );

        applySettings(state);
        saveSettings(state);
    }

    /* =========================================================
       SETTINGS PANEL WIRING — only if the panel exists
       ========================================================= */

    const panel = document.getElementById('settingsPanel');
    const backdrop = document.getElementById('settingsBackdrop');
    const toggle = document.getElementById('settingsToggle');

    if (panel && backdrop && toggle) {

        function openPanel() {
            panel.classList.add('open');
            backdrop.classList.add('open');
        }

        function closePanel() {
            panel.classList.remove('open');
            backdrop.classList.remove('open');
        }

        toggle.addEventListener('click', () => {
            panel.classList.contains('open')
                ? closePanel()
                : openPanel();
        });

        backdrop.addEventListener('click', closePanel);

        /* Color themes */
        document
            .querySelectorAll('[data-theme-btn]')
            .forEach(btn => {
                btn.addEventListener('click', () => {
                    update({ theme: btn.dataset.themeBtn });
                });
            });

        /* Light / dark mode */
        document
            .querySelectorAll('[data-mode-btn]')
            .forEach(btn => {
                btn.addEventListener('click', () => {
                    update({ mode: btn.dataset.modeBtn });
                });
            });

        /* Font size */
        const fontScaleEl = document.getElementById('fontScale');
        if (fontScaleEl) {
            fontScaleEl.addEventListener('input', e => {
                update({ fontScale: Number(e.target.value) });
            });
        }

        /* Spacing */
        const spacingEl = document.getElementById('spacing');
        if (spacingEl) {
            spacingEl.addEventListener('input', e => {
                update({ spacing: Number(e.target.value) });
            });
        }

        /* Corner radius */
        const radiusEl = document.getElementById('radius');
        if (radiusEl) {
            radiusEl.addEventListener('input', e => {
                update({ radius: Number(e.target.value) });
            });
        }

        /* Font family */
        const fontFamilyEl = document.getElementById('fontFamily');
        if (fontFamilyEl) {
            fontFamilyEl.addEventListener('change', e => {
                update({ font: e.target.value });
            });
        }
    }

})();