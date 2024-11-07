const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    --he-button-cursor-loading: default;\n    --he-button-cursor-hover: pointer;\n    --he-button-cursor-disabled: not-allowed;\n    --he-button-border-width: 0.1rem;\n    --he-button-font-size: 14px;\n    --he-button-height: 35px;\n    --he-button-width: auto;\n\n    --he-button-clr: 0 0% 0%;\n    --he-button-clr-bg: 0 0% 100%;\n    --he-button-clr-bg-hover: 240 4.8% 95.9%;\n    --he-button-border-color: 240 4.9% 83.9%;\n    --he-button-border-color-hover: var(--he-button-border-color);\n\n    --he-theme-clr: var(--he-clr-accent, 0 0% 0%);\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\n    --he-theme-contrast: 0 0% 100%;\n\n    display: inline-block;\n    text-wrap: nowrap;\n    border-radius: 2px;\n    outline-style: none;\n    box-shadow: none !important;\n}\n\n:host([theme=danger]) {\n    --he-theme-clr: 0 72.2% 50.6%;\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\n    --he-theme-contrast: 0 0% 100%;\n}\n\n:host([theme=warning]) {\n    --he-theme-clr: 32.1 94.6% 43.7%;\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\n    --he-theme-contrast: 0 0% 100%;\n}\n\n:host([theme=sucess]) {\n    --he-theme-clr: 142.1 76.2% 36.3%;\n    --he-theme-clr-b1: var(--he-theme-clr) / .75;\n    --he-theme-contrast: 0 0% 100%;\n}\n\n:host([theme][variant]), \n:host([theme]) {\n    --he-button-clr: var(--he-theme-clr);\n    --he-button-clr-hover: var(--he-theme-contrast);\n    --he-button-clr-bg: var(--he-theme-contrast);\n    --he-button-clr-bg-hover: var(--he-theme-clr);\n    --he-button-border-color: var(--he-theme-clr);\n    --he-button-border-color-hover: var(--he-theme-clr);\n}\n\n:host([variant=primary]) {\n    --he-button-clr: var(--he-theme-contrast);\n    --he-button-clr-hover: var(--he-theme-contrast);\n    --he-button-clr-bg: var(--he-theme-clr);\n    --he-button-clr-bg-hover: var(--he-theme-clr-b1);\n    --he-button-border-color: var(--he-theme-clr);\n    --he-button-border-color-hover: var(--he-theme-clr-b1);\n}\n\n:host([variant=ghost]) {\n    --he-button-border-color: 0 0% 100%;\n    --he-button-border-color-hover: var(--he-button-clr-bg-hover);\n}\n:host([variant=ghost][theme]) {\n    --he-button-clr: var(--he-theme-clr);\n    --he-button-clr-hover: var(--he-theme-contrast);\n    --he-button-clr-bg: var(--he-theme-contrast);\n    --he-button-clr-bg-hover: var(--he-theme-clr);\n    --he-button-border-color: var(--he-theme-contrast);\n    --he-button-border-color-hover: var(--he-theme-clr);\n}\n\n#he-button {\n    position: relative;\n    border-radius: inherit;\n    padding: inherit;\n    vertical-align: middle;\n    text-align: center;\n    font-size: var(-he-button-font-size);\n    background-color: hsl(var(--he-button-clr-bg));\n    outline-style: inherit;\n    box-shadow: inherit;\n    text-shadow: inherit;\n    cursor: inherit;\n    color: hsl(var(--he-button-clr));\n    height: var(--he-button-height);\n    width: var(--he-button-width);\n    border-width: var(--he-button-border-width);\n    border-style: solid;\n    border-color: hsl(var(--he-button-border-color));\n    padding: 0px 10px;\n}\n\n:host([disabled]) #he-button {\n    opacity: 0.5;\n    cursor: var(--he-button-cursor-disabled);\n}\n\n:host(:not([loading]):not([disabled]):hover) #he-button,\n:host(:not([loading]):not([disabled]):active) #he-button,\n:host(:not([loading]):not([disabled]):focus) #he-button {\n    background-color: hsl(var(--he-button-clr-bg-hover));\n    border-color: hsl(var(--he-button-border-color-hover));\n    cursor: var(--he-button-cursor-hover);\n    color: hsl(var(--he-button-clr-hover));\n}\n\n:host([loading]) #he-button {\n    opacity: 0.5;\n    cursor: var(--he-button-cursor-loading);\n}\n\n:host([loading]) #he-button::after {\n    content: \"\";\n    position: absolute;\n    width: 16px;\n    height: 16px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n    border: 4px solid transparent;\n    border-top-color: var(--he-button-clr-spinner, black);\n    border-radius: 50%;\n    animation: button-loading-spinner 1s ease infinite;\n}\n\n:host([ok]) #he-button::after {\n    content: \"\";\n    position: absolute;\n    width: 16px;\n    height: 16px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n    border: 4px solid transparent;\n    border-bottom-color: var(--he-button-clr-spinner, black);\n    border-right-color: var(--he-button-clr-spinner, black);\n    transform: rotate(45deg);\n}\n\n@keyframes button-loading-spinner {\n    from {\n        transform: rotate(0turn);\n    }\n\n    to {\n        transform: rotate(1turn);\n    }\n}\n");

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
     * @type {'danger'|'warning'|'success'}
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
     * Gets or sets the theme of the button.
     * @type {'primary'|'ghost'}
     */
    set variant(val) {
        if (val) {
            this.setAttribute('variant', val);
        } else {
            this.removeAttribute('variant');
        }
    }

    get variant() {
        return this.getAttribute('variant');
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
