class HeliumCheck extends HTMLElement {
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

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
        :host {
            display: inline-block;
            width: fit-content;
        }

        .container {
            display: block;
            position: relative;
            padding-left: 25px;
            margin-bottom: 12px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            background-color: #eee;
            border-radius: var(--he-check-radius, 3px);
            transform: scale(var(--he-check-scale, 0.7)) translateY(-5px);
        }

        :host(:hover) .checkmark {
            background-color: var(--he-check-clr-check, #ccc);
        }

        :host(:state(checked)) .checkmark {
            background-color: var(--he-check-clr-box, #2196F3);
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        :host(:state(checked)) .checkmark:after {
            display: block;
        }

        :host(:state(checked):state(indeterminate)) .checkmark:after {
            display: block;
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
            height: 0px;
            top: 11px;
            width: 7px;
            left: 7px;
        }

        .checkmark:after {
            left: 8px;
            top: 2px;
            width: 5px;
            height: 12px;
            border: solid white;
            border-width: 0 4px 4px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        } 
        `);

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
            case 'name':
                this.name = newValue;
                break;
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
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-check", HeliumCheck);
});
