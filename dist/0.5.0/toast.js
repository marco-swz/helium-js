const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    position: fixed;\n    top: unset;\n    right: unset;\n    left: 50%;\n    bottom: 10px;\n    transform: translateX(-50%);\n    width: 300px;\n    font-size: 16px;\n    font-weight: 500;\n    z-index: 500;\n    background-color: white;\n}\n\n:host([position=bottom-right]) {\n    top: unset;\n    left: unset;\n    bottom: 10px;\n    right: 10px;\n    transform: unset;\n}\n\n:host([position=bottom-left]) {\n    top: unset;\n    right: unset;\n    bottom: 10px;\n    left: 10px;\n    transform: unset;\n}\n\n:host([position=top-left]) {\n    bottom: unset;\n    right: unset;\n    top: 10px;\n    left: 10px;\n    transform: unset;\n}\n\n:host([position=top-right]) {\n    bottom: unset;\n    left: unset;\n    top: 10px;\n    right: 10px;\n    transform: unset;\n}\n\n:host([position=top]) {\n    bottom: unset;\n    right: unset;\n    top: 10px;\n    left: 50%;\n    transform: translateX(-50%);\n}\n\n#contToasts {\n    display: flex;\n    flex-direction: column;\n    gap: 10px;\n}\n\n#toast {\n    border: 1px solid grey;\n    border-radius: var(--he-toast-radius, 3px);\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n    border-left: 5px solid steelblue;\n}\n\n#toast[type=warn] {\n    border-left-color: var(--he-toast-clr-warn, orange);\n}\n\n#toast[type=error] {\n    border-left-color: var(--he-toast-clr-error, indianred);\n}\n\n#toast[type=success] {\n    border-left-color: var(--he-toast-clr-success, seagreen);\n}\n\n#bar {\n    width: 100%;\n    height: 3px;\n    background-color: lightgrey;\n    margin-right: auto;\n}\n\n#contMain {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n}\n\n#contText {\n    padding: 1rem 2rem;\n    font-size: inherit;\n}\n\n#btnClose {\n    border-radius: 50%;\n    font-size: 20px;\n    font-weight: 500;\n    margin-right: 10px;\n    border-radius: 50%;\n    width: 35px;\n    height: 35px;\n    text-align: center;\n    vertical-align: middle;\n    cursor: pointer;\n}\n\n#btnClose:hover {\n    background-color: whitesmoke;\n}\n");

/**
 * A toast element for quick notification.
 *
 * @element he-toast
 *
 * @attr {'bottom-left'|'bottom-right'|'top-left'|'top-right'|'top'} position - The position of the toast on the screen
 * @attr [timeout-ms = 5000] - The visible duration of the toast
 *
 * @cssprop [--he-toast-clr-success = seagreen] - The accent color for success notifications
 * @cssprop [--he-toast-clr-warn = orange] - The accent color for warning notifications
 * @cssprop [--he-toast-clr-error = indianred] - The accent color for error notifications
 * @cssprop [--he-toast-radius = 3px] - The border radius of the toast
 *
 * @extends HTMLElement
 *
 * @todo Support for mobile devices and small screens
 */
class HeliumToast extends HTMLElement {
    static observedAttributes = [
        'position',
    ];
    /** @type {HTMLDivElement} */
    $contToasts;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals();


        this.$contToasts = document.createElement('div');
        this.$contToasts.id = 'contToasts';

        shadow.append(this.$contToasts);
        shadow.adoptedStyleSheets = [sheet];
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
    }

    connectedCallback() {
    }

    /**
     * Starts the hide animation and deletes the toast.
     * @param {HTMLDivElement} $toast - The toast (not a `he-toast` element, which is only the container for toasts)
     * @returns void
     */
    hideToast($toast) {
        const animation = $toast.animate(
            [
                { opacity: '1' },
                { opacity: '0' },
            ], {
                duration: 200,
            }
        );
        animation.onfinish = () => $toast.remove();
    }


    /**
     * Shows a toast with the given message and of given type.
     * @param {string} content
     * @param {null|'info'|'warn'|'error'} type 
     */
    _showToast(message, type) {
        const $toast = this._renderToast(message, type);

        // NOTE(marco): For now disabled
        //$toast.animate(
        //    [
        //        { opacity: '0' },
        //        { opacity: '1' },
        //    ], {
        //        duration: 200,
        //    }
        //)

        const position = this.getAttribute('position') ?? '';
        if (position.includes('top')) {
            this.$contToasts.prepend($toast);
        } else {
            this.$contToasts.append($toast);
        }
    }

    _renderToast(content,type) {
        const duration = this.getAttribute('timeout-ms') ?? 5000;

        const $toast = document.createElement('div');
        $toast.id = 'toast';
        $toast.setAttribute('type', type);

        const $bar = document.createElement('div');
        $bar.id = 'bar';
        $bar.style.width = '0%';
        const animation = $bar.animate(
            [
                { width: '100%' },
                { width: '0%' },
            ], {
                duration: Number(duration),
            }
        );
        animation.onfinish = () => this.hideToast($toast);
        $toast.append($bar);

        const $contMain = document.createElement('div');
        $contMain.id = 'contMain';
        $toast.append($contMain);

        const $contText = document.createElement('div');
        $contText.id = 'contText';
        $contText.innerHTML = content;
        $contMain.append($contText);

        const $btnClose = document.createElement('div');
        $btnClose.id = 'btnClose';
        $btnClose.onclick = () => this.hideToast($toast);
        $btnClose.innerHTML = 'x';

        $contMain.append($btnClose);

        return $toast;
    }

    static showToast(text, type) {
        /** @type {HeliumToast} */
        let $toast = document.querySelector('#he-toast-temp');
        if ($toast === null) {
            $toast = document.createElement('he-toast');
            $toast.id = 'he-toast-temp';
            $toast.setAttribute('timeout-ms', 5000);
            $toast.setAttribute('position', 'top-right');
            document.body.append($toast);
        }

        $toast._showToast(text, type);
    }
}

if (!customElements.get('he-toast')) {
    window.HeliumToast = HeliumToast;
    customElements.define("he-toast", HeliumToast);

    document.addEventListener("he-toast", function(e) {
        HeliumToast.showToast(e.detail.value);
    });

    document.addEventListener("he-toast-error", function(e) {
        HeliumToast.showToast(e.detail.value, 'error');
    });

    document.addEventListener("he-toast-warn", function(e) {
        HeliumToast.showToast(e.detail.value, 'warn');
    });

    document.addEventListener("he-toast-success", function(e) {
        HeliumToast.showToast(e.detail.value, 'success');
    });
}

export { HeliumToast };
