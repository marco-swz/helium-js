const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    display: inline-flex;\n    position: relative;\n    border-radius: 3px;\n    background-color: whitesmoke;\n    width: 100%;\n    height: 1.6rem;\n    font-size: 14px;\n    border: 0.1rem solid lightgrey;\n}\n\n:host(:hover), :host(:focus) {\n    border-color: var(--he-input-clr-border-hover, grey);\n}\n\n:host([invalid]) {\n    border-color: indianred;\n}\n\n:host([invalid]:hover) {\n    border-color: indianred;\n}\n\n:host([loading])::after {\n    content: \"\";\n    position: absolute;\n    width: 12px;\n    height: 12px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto 10px auto auto;\n    border: 3px solid darkgrey;\n    border-radius: 50%;\n    border-bottom-color: var(--he-input-clr-spinner, black);\n    animation: button-loading-spinner 1s ease infinite;\n}\n\n:host([ok])::after {\n    content: \"\";\n    position: absolute;\n    width: 10px;\n    height: 15px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto 10px auto auto;\n    border: 3px solid transparent;\n    border-bottom-color: var(--he-input-clr-ok, black);\n    border-right-color: var(--he-input-clr-ok, black);\n    transform: rotate(45deg);\n}\n\n#inp-main {\n    outline: none;\n    background-color: inherit;\n    width: 100%;\n    font-size:inherit;\n    border-radius: inherit;\n    border: none;\n    padding: 0.3rem 0.4rem;\n    cursor: inherit;\n    color: inherit;\n}\n\n:host([readonly]:hover), :host([readonly]:focus),\n:host([disabled]:hover), :host([disabled]:focus) {\n    border-color: var(--he-input-clr-border-hover, lightgrey);\n}\n\n:host([readonly]), :host([disabled]) {\n    cursor: default;\n    color: hsl(from var(--he-input-clr, black) h s calc(l + 50))\n}\n\n@keyframes button-loading-spinner {\n    from {\n        transform: rotate(0turn);\n    }\n\n    to {\n        transform: rotate(1turn);\n    }\n}\n\n");

/**
 * A input element with additional features.
 *
 * Features:
 *   - Report validity to other elements
 *   - Loading indicator
 *
 * @element he-input
 *
 * @attr pattern - A `RegExp` pattern to check, if the input is valid
 * @attr {on|off} required - If set, the input will count empty values as invalid
 * @attr report-validity - The selector of another HTML element. 
 * The attribute `he-input-invalid` will be set on to the ID of this input.
 * If multiple inputs report their validity, `he-input-invalid` will be a space-separated list of IDs.
 * @attr {'text','hidden'} [type=text] - The type of the input
 * @attr {on|off} disabled - Toggles the `disabled` state of the input. A disabled input will not be submitted in forms.
 * @attr {on|off} readonly - Toggles the `readonly` state of the input. Contrary to `disabled`, the value will still be submitted in forms.
 * @attr {on|off} [autocomplete=off] - Shows suggestion from previous inputs (browser native appearance)
 *
 * @cssprop [--he-input-clr-black] - The color of the text
 * @cssprop [--he-input-clr-border-hover=grey] - The border color when hovering
 * @cssprop [--he-input-clr-spinner=black] - The color of the spinner while in `loading` state
 * @cssprop [--he-input-clr-ok=black] - The color of the indicator while in `ok` state
 *
 * @extends HTMLElement
 */
class HeliumInput extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'pattern',
        'required',
        'report-validity',
        'type',
        'disabled',
        'readonly',
        'autocomplete',
        'placeholder',
    ];

    /** @type {HTMLInputElement} */
    $input;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$input = document.createElement('input');
        this.$input.type = 'text';
        this.$input.autocomplete = 'off';
        this.$input.id = 'inp-main';

        shadow.append(this.$input);
        shadow.adoptedStyleSheets = [sheet];
        this.internals = this.attachInternals();
    }

    /**
     * Gets or sets the `disabled` state of the input.
     * @type {boolean}
     */
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', true);
            this.internals.states.add('disabled');
            this.internals.setFormValue(null);
        } else {
            this.removeAttribute('disabled');
            this.internals.states.delete('disabled');
            this.internals.setFormValue(this.$input.value);
        }

    }

    get disabled() {
        return this.getAttribute('disabled') != null;
    }

    /**
     * Gets or sets the `invalid` state without checking the `pattern`.
     * @type {boolean}
     */
    set invalid(val) {
        if (val) {
            this.setAttribute('invalid', true);
            this.internals.states.add('invalid');
        } else {
            this.removeAttribute('invalid');
            this.internals.states.delete('invalid');
        }
    }

    get invalid() {
        return this.getAttribute('invalid') != null;
    }

    /**
     * Gets or sets the name of input.
     * The name will be used for form submissions.
     * @type {boolean}
     */
    set name(val) {
        if (val) {
            this.setAttribute('name', val);
        } else {
            this.removeAttribute('name');
        }
    }

    get name() {
        return this.getAttribute('name');
    }

    set placeholder(val) {
        if (val) {
            this.setAttribute('placeholder', val);
        } else {
            this.removeAttribute('placeholder');
        }
    }

    get placeholder() {
        return this.getAttribute('placeholder');
    }

    set required(val) {
        if (val) {
            this.setAttribute('required', true);
        } else {
            this.removeAttribute('required');
        }
    }

    get required() {
        return this.$input.required;
    }

    set type(val) {
        if (val) {
            this.setAttribute('type', val);
        } else {
            this.removeAttribute('type');
        }
    }

    get type() {
        return this.getAttribute('type');
    }

    /**
     * Gets or sets the value of input.
     * @type {boolean}
     */
    set value(val) {
        this.$input.value = val;
        if (!this.disabled) {
            this.internals.setFormValue(val);
        }
    }

    get value() {
        return this.$input.value === ''
            ? this.placeholder ?? ''
            : this.$input.value;
    }

    connectedCallback() {
        this.$input.onchange = () => this.inputChangedCallback.bind(this)();
        this.value = this.getAttribute('value');
        if (!this.value) {
            this.value = this.innerHTML;
        }
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'type':
                if (newValue === 'hidden') {
                    this.style.display = 'none';
                } else {
                    this.style.display = '';
                }
            case 'placeholder':
                if (this.value === '') {
                    this.internals.setFormValue(newValue);
                }
            default:
                if (newValue != null) {
                    this.$input.setAttribute(name, newValue);
                } else {
                    this.$input.removeAttribute(name);
                }
                break;
        }
    }

    /**
     * Checks if the value of the input is valid and
     * reports the validity to external elements.
     * @returns {boolean}
     */
    checkValidity() {
        const validity = this.$input.validity;
        if (validity.valid) {
            this.invalid = false;
        } else {
            this.invalid = true;
        }

        const reportSelector = this.getAttribute('report-invalid');
        if (reportSelector) {
            console.assert(
                this.id && this.id !== '',
                'The input cannot report its validity if it has no ID'
            );
            const id = '#' + this.id;
            const elems = document.querySelectorAll(reportSelector);
            for (const $elem of elems) {
                const validList = $elem.getAttribute('he-input-invalid') ?? '';
                let validSet = new Set(validList.split(' '));
                if (validity.valid) {
                    validSet.delete(id);
                } else {
                    validSet.add(id);
                }

                if (validSet.size === 0) {
                    $elem.removeAttribute('he-input-invalid');
                    continue;
                }

                $elem.setAttribute('he-input-invalid', Array.from(validSet).join(' '));
            }
        }

        return validity.valid;
    }

    /**
     * Sets the focus to the input.
     */
    focus() {
        this.$input.focus();
    }

    /**
     * The native callback function for resetting the input a part of a form.
     */
    formResetCallback() {
        this.$input.value = "";
    }

    /**
     * Callback for input changes.
     */
    inputChangedCallback() {
        if (!this.disabled && this.checkValidity()) {
            this.internals.setFormValue(this.$input.value);
        }
    }
}

if (!customElements.get('he-input')) {
    customElements.define("he-input", HeliumInput);
}

export { HeliumInput };
