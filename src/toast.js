import sheet from "./toast.css";

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
export class HeliumToast extends HTMLElement {
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
        switch (name) {
            default:
                break;
        }
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
        )
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
        )
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
    })

    document.addEventListener("he-toast-error", function(e) {
        showToastTemp(e, 'error');
    })

    document.addEventListener("he-toast-warn", function(e) {
        showToastTemp(e, 'warn');
    })

    document.addEventListener("he-toast-success", function(e) {
        showToastTemp(e, 'success');
    })
}
