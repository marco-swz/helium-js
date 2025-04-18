import sheet from "./toggle.css";

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
export class HeliumToggle extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'disabled',
        'checked',
        'name',
    ];

    /** @type {ElementInternals} */
    internals;
    /** @type {HTMLDivElement} */
    $inner;
    /** @type {number} */
    slotCount = 0;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$inner = document.createElement('div');
        shadow.append(this.$inner);

        shadow.adoptedStyleSheets = [sheet];
        this.internals = this.attachInternals();
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', '');
            this.internals.states.add('checked');
            this.internals.setFormValue(this.value)
        } else {
            this.removeAttribute('checked');
            this.internals.states.delete('checked');
            this.internals.setFormValue(null);
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
            default:
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
        this.$inner.textContent = this.textContent;
        for (let $elem of this.children) {
            const useSlot = $elem.hasAttribute('slotted');
            if (useSlot) {
                let $slot = document.createElement('slot');
                const slotName = `slot${this.slotCount++}`;
                $elem.slot = slotName;
                $slot.name = slotName;
                this.$inner.append($slot);
            } else {
                this.$inner.append($elem);
            }
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
