import sheet from './button.css';

/**
 * A button with included loading animation.
 *
 * @attr he-input-invalid - One or more IDs of `HeliumInput` elements. 
 * The attribute is set by the inputs themself if they are invalid.
 * This behavior is activated by he `report-validtity` attribute of the `HeliumInput`.
 * @attr show-dialog - Calls `.showModal()` on the specified element(s) if the button is pressed.
 * @attr close-dialog - Calls `.close()` on the specified element(s) if the button is pressed.
 * @attr {string} onload - The content `onload` is evaluated when attached to the DOM
 *
 * @cssprop [--he-button-cursor-loading = default] - The cursor style when in `loading` state
 * @cssprop [--he-button-cursor-hover = pointer] - The cursor style when hovering
 * @cssprop [--he-button-cursor-disabled = not-allowed] - The cursor style when in `disabled` state
 *
 * @extends HTMLElement
 * @todo Add all css variables to doc
 * @todo Disable all click events when disabled or loading
 */
export class HeliumButton extends HTMLElement {
    static observedAttributes = [
        'theme',
        'variant',
        'popovertarget',
        'popovertargetaction',
        'form',
        'formtarget',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'show-dialog',
        'close-dialog',
        'submit',
        'he-input-invalid',
        'disabled',
    ];
    /** @type {HTMLInputElement} */
    $button;
    /** @type {?EventListener} */
    listenerClick = null;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$button = document.createElement('button');
        this.$button.id = 'he-button'

        shadow.append(this.$button);
        shadow.adoptedStyleSheets = [sheet];
        this.internals = this.attachInternals();
    }

    /**
     * Gets or sets the `disabled` state of the button.
     * @type {boolean}
     */
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', true);
        } else {
            this.removeAttribute('disabled');
        }

    }

    get disabled() {
        return this.getAttribute('disabled') != null;
    }

    /**
     * Gets or sets the `loading` state of the button.
     * While loading, a spinner is shown on top of the button.
     * @type {boolean}
     */
    set loading(val) {
        if (val) {
            this.setAttribute('loading', true);
            this.internals.states.add('loading');
        } else {
            this.removeAttribute('loading');
            this.internals.states.delete('loading');
        }
    }

    get loading() {
        return this.getAttribute('loading') != null;
    }

    /**
     * Gets or sets the theme of the button.
     * @type {'primary'|'secondary'}
     */
    set theme(val) {
        if (val) {
            this.setAttribute('theme', val);
        } else {
            this.removeAttribute('theme');
        }
    }

    get theme() {
        return this.getAttribute('theme');
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'show-dialog':
                this.removeEventListener('click', this._showDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._showDialog);
                }
                break;
            case 'close-dialog':
                this.removeEventListener('click', this._hideDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._closeDialog());
                }
                break;
            case 'submit':
                this.addEventListener('click', () => this._submitForm())
                break;
            case 'he-input-invalid':
                if (newValue) {
                    this.disabled = true;
                } else {
                    this.disabled = false;
                }
                break;
            case 'theme':
                break;
            case 'variant': 
                if (newValue === 'primary') {


                } else if (newValue === 'outline') {

                } else if (newValue === 'ghost') {

                } else {

                }
                break;
            case 'disabled':
                if (newValue) {
                    this.internals.states.add('disabled');
                    this.$button.setAttribute('disabled', true);
                } else {
                    this.internals.states.delete('disabled');
                    this.$button.removeAttribute('disabled');
                }
                break;
            default:
                if (newValue === null || newValue === 'false') {
                    this.$button.removeAttribute(name);
                } else {
                    this.$button.setAttribute(name, newValue);
                }
                break;
        }
    }

    connectedCallback() {
        this.$button.innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.onload && this.onload();
    }

    _closeDialog() {
        document.querySelectorAll(this.getAttribute('close-dialog'))
            .forEach(($diag) => $diag.close());
    }

    _submitForm() {
        const id = this.getAttribute('submit');
        const $form = document.querySelector(id);
        console.assert($form == null, `No form found with ID ${id}`);
        console.assert($form.nodeName === 'FORM', 'The element is not a form!')
        $form.submit();
    }

    _showDialog() {
        document.querySelectorAll(this.getAttribute('show-dialog'))
            .forEach(($diag) => $diag.showModal());
    }
}

if (!customElements.get('he-button')) {
    customElements.define("he-button", HeliumButton);
}

