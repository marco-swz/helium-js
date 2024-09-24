import sheet from "./toast.css";

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
        )
        animation.onfinish = () => $toast.remove();
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

});
