import sheet from "./input.css";
import { HeliumPopover } from "./popover.js";

/**
 * An input element with additional features.
 *
 * Features:
 *   - Report validity to other elements
 *   - Loading indicator
 *   - Full form compatibility
 *   - Builtin support for suggestions
 *
 * ## Suggestions
 *
 * Suggestions can be added through the `option` slot.
 * To decide the value when an option is clicked, first the value is used,
 * if not present the `innerHTML` is used.
 * 
 * ```html
 * <he-input>
 *  <option slot="option" value="a">Option A</option>
 *  <option slot="option" value="b">Option B</option>
 * </he-input>
 * ```
 *
 * ## Reporting Validity
 *
 * The input can report its validity to other elements.
 * When is is invalid, the ID of this element is added to the `he-input-invalid` attribute on the target element.
 * When more inputs report to the same element, `he-input-invalid` will hold a space-separated list of IDs of all invalid inputs.
 * The target is selected using the `report-invalid` attribute on the input.
 *
 * @element he-input
 *
 * @slot options - Represents a single option shown as suggestion
 *
 * @attr pattern - A `RegExp` pattern to check, if the input is valid
 * @attr {on|off} required - If set, the input will count empty values as invalid
 * @attr report-invalid - The selector of another HTML element. 
 * The attribute `he-input-invalid` will be set on to the ID of this input.
 * If multiple inputs report their validity, `he-input-invalid` will be a space-separated list of IDs.
 * @attr {'text','hidden'} [type=text] - The type of the input
 * @attr {on|off} [disabled=off] - Toggles the `disabled` state of the input. A disabled input will not be submitted in forms.
 * @attr {on|off} [readonly=off] - Toggles the `readonly` state of the input. Contrary to `disabled`, the value will still be submitted in forms.
 * @attr {on|off} [autocomplete=off] - Shows suggestion from previous inputs (browser native appearance)
 *
 * @cssprop [--he-input-clr-black] - The color of the text
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
        'value',
    ];

    /** @type {HTMLInputElement} */
    $input;
    /** @type {HeliumPopover} */
    $popover;
    /** @type {HTMLSlotElement} */
    $slot;
    /** @type {ElementInternals} */
    internals;
    /** @type {HTMLSlotElement} */
    $options;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$input = document.createElement('input');
        this.$input.type = 'text';
        this.$input.autocomplete = 'off';
        this.$input.id = 'inp-main';

        this.$options = document.createElement('div');
        this.$options.id = 'cont-options';

        this.$slot = document.createElement('slot');
        this.$slot.name = 'option';
        this.$options.append(this.$slot);

        const $content = document.createElement('div');
        $content.slot = 'content';
        $content.append(this.$options);

        this.$popover = document.createElement('he-popover');
        this.$popover.append($content);
        this.$popover.dismiss = "manual";
        this.$popover.anchorElement = this;

        shadow.append(this.$input);
        shadow.append(this.$popover);
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

    /**
     * Gets or sets the `ok` attribute on the input.
     * @type {boolean}
     */
    set ok(val) {
        if (val) {
            this.setAttribute('ok', '');
        } else {
            this.removeAttribute('ok');
        }
    }

    get ok() {
        return this.getAttribute('ok');
    }

    /**
     * The `select` event is triggered when a suggestion is clicked.
     * @param {(arg0: InputEvent) => void} val
     */
    set onselect(val) {
        if (val) {
            this.setAttribute('onselect', val);
        } else {
            this.removeAttribute('onselect');
        }
    }


    /**
     * Gets or sets the placeholder.
     * The placeholder is set as value when the input is empty.
     * @type {string}
     */
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

    /**
     * Gets or sets the required attribute of the input.
     * The placeholder is set as value when the input is empty.
     * @type {boolean}
     */
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

    /**
     * Gets or sets the type of the input.
     * @type {string}
     */
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
     * @type {string|number}
     */
    set value(val) {
        this.setAttribute('value', val);
    }

    get value() {
        return this.$input.value === ''
            ? this.placeholder ?? ''
            : this.$input.value;
    }

    /**
     * Native callback for attribute changes of the web component.
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

                if (newValue) {
                    this.$input.setAttribute(name, newValue);
                } else {
                    this.$input.removeAttribute(name);
                }
                break;
            case 'placeholder':
                if (newValue) {
                    this.$input.setAttribute(name, newValue);
                    if (this.value === '' && !this.disabled) {
                        this.internals.setFormValue(newValue);
                    }
                } else {
                    this.$input.removeAttribute(name);
                }
                break;
            case 'value': 
                if (!this.disabled) {
                    this.internals.setFormValue(newValue ?? '');
                }

                if (newValue != null) {
                    this.$input.value = newValue;
                } else {
                    this.$input.removeAttribute(name);
                }
                break;
            case 'disabled':
                if (newValue != null) {
                    this.internals.setFormValue(null);
                    this.$input.disabled = true;
                } else {
                    this.internals.setFormValue(this.value);
                    this.$input.disabled = false;
                }
                break;
            default:
                if (newValue != null) {
                    this.$input.setAttribute(name, newValue);
                } else {
                    this.$input.removeAttribute(name);
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
     * Removes all options from the `innerHTML` of the input.
     * @returns {Self}
     */
    clearOptions() {
        for (const $option of this.$slot.assignedElements()) {
            $option.remove();
        }
        return this;
    }

    /**
     * This native callback is called when the web component is added to the DOM.
     * @returns {void}
     */
    connectedCallback() {
        this.$input.onchange = () => this._inputChangedCallback.bind(this)();
        this.onfocus = () => this._inputFocusCallback.bind(this)();
        this.addEventListener('focusout', (e) => setTimeout(() => this._inputBlurCallback.bind(this)(e), 200));
        this.$slot.onslotchange = () => this._slotChangedCallback.bind(this)();
    }


    /**
     * Sets the focus to the input.
     * @returns {Self}
     */
    focus() {
        this.$input.focus();
        return this;
    }

    /**
     * The native callback function for resetting the input a part of a form.
     */
    formResetCallback() {
        this.value = "";
        this.ok = false;
        this.invalid = false;
    }

    /**
     * Callback for input changes.
     */
    _inputChangedCallback() {
        if (this.disabled) {
            return;
        }

        if (this.checkValidity()) {
            this.internals.setFormValue(this.$input.value);
        }
    }

    _inputFocusCallback() {
        this._updatePopover();
    }

    _inputBlurCallback(e) {
        if (document.activeElement !== this || document.activeElement !== document.body) {
            this.$popover.open = false;
        }
    }

    _optionClickedCallback(e) {
        const $option = e.target;
        const val = $option.value ?? $option.innerHTML;

        this.value = val;
        this.$popover.open = false;
        
        const evt = new CustomEvent('select', {
            detail: { target: $option },
        });
        this.dispatchEvent(evt);
        const onselect = eval(this.getAttribute('onselect'));
        if (typeof onselect === 'function') {
            onselect.call(this, evt);
        }
    }

    _slotChangedCallback() {
        for (const $option of this.$slot.assignedElements()) {
            $option.onclick = (e) => this._optionClickedCallback.bind(this)(e);
        }
        this._updatePopover();
    }

    _updatePopover() {
        if (document.activeElement !== this) {
            return;
        }

        const options = this.$slot.assignedElements();
        if (options.length > 0) {
            this.$popover.open = true;
        } 
    }
}

if (!customElements.get('he-input')) {
    customElements.define("he-input", HeliumInput);
}
