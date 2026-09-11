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

    function applySettings(s) {

        const html = document.documentElement;

        html.setAttribute(
            'data-theme',
            s.theme
        );

        html.setAttribute(
            'data-mode',
            s.mode
        );

        html.style.fontSize =
            s.fontScale + '%';

        html.style.setProperty(
            '--space-scale',
            s.spacing
        );

        html.style.setProperty(
            '--radius-base',
            s.radius + 'px'
        );

        html.style.setProperty(
            '--font-body',
            fontStacks[s.font]
        );


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


        /* Sync font size */

        document.getElementById('fontScale').value =
            s.fontScale;

        document.getElementById('fontScaleValue').textContent =
            s.fontScale + '%';


        /* Sync spacing */

        document.getElementById('spacing').value =
            s.spacing;

        document.getElementById('spacingValue').textContent =
            s.spacing < 0.95
                ? 'Compact'
                : s.spacing > 1.05
                    ? 'Relaxed'
                    : 'Default';


        /* Sync radius */

        document.getElementById('radius').value =
            s.radius;

        document.getElementById('radiusValue').textContent =
            s.radius + 'px';


        /* Sync font */

        document.getElementById('fontFamily').value =
            s.font;
    }


    /* =========================================================
       INITIAL STATE
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
       SETTINGS PANEL
       ========================================================= */

    const panel =
        document.getElementById('settingsPanel');

    const backdrop =
        document.getElementById('settingsBackdrop');

    const toggle =
        document.getElementById('settingsToggle');


    function openPanel() {

        panel.classList.add('open');

        backdrop.classList.add('open');
    }


    function closePanel() {

        panel.classList.remove('open');

        backdrop.classList.remove('open');
    }


    toggle.addEventListener(
        'click',
        () => {

            panel.classList.contains('open')
                ? closePanel()
                : openPanel();

        }
    );


    backdrop.addEventListener(
        'click',
        closePanel
    );


    /* =========================================================
       COLOR THEMES
       ========================================================= */

    document
        .querySelectorAll('[data-theme-btn]')
        .forEach(btn => {

            btn.addEventListener(
                'click',
                () => {

                    update({
                        theme:
                            btn.dataset.themeBtn
                    });

                }
            );

        });


    /* =========================================================
       LIGHT / DARK MODE
       ========================================================= */

    document
        .querySelectorAll('[data-mode-btn]')
        .forEach(btn => {

            btn.addEventListener(
                'click',
                () => {

                    update({
                        mode:
                            btn.dataset.modeBtn
                    });

                }
            );

        });


    /* =========================================================
       FONT SIZE
       ========================================================= */

    document
        .getElementById('fontScale')
        .addEventListener(
            'input',
            e => {

                update({
                    fontScale:
                        Number(e.target.value)
                });

            }
        );


    /* =========================================================
       SPACING
       ========================================================= */

    document
        .getElementById('spacing')
        .addEventListener(
            'input',
            e => {

                update({
                    spacing:
                        Number(e.target.value)
                });

            }
        );


    /* =========================================================
       CORNER RADIUS
       ========================================================= */

    document
        .getElementById('radius')
        .addEventListener(
            'input',
            e => {

                update({
                    radius:
                        Number(e.target.value)
                });

            }
        );


    /* =========================================================
       FONT FAMILY
       ========================================================= */

    document
        .getElementById('fontFamily')
        .addEventListener(
            'change',
            e => {

                update({
                    font:
                        e.target.value
                });

            }
        );

})();