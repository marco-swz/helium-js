import sheet from "./check.css";

export class HeliumCheck extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'name',
        'indeterminate',
    ];

    /** @type {HTMLSpanElement} */
    mark;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let container = document.createElement('div');
        container.classList.add('container');
        container.innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.mark = document.createElement('div');
        this.mark.classList.add('checkmark');
        container.append(this.mark);

        shadow.append(container);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        this.internals = this.attachInternals();
        this.addEventListener('click', () => this.toggle());
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', true);
            this.internals.states.add('checked');
            this.internals.setFormValue('on', 'checked');
        } else {
            this.removeAttribute('checked');
            this.internals.states.delete('checked');
            this.internals.setFormValue(null);
        }
    }

    get checked() {
        return this.internals.states.has('checked');
    }

    set name(val) {
        this.setAttribute('name', val);
    }

    get name() {
        return this.getAttribute('name');
    }

    set indeterminate(val) {
        if (val) {
            this.internals.states.add('indeterminate');
        } else {
            this.internals.states.delete('indeterminate');
        }
    }

    get indeterminate() {
        return this.internals.states.has('indeterminate');
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'indeterminate':
                if (newValue == null || newValue === 'false') {
                    this.indeterminate = false;
                } else {
                    this.indeterminate = true;
                }
                break;
        }
    }

    toggle() {
        this.checked = !this.checked;
        if (this.onchange) {
            const evt = new InputEvent('click');
            this.onchange(evt);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-check", HeliumCheck);
});
