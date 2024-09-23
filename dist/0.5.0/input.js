class HeliumInput extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'pattern',
        'required',
        'report-validity',
        'type',
    ];

    /** @type {HTMLInputElement} */
    input;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            :host {
                display: inline-flex;
                position: relative;
            }

            :host[loading]::after {
                content: "";
                position: absolute;
                width: 12px;
                height: 12px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 3px solid darkgrey;
                border-radius: 50%;
                border-bottom-color: var(--he-input-clr-spinner, black);
                animation: button-loading-spinner 1s ease infinite;
            }

            :host[ok]::after {
                content: "";
                position: absolute;
                width: 10px;
                height: 15px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 3px solid transparent;
                border-bottom-color: var(--he-input-clr-ok, black);
                border-right-color: var(--he-input-clr-ok, black);
                transform: rotate(45deg);
            }

            #inp-main {
                outline: none;
                background-color: var(--he-input-clr-bg, whitesmoke);
                border: 1px solid lightgrey;
                width: var(--he-input-width, 100%);
                padding: 0.3rem 0.4rem;
                font-size: var(--he-input-fs, 14px);
                border-radius: var(--he-input-border-radius, 3px);
            }

            #inp-main:hover, #inp-main:focus {
                border-color: var(--he-input-clr-border-hover, grey);
            }

            #inp-main[valid=false] {
                border-color: var(--he-input-clr-border-invalid, indianred);
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
            this.input.setAttribute('valid', true);
        } else {
            this.input.setAttribute('valid', false);
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
                    validSet.delete(id);
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

export { HeliumInput };
