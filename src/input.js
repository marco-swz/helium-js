import sheet from "./input.css";

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
 * @attr {'change'} validate-on - The validation is triggered by the provided event
 *
 * @cssprop [--he-input-clr-border-hover=grey] - The border color when hovering
 * @cssprop [--he-input-clr-spinner=black] - The color of the spinner while in `loading` state
 * @cssprop [--he-input-clr-ok=black] - The color of the indicator while in `ok` state
 *
 * @extends HTMLElement
 */
export class HeliumInput extends HTMLElement {
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
            ? this.placeholder
            : this.$input.value;
    }

    connectedCallback() {
        if (this.getAttribute('validate-on') === 'change') {
            this.$input.onchange = () => this.inputChangedCallback.bind(this)();
        }

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
                if (newValue) {
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
                    validSet.delete(id)
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
