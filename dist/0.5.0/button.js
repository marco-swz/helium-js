const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    --he-button-cursor-loading: default;\r\n    --he-button-cursor-hover: pointer;\r\n    --he-button-cursor-disabled: not-allowed;\r\n    --he-button-border-width: 0.1rem;\r\n    --he-button-font-size: 14px;\r\n    --he-button-height: 35px;\r\n    --he-button-width: auto;\r\n\r\n    --he-button-clr: 0 0% 0%;\r\n    --he-button-clr-bg: 0 0% 100%;\r\n    --he-button-clr-bg-hover: 240 4.8% 95.9%;\r\n    --he-button-border-color: 240 4.9% 83.9%;\r\n    --he-button-border-color-hover: var(--he-button-border-color);\r\n\r\n    --he-theme-clr: var(--he-clr-accent, 0 0% 0%);\r\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\r\n    --he-theme-contrast: 0 0% 100%;\r\n\r\n    display: inline-block;\r\n    text-wrap: nowrap;\r\n    border-radius: 2px;\r\n    outline-style: none;\r\n    box-shadow: none !important;\r\n}\r\n\r\n:host([theme=danger]) {\r\n    --he-theme-clr: 0 72.2% 50.6%;\r\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\r\n    --he-theme-contrast: 0 0% 100%;\r\n}\r\n\r\n:host([theme=warning]) {\r\n    --he-theme-clr: 32.1 94.6% 43.7%;\r\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\r\n    --he-theme-contrast: 0 0% 100%;\r\n}\r\n\r\n:host([theme=sucess]) {\r\n    --he-theme-clr: 142.1 76.2% 36.3%;\r\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\r\n    --he-theme-contrast: 0 0% 100%;\r\n}\r\n\r\n:host([theme][variant]), \r\n:host([theme]) {\r\n    --he-button-clr: var(--he-theme-clr);\r\n    --he-button-clr-hover: var(--he-theme-contrast);\r\n    --he-button-clr-bg: var(--he-theme-contrast);\r\n    --he-button-clr-bg-hover: var(--he-theme-clr);\r\n    --he-button-border-color: var(--he-theme-clr);\r\n    --he-button-border-color-hover: var(--he-theme-clr);\r\n}\r\n\r\n:host([variant=primary]) {\r\n    --he-button-clr: var(--he-theme-contrast);\r\n    --he-button-clr-hover: var(--he-theme-contrast);\r\n    --he-button-clr-bg: var(--he-theme-clr);\r\n    --he-button-clr-bg-hover: var(--he-theme-clr-b1);\r\n    --he-button-border-color: var(--he-theme-clr);\r\n    --he-button-border-color-hover: var(--he-theme-clr-b1);\r\n}\r\n\r\n:host([variant=ghost]) {\r\n    --he-button-border-color: 0 0% 100%;\r\n    --he-button-border-color-hover: var(--he-button-clr-bg-hover);\r\n}\r\n:host([variant=ghost][theme]) {\r\n    --he-button-clr: var(--he-theme-clr);\r\n    --he-button-clr-hover: var(--he-theme-contrast);\r\n    --he-button-clr-bg: var(--he-theme-contrast);\r\n    --he-button-clr-bg-hover: var(--he-theme-clr);\r\n    --he-button-border-color: var(--he-theme-contrast);\r\n    --he-button-border-color-hover: var(--he-theme-clr);\r\n}\r\n\r\n#he-button {\r\n    position: relative;\r\n    border-radius: inherit;\r\n    padding: inherit;\r\n    vertical-align: middle;\r\n    text-align: center;\r\n    font-size: var(-he-button-font-size);\r\n    background-color: hsl(var(--he-button-clr-bg));\r\n    outline-style: inherit;\r\n    box-shadow: inherit;\r\n    text-shadow: inherit;\r\n    cursor: inherit;\r\n    color: hsl(var(--he-button-clr));\r\n    height: var(--he-button-height);\r\n    width: var(--he-button-width);\r\n    border-width: var(--he-button-border-width);\r\n    border-style: solid;\r\n    border-color: hsl(var(--he-button-border-color));\r\n    padding: 0px 10px;\r\n}\r\n\r\n:host([disabled]) #he-button {\r\n    opacity: 0.5;\r\n    cursor: var(--he-button-cursor-disabled);\r\n}\r\n\r\n:host(:not([loading]):not([disabled]):hover) #he-button,\r\n:host(:not([loading]):not([disabled]):active) #he-button,\r\n:host(:not([loading]):not([disabled]):focus) #he-button {\r\n    background-color: hsl(var(--he-button-clr-bg-hover));\r\n    border-color: hsl(var(--he-button-border-color-hover));\r\n    cursor: var(--he-button-cursor-hover);\r\n    color: hsl(var(--he-button-clr-hover));\r\n}\r\n\r\n:host([loading]) #he-button {\r\n    opacity: 0.5;\r\n    cursor: var(--he-button-cursor-loading);\r\n}\r\n\r\n:host([loading]) #he-button::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-top-color: var(--he-button-clr-spinner, black);\r\n    border-radius: 50%;\r\n    animation: button-loading-spinner 1s ease infinite;\r\n}\r\n\r\n:host([ok]) #he-button::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-bottom-color: var(--he-button-clr-spinner, black);\r\n    border-right-color: var(--he-button-clr-spinner, black);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n@keyframes button-loading-spinner {\r\n    from {\r\n        transform: rotate(0turn);\r\n    }\r\n\r\n    to {\r\n        transform: rotate(1turn);\r\n    }\r\n}\r\n");

/**
 * A button with included loading animation.
 *
 * @attr he-input-invalid - One or more IDs of `HeliumInput` elements. 
 * The attribute is set by the inputs themself if they are invalid.
 * This behavior is activated by he `report-validtity` attribute of the `HeliumInput`.
 * @attr show-dialog - Calls `.showModal()` on the specified element(s) if the button is pressed.
 * @attr close-dialog - Calls `.close()` on the specified element(s) if the button is pressed.
 * @attr {string} onload - The content `onload` is evaluated when attached to the DOM
 *
 * @cssprop [--he-button-cursor-loading = default] - The cursor style when in `loading` state
 * @cssprop [--he-button-cursor-hover = pointer] - The cursor style when hovering
 * @cssprop [--he-button-cursor-disabled = not-allowed] - The cursor style when in `disabled` state
 *
 * @extends HTMLElement
 * @todo Add all css variables to doc
 * @todo Disable all click events when disabled or loading
 */
class HeliumButton extends HTMLElement {
    static observedAttributes = [
        'theme',
        'variant',
        'popovertarget',
        'popovertargetaction',
        'form',
        'formtarget',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'show-dialog',
        'close-dialog',
        'submit',
        'he-input-invalid',
        'disabled',
    ];
    /** @type {HTMLInputElement} */
    $button;
    /** @type {?EventListener} */
    listenerClick = null;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$button = document.createElement('button');
        this.$button.id = 'he-button';

        shadow.append(this.$button);
        shadow.adoptedStyleSheets = [sheet];
        this.internals = this.attachInternals();
    }

    /**
     * Gets or sets the `disabled` state of the button.
     * @type {boolean}
     */
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', true);
        } else {
            this.removeAttribute('disabled');
        }

    }

    get disabled() {
        return this.getAttribute('disabled') != null;
    }

    /**
     * Gets or sets the `loading` state of the button.
     * While loading, a spinner is shown on top of the button.
     * @type {boolean}
     */
    set loading(val) {
        if (val) {
            this.setAttribute('loading', true);
            this.internals.states.add('loading');
        } else {
            this.removeAttribute('loading');
            this.internals.states.delete('loading');
        }
    }

    get loading() {
        return this.getAttribute('loading') != null;
    }

    /**
     * Gets or sets the theme of the button.
     * @type {'primary'|'secondary'}
     */
    set theme(val) {
        if (val) {
            this.setAttribute('theme', val);
        } else {
            this.removeAttribute('theme');
        }
    }

    get theme() {
        return this.getAttribute('theme');
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
                this.addEventListener('click', () => this._submitForm());
                break;
            case 'he-input-invalid':
                if (newValue) {
                    this.disabled = true;
                } else {
                    this.disabled = false;
                }
                break;
            case 'theme':
                break;
            case 'variant': 
                break;
            case 'disabled':
                if (newValue) {
                    this.internals.states.add('disabled');
                    this.$button.setAttribute('disabled', true);
                } else {
                    this.internals.states.delete('disabled');
                    this.$button.removeAttribute('disabled');
                }
                break;
            default:
                if (newValue === null || newValue === 'false') {
                    this.$button.removeAttribute(name);
                } else {
                    this.$button.setAttribute(name, newValue);
                }
                break;
        }
    }

    connectedCallback() {
        this.$button.innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.onload && this.onload();
    }

    _closeDialog() {
        document.querySelectorAll(this.getAttribute('close-dialog'))
            .forEach(($diag) => $diag.close());
    }

    _submitForm() {
        const id = this.getAttribute('submit');
        const $form = document.querySelector(id);
        console.assert($form == null, `No form found with ID ${id}`);
        console.assert($form.nodeName === 'FORM', 'The element is not a form!');
        $form.submit();
    }

    _showDialog() {
        document.querySelectorAll(this.getAttribute('show-dialog'))
            .forEach(($diag) => $diag.showModal());
    }
}

if (!customElements.get('he-button')) {
    customElements.define("he-button", HeliumButton);
}

export { HeliumButton };
