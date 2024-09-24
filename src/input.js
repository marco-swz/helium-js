import sheet from "./input.css";

export class HeliumInput extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'pattern',
        'required',
        'report-validity',
        'type',
        'disabled',
        'readonly',
    ];

    /** @type {HTMLInputElement} */
    input;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.autocomplete = false;
        this.input.id = 'inp-main';

        shadow.append(this.input);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        this.internals = this.attachInternals();
        this.input.onchange = () => this.inputChangedCallback.bind(this)();
        this.value = this.innerHTML;
    }

    focus() {
        this.input.focus();
    }

    /**
     * @returns boolean
     */
    checkValidity() {
        const validity = this.input.validity;
        if (validity.valid) {
            this.removeAttribute('invalid');
        } else {
            this.setAttribute('invalid', true);
        }

        const reportSelector = this.getAttribute('report-invalid');
        if (reportSelector) {
            console.assert(
                this.id && this.id !== '',
                'The input cannot report its validity if it has no ID'
            );
            const id = '#' + this.id;
            const elems = document.querySelectorAll(reportSelector);
            for (const elem of elems) {
                const validList = elem.getAttribute('input-invalid') ?? '';
                let validSet = new Set(validList.split(' '));
                if (validity.valid) {
                    validSet.delete(id)
                } else {
                    validSet.add(id);
                }

                if (validSet.size === 0) {
                    elem.removeAttribute('input-invalid');
                    continue;
                }

                elem.setAttribute('input-invalid', Array.from(validSet).join(' '));
            }
        }

        return validity.valid;
    }

    formResetCallback() {
        this.input.value = "";
    }

    set name(val) {
        this.setAttribute('name', val);
    }

    get name() {
        return this.getAttribute('name');
    }

    set value(val) {
        this.input.value = val;
        this.internals.setFormValue(val);
    }

    get value() {
        return this.input.value;
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
            default:
                if (newValue) {
                    this.input.setAttribute(name, newValue);
                } else {
                    this.input.removeAttribute(name);
                }
                break;
        }
    }

    inputChangedCallback() {
        if (this.checkValidity()) {
            this.internals.setFormValue(this.input.value);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-input", HeliumInput);
});
