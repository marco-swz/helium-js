const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    --he-toggle-color: black;\n    --he-toggle-backgroundColor: white;\n    --he-toggle-hover-backgroundColor: hsl(240 4.8% 95.9%);\n    --he-toggle-outline-borderColor: lightgrey;\n    --he-toggle-checked-color: black;\n    --he-toggle-checked-backgroundColor: hsl(from var(--he-toggle-backgroundColor) h s calc(l - 10));\n    --he-toggle-height: 35px;\n    --he-toggle-minWidth: var(--he-toggle-height);\n    --he-toggle-cursor: pointer;\n\n    background-color: var(--he-toggle-backgroundColor);\n    color: var(--he-toggle-color);\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    border-radius: 3px;\n    height: var(--he-toggle-height);\n    min-width: var(--he-toggle-minWidth);\n    cursor: var(--he-toggle-cursor);\n    font-weight: 600;\n}\n\n:host(:not(:disabled):hover) {\n    background-color: var(--he-toggle-hover-backgroundColor);\n}\n\n:host([checked]) {\n    color: var(--he-toggle-checked-color);\n    background-color: var(--he-toggle-checked-backgroundColor);\n}\n\n:host([variant=outline]) {\n    border: 1px solid var(--he-toggle-outline-borderColor);\n}\n");

/**
 * The `he-toggle` element is a button, which switches between on and off state when clicked.
 *
 * When multiple `he-toggle` elements share the same `name`, selecting one unselects the rest.
 * When part of a `form`, only `he-toggle` elements within the form are effected by this behavior.
 * Otherwise, the whole document is searched for `he-toggle` with the same `name`.
 *
 * @element he-toggle
 *
 * @slot inner - The html content of the toggle element
 *
 * @attr {null|'outline'} variant - The styling variation of the element
 *
 * @fires change - The element has been toggled
 *
 * @extends HTMLElement
 */
class HeliumToggle extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'disabled',
        'checked',
        'name',
    ];

    /** @type {HTMLSlotElement} */
    $slot;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$slot = document.createElement('slot');
        this.$slot.name = 'inner';
        shadow.append(this.$slot);

        shadow.adoptedStyleSheets = [sheet];
        this.internals = this.attachInternals();
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', '');
            this.internals.states.add('checked');
        } else {
            this.removeAttribute('checked');
            this.internals.states.delete('checked');
        }
    }

    get checked() {
        return this.getAttribute('checked') != null;
    }

    /**
     * Gets or sets the `disabled` state of the element.
     * @type {boolean}
     */
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }

    }

    get disabled() {
        return this.getAttribute('disabled') != null;
    }

    /**
     * Gets or sets the name of the element.
     * The name will be used for form submissions.
     * If multiple `he-toggle` have the same name, only the last one clicked changes to selected
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

    /**
     * Gets or sets the value of the element.
     * @type {string}
     */
    set value(val) {
        if (val) {
            this.setAttribute('value', val);
        } else {
            this.removeAttribute('value');
        }
    }

    get value() {
        return this.getAttribute('value');
    }


    /**
     * Native callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'checked': 
                if (!this.disabled) {
                    this.internals.setFormValue(newValue);
                } 
                break;
            case 'disabled':
                if (newValue != null) {
                    this.internals.setFormValue(null);
                } else {
                    this.internals.setFormValue(this.checked);
                }
                break;
        }
    }

    /**
     * Checks if the value of the input is valid and
     * reports the validity.
     * @returns {boolean}
     */
    checkValidity() {
        return true;
    }

    /**
     * This native callback is called when the web component is added to the DOM.
     * @returns {void}
     */
    connectedCallback() {
        if (this.innerHTML !== '') {
            let $cont = document.createElement('span');
            $cont.slot = 'inner';
            $cont.innerHTML = this.innerHTML;
            this.innerHTML = '';
            this.append($cont);
        }
        this.onclick = () => this._clickCallback.bind(this)();
    }

    /**
     * The native callback function for resetting the input a part of a form.
     */
    formResetCallback() {
        this.checked = false;
    }

    /**
     * Resets the input to the default state.
     * @returns {Self}
     */
    reset() {
        this.formResetCallback();
        return this;
    }

    /**
     * Callback for clicks
     */
    _clickCallback() {
        if (this.disabled) {
            return;
        }

        this.checked = !this.checked;
        
        if (this.name != null) {
            const $form = this.internals.form;
            let $searchElem = $form == null
                ? document
                : $form;

            for (let $toggle of $searchElem.querySelectorAll(`he-toggle[name="${this.name}"]`)) {
                if ($toggle != this) {
                    $toggle.checked = false;
                }
            }
        }

        this.dispatchEvent(new Event('change', { 'bubbles': true }));
    }
}

if (!customElements.get('he-toggle')) {
    customElements.define("he-toggle", HeliumToggle);
}

export { HeliumToggle };
