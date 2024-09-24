const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    display: inline-block;\r\n    height: 20px;\r\n    aspect-ratio: 1;\r\n    border-radius: var(--he-check-radius, 3px);\r\n}\r\n\r\n.container {\r\n    display: block;\r\n    width: 100%;\r\n    height: 100%;\r\n    cursor: pointer;\r\n    -webkit-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    border-radius: inherit;\r\n}\r\n\r\n.checkmark {\r\n    height: 100%;\r\n    width: 100%;\r\n    background-color: #eee;\r\n    border-radius: inherit;\r\n}\r\n\r\n:host(:hover) .checkmark {\r\n    background-color: var(--he-check-clr-hover, lightgrey);\r\n}\r\n\r\n:host(:state(checked)) .checkmark {\r\n    background-color: var(--he-check-clr-checked, grey);\r\n}\r\n\r\n:host(:state(checked)) .checkmark:after {\r\n    display: block;\r\n}\r\n\r\n:host(:state(checked):state(indeterminate)) .checkmark:after {\r\n    display: block;\r\n    -webkit-transform: translate(50%, 200%);\r\n    -ms-transform: translate(50%, 200%);\r\n    transform: translate(50%, 200%);\r\n    height: 0;\r\n    width: 30%;\r\n}\r\n\r\n.checkmark:after {\r\n    content: \"\";\r\n    display: none;\r\n    height: 50%;\r\n    aspect-ratio: 0.3;\r\n    border: solid white;\r\n    border-width: 0 4px 4px 0;\r\n    -webkit-transform: translate(var(--he-check-left-shift, 100%), var(--he-check-top-shift, 10%)) rotate(45deg);\r\n    -ms-transform: translate(var(--he-check-left-shift, 100%), var(--he-check-top-shift, 10%)) rotate(45deg);\r\n    transform: translate(var(--he-check-left-shift, 100%), var(--he-check-top-shift, 10%)) rotate(45deg);\r\n} \r\n");

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

export { HeliumCheck };
