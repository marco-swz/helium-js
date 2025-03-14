const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    --he-button-loading-cursor: default;\n    --he-button-hover-cursor: pointer;\n    --he-button-disabled-cursor: not-allowed;\n    --he-button-borderWidth: 0.1rem;\n    --he-button-font-size: 14px;\n    --he-button-height: 35px;\n    --he-button-width: fit-content;\n\n    --he-button-color: black;\n    --he-button-backgroundColor: white;\n    --he-button-hover-backgroundColor: hsl(240 4.8% 95.9%);\n    --he-button-hover-color: black;\n    --he-button-borderColor: hsl(240 4.9% 83.9%);\n    --he-button-hover-borderColor: var(--he-button-borderColor);\n\n    --he-theme-color: var(--he-accent-color, steelblue);\n    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));\n    --he-theme-contrast: white;\n\n    display: inline-block;\n    text-wrap: nowrap;\n    border-radius: 3px;\n    outline-style: none;\n    box-shadow: none !important;\n    width: var(--he-button-width);\n    min-width: var(--he-button-minWidth);\n}\n\n:host([theme=danger]) {\n    --he-theme-color: hsl(0 72.2% 50.6%);\n    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));\n    --he-theme-contrast: white;\n}\n\n:host([theme=warning]) {\n    --he-theme-color: hsl(32.1 94.6% 43.7%);\n    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));\n    --he-theme-contrast: white;\n}\n\n:host([theme=success]) {\n    --he-theme-color: hsl(142.1 76.2% 36.3%);\n    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));\n    --he-theme-contrast: white;\n}\n\n:host([theme][variant]), \n:host([theme]) {\n    --he-button-color: var(--he-theme-color);\n    --he-button-hover-color: var(--he-theme-contrast);\n    --he-button-backgroundColor: var(--he-theme-contrast);\n    --he-button-hover-backgroundColor: var(--he-theme-color);\n    --he-button-borderColor: var(--he-theme-color);\n    --he-button-hover-borderColor: var(--he-theme-color);\n}\n\n:host([variant=primary]) {\n    --he-button-color: var(--he-theme-contrast);\n    --he-button-hover-color: var(--he-theme-contrast);\n    --he-button-backgroundColor: var(--he-theme-color);\n    --he-button-hover-backgroundColor: var(--he-theme-bright1-color);\n    --he-button-borderColor: var(--he-theme-color);\n    --he-button-hover-borderColor: var(--he-theme-bright1-color);\n}\n\n:host([variant=ghost]) {\n    --he-button-borderColor: white;\n    --he-button-hover-borderColor: var(--he-button-hover-backgroundColor);\n}\n:host([variant=ghost][theme]) {\n    --he-button-color: var(--he-theme-color);\n    --he-button-hover-color: var(--he-theme-contrast);\n    --he-button-backgroundColor: var(--he-theme-contrast);\n    --he-button-hover-backgroundColor: var(--he-theme-color);\n    --he-button-borderColor: var(--he-theme-contrast);\n    --he-button-hover-borderColor: var(--he-theme-color);\n}\n\na {\n    width: inherit;\n    cursor: inherit;\n    padding: inherit;\n    border-radius: inherit;\n    outline-style: inherit;\n    box-shadow: inherit;\n    text-shadow: inherit;\n    min-width: inherit;\n}\n\n#he-button {\n    position: relative;\n    border-radius: inherit;\n    padding: inherit;\n    vertical-align: middle;\n    text-align: center;\n    font-size: var(-he-button-fontSize);\n    background-color: var(--he-button-backgroundColor);\n    outline-style: inherit;\n    box-shadow: inherit;\n    text-shadow: inherit;\n    cursor: inherit;\n    color: var(--he-button-color);\n    height: var(--he-button-height);\n    border-width: var(--he-button-borderWidth);\n    border-style: solid;\n    border-color: var(--he-button-borderColor);\n    padding: 0px 10px;\n    font-weight: 600;\n    width: inherit;\n    overflow: hidden;\n    min-width: inherit;\n}\n\n:host([disabled]) #he-button {\n    opacity: 0.5;\n    cursor: var(--he-button-disabled-cursor);\n}\n\n:host(:not([loading]):not([disabled]):hover) #he-button {\n    transition:\n        background-color 0.2s,\n        border-color 0.2s,\n        color 0.2s;\n    background-color: var(--he-button-hover-backgroundColor);\n    border-color: var(--he-button-hover-borderColor);\n    cursor: var(--he-button-hover-cursor);\n    color: var(--he-button-hover-color);\n}\n\n:host(:not([loading]):not([disabled]):active) #he-button {\n    animation: inset-anim 0.15s 1 ease-in-out;\n}\n\n:host([loading]) #he-button {\n    opacity: 0.5;\n    cursor: var(--he-button-loading-cursor);\n}\n\n:host([loading]) #he-button::after {\n    content: \"\";\n    position: absolute;\n    width: 16px;\n    height: 16px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n    border: 4px solid transparent;\n    border-top-color: var(--he-button-spinner-color, black);\n    border-radius: 50%;\n    animation: button-loading-spinner 1s ease infinite;\n}\n\n:host([ok]) #he-button::after {\n    content: \"\";\n    position: absolute;\n    width: 16px;\n    height: 16px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n    border: 4px solid transparent;\n    border-bottom-color: var(--he-button-spinner-color, black);\n    border-right-color: var(--he-button-spinner-color, black);\n    transform: rotate(45deg);\n}\n\n@keyframes button-loading-spinner {\n    from {\n        transform: rotate(0turn);\n    }\n\n    to {\n        transform: rotate(1turn);\n    }\n}\n\n@keyframes inset-anim {\n    0% {\n        box-shadow: inset 0 0 0 0 hsl(from var(--he-button-hover-backgroundColor) h s l);\n    }\n    50% {\n        box-shadow: inset 0 0 10px 0 hsl(from var(--he-button-hover-backgroundColor) h s calc(l - 10));\n    }\n    100% {\n        box-shadow: inset 0 0 0 0 hsl(from var(--he-button-hover-backgroundColor) h s l);\n    }\n}\n");

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
        'link',
        'href',
    ];
    /** @type {HTMLButtonElement} */
    $button;
    /** @type {HTMLAnchorElement} */
    $anchor;
    /** @type {?EventListener} */
    listenerClick = null;
    /** @type {ElementInternals} */
    internals;
    /** @type {HTMLSlotElement} */
    $slot;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$anchor = document.createElement('a');

        this.$button = document.createElement('button');
        this.$button.id = 'he-button';

        this.$slot = document.createElement('slot');
        this.$slot.name = "inner";
        this.$button.append(this.$slot);

        this.$anchor.append(this.$button);
        shadow.append(this.$anchor);
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
            case 'link':
            case 'href':
                if (newValue) {
                    this.$anchor.setAttribute(name, newValue);
                } else {
                    this.$anchor.removeAttribute(name);
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
        let $inner = document.createElement('span');
        $inner.slot = 'inner';
        $inner.innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.append($inner);
        this.onload && this.onload();
    }

    setText(newText) {
        this.$slot.assignedElements()[0].innerHTML = newText;
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
