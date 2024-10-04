const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    --he-button-cursor-loading: default;\r\n    --he-button-cursor-hover: pointer;\r\n    --he-button-cursor-disabled: not-allowed;\r\n    --he-button-clr-bg: white;\r\n    --he-button-border-width: 0.1rem;\r\n    --he-button-border-color: rgba(0, 0, 0, 0.2235294118);\r\n\r\n    display: inline-block;\r\n    text-wrap: nowrap;\r\n    border-radius: 2px;\r\n    color: black;\r\n    height: 35px;\r\n    vertical-align: middle;\r\n    text-align: center;\r\n    border-width: var(--he-button-border-width);\r\n    border-style: solid;;\r\n    border-color: var(--he-button-border-color);\r\n    font-size: 14px;\r\n    background-color: var(--he-button-clr-bg);\r\n    outline-style: none;\r\n    box-shadow: none !important;\r\n    width: auto;\r\n    position: relative;\r\n}\r\n\r\n#he-button {\r\n    border-radius: inherit;\r\n    color: inherit;\r\n    padding: inherit;\r\n    vertical-align: inherit;\r\n    text-align: inherit;\r\n    font-size: inherit;\r\n    background-color: inherit;\r\n    outline-style: inherit;\r\n    box-shadow: inherit;\r\n    text-shadow: inherit;\r\n    cursor: inherit;\r\n\r\n    height: 100%;\r\n    width: 100%;\r\n    border: none;\r\n    padding: 0px 10px;\r\n}\r\n\r\n:host([disabled]) {\r\n    background-color: #d9d9d9;\r\n    color: #666666;\r\n    cursor: var(--he-button-cursor-disabled);\r\n    text-shadow: none;\r\n}\r\n\r\n:host(:not([loading]):not([disabled]):hover), \r\n:host(:not([loading]):not([disabled]):active), \r\n:host(:not([loading]):not([disabled]):focus) {\r\n    cursor: var(--he-button-cursor-hover);\r\n    text-shadow: 0px 0px 0.3px var(--he-button-clr-border-hover);\r\n    border-color: var(--he-button-clr-border-hover, grey);\r\n    color: var(--he-button-clr-border-hover, black);\r\n}\r\n\r\n:host(:not([loading]):not([disabled]):hover) {\r\n    background-color: color-mix(in srgb,var(--he-button-clr-bg),black 2%)\r\n}\r\n\r\n:host([loading]) {\r\n    background-color: #d9d9d9;\r\n    color: #6666668c;\r\n    cursor: var(--he-button-cursor-loading);\r\n    text-shadow: none;\r\n}\r\n\r\n:host([loading])::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-top-color: var(--he-button-clr-spinner, black);\r\n    border-radius: 50%;\r\n    animation: button-loading-spinner 1s ease infinite;\r\n}\r\n\r\n:host([ok])::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-bottom-color: var(--he-button-clr-spinner, black);\r\n    border-right-color: var(--he-button-clr-spinner, black);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n@keyframes button-loading-spinner {\r\n    from {\r\n        transform: rotate(0turn);\r\n    }\r\n\r\n    to {\r\n        transform: rotate(1turn);\r\n    }\r\n}\r\n\r\n");

/**
 * A button with included loading animation.
 *
 * @attr he-input-invalid - One or more IDs of `HeliumInput` elements. 
 * The attribute is set by the inputs themself if they are invalid.
 * This behavior is activated by he `report-validtity` attribute of the `HeliumInput`.
 * @attr show-dialog - Calls `.showModal()` on the specified element(s) if the button is pressed.
 * @attr close-dialog - Calls `.close()` on the specified element(s) if the button is pressed.
 *
 * @cssprop [--he-button-cursor-loading = default] - The cursor style when in `loading` state
 * @cssprop [--he-button-cursor-hover = pointer] - The cursor style when hovering
 * @cssprop [--he-button-cursor-disabled = not-allowed] - The cursor style when in `disabled` state
 *
 * @extends HTMLElement
 * @todo Add all css variables to doc
 */
class HeliumButton extends HTMLElement {
    static observedAttributes = [
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
            this.internals.states.add('disabled');
        } else {
            this.removeAttribute('disabled');
            this.internals.states.delete('disabled');
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
