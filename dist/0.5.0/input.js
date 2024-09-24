const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    display: inline-flex;\r\n    position: relative;\r\n    border-radius: 3px;\r\n    background-color: whitesmoke;\r\n    width: 100%;\r\n    height: fit-content;\r\n    font-size: 14px;\r\n    border: 1px solid lightgrey;\r\n}\r\n\r\n:host(:hover), :host(:focus) {\r\n    border-color: var(--he-input-clr-border-hover, grey);\r\n}\r\n\r\n:host([invalid]) {\r\n    border-color: indianred;\r\n}\r\n\r\n:host([invalid]:hover) {\r\n    border-color: indianred;\r\n}\r\n\r\n:host([loading])::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 12px;\r\n    height: 12px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto 10px auto auto;\r\n    border: 3px solid darkgrey;\r\n    border-radius: 50%;\r\n    border-bottom-color: var(--he-input-clr-spinner, black);\r\n    animation: button-loading-spinner 1s ease infinite;\r\n}\r\n\r\n:host([ok])::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 10px;\r\n    height: 15px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto 10px auto auto;\r\n    border: 3px solid transparent;\r\n    border-bottom-color: var(--he-input-clr-ok, black);\r\n    border-right-color: var(--he-input-clr-ok, black);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n#inp-main {\r\n    outline: none;\r\n    background-color: inherit;\r\n    width: inherit;\r\n    font-size:inherit;\r\n    border-radius: inherit;\r\n    border: none;\r\n    padding: 0.3rem 0.4rem;\r\n    cursor: inherit;\r\n}\r\n\r\n:host([readonly]:hover), :host([readonly]:focus),\r\n:host([disabled]:hover), :host([disabled]:focus) {\r\n    border-color: var(--he-input-clr-border-hover, lightgrey);\r\n}\r\n\r\n:host([readonly]), :host([disabled]) {\r\n    cursor: default\r\n}\r\n\r\n@keyframes button-loading-spinner {\r\n    from {\r\n        transform: rotate(0turn);\r\n    }\r\n\r\n    to {\r\n        transform: rotate(1turn);\r\n    }\r\n}\r\n\r\n");

class HeliumInput extends HTMLElement {
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
