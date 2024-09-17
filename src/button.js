class HeliumButton extends HTMLElement {
    static observedAttributes = [
        'value',
        'name',
        'form',
        'popovertarget',
        'popovertargetaction',
        'disabled',
        'form',
        'formtarget',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'loading',
        'show-dialog',
        'close-dialog',
        'submit',
        'input-invalid',
    ];
    /** @type {HTMLInputElement} */
    button;
    /** @type {?EventListener} */
    listenerClick = null;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
        :host {
            text-wrap: nowrap;
        }

        #he-button {
            border-radius: 2px;
            color: black;
            height: 35px;
            padding: 0px 10px;
            vertical-align: middle;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, 0.2235294118);
            font-size: 14px;
            background-color: var(--he-button-clr-bg, white);
            outline-style: none;
            box-shadow: none !important;
            width: auto;
            position: relative;
        }

        #he-button[disabled] {
            background-color: #d9d9d9;
            color: #666666;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button:hover:enabled:not([loading]), 
        #he-button:active:enabled:not([loading]), 
        #he-button:focus:enabled:not([loading]) {
            cursor: pointer;
            text-shadow: 0px 0px 0.3px var(--he-button-clr-border-hover);
            border-color: var(--he-button-clr-border-hover, grey);
            color: var(--he-button-clr-border-hover, black);
        }

        #he-button:hover:enabled:not([loading]){
            background-color: color-mix(in srgb,var(--he-button-clr-bg, white),black 2%)
        }

        #he-button[loading] {
            background-color: #d9d9d9;
            color: #6666668c;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button[loading]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-top-color: var(--he-button-clr-spinner, black);
            border-radius: 50%;
            animation: button-loading-spinner 1s ease infinite;
        }

        #he-button[ok]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-bottom-color: var(--he-button-clr-spinner, black);
            border-right-color: var(--he-button-clr-spinner, black);
            transform: rotate(45deg);
        }

        @keyframes button-loading-spinner {
            from {
                transform: rotate(0turn);
            }

            to {
                transform: rotate(1turn);
            }
        }
        `);

        this.button = document.createElement('button');
        this.button.id = 'he-button'

        shadow.append(this.button);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        this.button.innerHTML = this.innerHTML;
        this.innerHTML = '';
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'show-dialog':
                this.removeEventListener('click', this._showDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._showDialog);
                }
                break;
            case 'close-dialog':
                this.removeEventListener('click', this._hideDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._closeDialog());
                }
                break;
            case 'submit':
                this.addEventListener('click', () => this._submitForm())
                break;
            case 'input-invalid':
                if (newValue) {
                    this.disable();
                } else {
                    this.enable();
                }
                break;
            default:
                if (newValue === null || newValue === 'false') {
                    this.button.removeAttribute(name);
                } else {
                    this.button.setAttribute(name, newValue);
                }
                break;
        }
    }

    /**
     * Shows or hides the loading animation.
     * @param {bool} showLoading 
     */
    loading(showLoading) {
        if (showLoading == null || showLoading) {
            this.setAttribute('loading', true);
        } else {
            this.removeAttribute('loading');
        }
    }

    /**
     * Disables the button.
     */
    disable() {
        this.setAttribute('disabled', true);
    }

    /**
     * Enables the button.
     */
    enable() {
        this.removeAttribute('disabled');
    }

    _submitForm() {
        const id = this.getAttribute('submit');
        const form = document.querySelector(id);
        console.assert(form == null, `No form found with ID ${id}`)
        form.submit();
    }

    _showDialog() {
        const diag = document.querySelector(this.getAttribute('show-dialog'));
        diag.showModal();
    }

    _closeDialog() {
        const diag = document.querySelector(this.getAttribute('close-dialog'));
        diag.close();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-button", HeliumButton);
});
