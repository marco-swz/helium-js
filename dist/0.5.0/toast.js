const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    position: fixed;\r\n    top: unset;\r\n    right: unset;\r\n    left: 50%;\r\n    bottom: 10px;\r\n    transform: translateX(-50%);\r\n    width: 300px;\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    z-index: 500;\r\n    background-color: white;\r\n}\r\n\r\n:host([position=bottom-right]) {\r\n    top: unset;\r\n    left: unset;\r\n    bottom: 10px;\r\n    right: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=bottom-left]) {\r\n    top: unset;\r\n    right: unset;\r\n    bottom: 10px;\r\n    left: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top-left]) {\r\n    bottom: unset;\r\n    right: unset;\r\n    top: 10px;\r\n    left: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top-right]) {\r\n    bottom: unset;\r\n    left: unset;\r\n    top: 10px;\r\n    right: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top]) {\r\n    bottom: unset;\r\n    right: unset;\r\n    top: 10px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n}\r\n\r\n#contToasts {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n}\r\n\r\n#toast {\r\n    border: 1px solid grey;\r\n    border-radius: var(--he-toast-radius, 3px);\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n    border-left: 5px solid steelblue;\r\n}\r\n\r\n#toast[type=warn] {\r\n    border-left-color: var(--he-toast-clr-warn, orange);\r\n}\r\n\r\n#toast[type=error] {\r\n    border-left-color: var(--he-toast-clr-error, indianred);\r\n}\r\n\r\n#toast[type=success] {\r\n    border-left-color: var(--he-toast-clr-success, seagreen);\r\n}\r\n\r\n#bar {\r\n    width: 100%;\r\n    height: 3px;\r\n    background-color: lightgrey;\r\n    margin-right: auto;\r\n}\r\n\r\n#contMain {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n#contText {\r\n    padding: 1rem 2rem;\r\n    font-size: inherit;\r\n}\r\n\r\n#btnClose {\r\n    border-radius: 50%;\r\n    font-size: 20px;\r\n    font-weight: 500;\r\n    margin-right: 10px;\r\n    border-radius: 50%;\r\n    width: 35px;\r\n    height: 35px;\r\n    text-align: center;\r\n    vertical-align: middle;\r\n    cursor: pointer;\r\n}\r\n\r\n#btnClose:hover {\r\n    background-color: whitesmoke;\r\n}\r\n");

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
    showToast(message, type) {
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
}

function showToastTemp(evt, type) {
    /** @type {HeliumToast} */
    let $toast = document.querySelector('#he-toast-temp');
    if ($toast === null) {
        $toast = document.createElement('he-toast');
        $toast.id = 'he-toast-temp';
        $toast.setAttribute('timeout-ms', 5000);
        $toast.setAttribute('position', 'top-right');
        document.body.append($toast);
    }

    $toast.showToast(evt.detail.value, type);
}

if (!customElements.get('he-toast')) {
    customElements.define("he-toast", HeliumToast);

    document.addEventListener("he-toast", function(e) {
        showToastTemp(e);
    });

    document.addEventListener("he-toast-error", function(e) {
        showToastTemp(e, 'error');
    });

    document.addEventListener("he-toast-warn", function(e) {
        showToastTemp(e, 'warn');
    });

    document.addEventListener("he-toast-success", function(e) {
        showToastTemp(e, 'success');
    });
}

export { HeliumToast };
