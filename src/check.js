import sheet from "./check.css";

/**
 * A custom checkbox with full form compatibility and additonal styling options.
 *
 * @attr name - The name of the checkbox element. It is used as key when submitting forms, like native checkboxes.
 * @prop {on|off} indeterminate - Changes the checkmark to a horizontal bar, to indicate a state between checked and unchecked
 * @prop {on|off} checked - Changes the checkbox to the checked state
 *
 * @cssprop [--he-check-clr-hover=lightgrey] - The background color when hovering
 * @cssprop [--he-check-clr-checked=grey] - The background color when checked
 * @cssprop [--he-check-left-shift=100%] - Use this variable to position the checkmark horizontally
 * @cssprop [--he-check-top-shift=10%] - Use this variable to position the checkmark vertically
 * @cssprop [--he-check-radius=3px] - The border radius of the checkmark
 * @cssprop [--he-check-clr-checkmark=white] - The color of the checkmark itself
 *
 * @extends HTMLElement
 */
export class HeliumCheck extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'name',
        'indeterminate',
    ];

    /** @type {HTMLSpanElement} */
    $mark;
    /** @type {ElementInternals} */
    $internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let $container = document.createElement('div');
        $container.classList.add('container');
        $container.innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.$mark = document.createElement('div');
        this.$mark.classList.add('checkmark');
        $container.append(this.$mark);

        shadow.append($container);
        shadow.adoptedStyleSheets = [sheet];

        this.$internals = this.attachInternals();
    }

    connectedCallback() {
        this.addEventListener('click', () => this.toggle());
    }

    /**
     * Gets or sets the `checked` state of the checkbox
     * @type {boolean}
     */
    set checked(val) {
        if (val) {
            this.setAttribute('checked', true);
            this.$internals.states.add('checked');
            this.$internals.setFormValue('on', 'checked');
        } else {
            this.removeAttribute('checked');
            this.$internals.states.delete('checked');
            this.$internals.setFormValue(null);
        }
    }

    get checked() {
        return this.$internals.states.has('checked');
    }

    /**
     * Gets or sets the name of the checkbox.
     * This is used as key when submitting a form.
     * @type {string}
     */
    set name(val) {
        this.setAttribute('name', val);
    }

    get name() {
        return this.getAttribute('name');
    }

    /**
     * Gets or sets the `indeterminate` state of the checkbox.
     * @type {boolean}
     */
    set indeterminate(val) {
        if (val) {
            this.$internals.states.add('indeterminate');
        } else {
            this.$internals.states.delete('indeterminate');
        }
    }

    get indeterminate() {
        return this.$internals.states.has('indeterminate');
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

if (!customElements.get('he-check')) {
    customElements.define("he-check", HeliumCheck);
}
