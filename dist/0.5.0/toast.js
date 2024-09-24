const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    position: fixed;\r\n    top: unset;\r\n    right: unset;\r\n    left: 50%;\r\n    bottom: 10px;\r\n    transform: translateX(-50%);\r\n    width: 300px;\r\n}\r\n\r\n:host([position=bottom-right]) {\r\n    top: unset;\r\n    left: unset;\r\n    bottom: 10px;\r\n    right: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=bottom-left]) {\r\n    top: unset;\r\n    right: unset;\r\n    bottom: 10px;\r\n    left: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top-left]) {\r\n    bottom: unset;\r\n    right: unset;\r\n    top: 10px;\r\n    left: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top-right]) {\r\n    bottom: unset;\r\n    left: unset;\r\n    top: 10px;\r\n    right: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top]) {\r\n    bottom: unset;\r\n    right: unset;\r\n    top: 10px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n}\r\n\r\n#contToasts {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n}\r\n\r\n#toast {\r\n    border: 1px solid grey;\r\n    border-radius: var(--he-toast-radius-border, 3px);\r\n    background-color: var(--he-toast-clr-bg, white);\r\n    z-index: 10;\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n#bar {\r\n    width: 100%;\r\n    height: 5px;\r\n    background-color: red;\r\n    margin-right: auto;\r\n}\r\n\r\n#bar[type=warn] {\r\n    background-color: var(--he-toast-bg-bar-warn, orange);\r\n}\r\n\r\n#bar[type=error] {\r\n    background-color: var(--he-toast-bg-bar-error, indianred);\r\n}\r\n\r\n#bar[type=success] {\r\n    background-color: var(--he-toast-bg-bar-success, seagreen);\r\n}\r\n\r\n#contMain {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n#contText {\r\n    padding: 1rem 2rem;\r\n    font-size: 16px;\r\n}\r\n\r\n#btnClose {\r\n    border-radius: 50%;\r\n    font-size: 20px;\r\n    font-weight: 500;\r\n    margin-right: 10px;\r\n    border-radius: 50%;\r\n    width: 35px;\r\n    height: 35px;\r\n    text-align: center;\r\n    vertical-align: middle;\r\n    cursor: pointer;\r\n}\r\n\r\n#btnClose:hover {\r\n    background-color: whitesmoke;\r\n}\r\n");

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

    connectedCallback() {
    }

    /**
     * @param {string} content
     * @param {null|'info'|'warn'|'error'} type 
     * @returns {HTMLDivElement}
     */
    _renderToast(content,type) {
        const duration = this.getAttribute('timeout-ms') ?? 4000;

        const $toast = document.createElement('div');
        $toast.id = 'toast';

        const $bar = document.createElement('div');
        $bar.id = 'bar';
        $bar.style.width = '0%';
        $bar.setAttribute('type', type);
        const animation = $bar.animate(
            [
                { width: '100%' },
                { width: '0%' },
            ], {
                duration: duration,
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

    showToast(message, type) {
        const $toast = this._renderToast(message, type);
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
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
    }
}

function showToastTemp(evt, type) {
    /** @type {HeliumToast} */
    let $toast = document.querySelector('#he-toast-temp');
    if ($toast === null) {
        $toast = document.createElement('he-toast');
        $toast.id = 'he-toast-temp';
        $toast.setAttribute('position', 'top-right');
        document.body.append($toast);
    }

    $toast.showToast(evt.detail.value, type);
}

document.addEventListener("DOMContentLoaded", function() {
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

});

export { HeliumToast };
