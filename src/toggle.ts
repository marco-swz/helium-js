import { styles } from './toggle_styles.ts';
import {LitElement, html } from 'lit';
import {customElement, property } from 'lit/decorators.js';

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
 * @extends LitElement
 */
@customElement('he-toggle')
export class HeliumToggle extends LitElement {
    static get styles() {
        return [
            styles
        ];
    }
    static formAssociated = true;
    static observedAttributes = [
        'disabled',
        'checked',
        'name',
    ];

    _internals: ElementInternals;

    @property({ type: Boolean, reflect: true }) 
    checked = false;
    @property({ type: Boolean, reflect: true }) 
    disabled = false;
    @property({ type: String, reflect: true }) 
    name: string | null = null;

    constructor() {
        super();
        this._internals = this.attachInternals();
    }

    render() {
        return html`
            <div @click=${this._clickCallback}>
                <slot></slot>
            </div>
        `;
    }

    /**
     * Native callback for attribute changes of the web component.
     */
    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        switch (name) {
            case 'checked': 
                if (newValue != null && !this.disabled) {
                    this._internals.states.add('checked');
                    this._internals.setFormValue(<any> this.checked)
                } else {
                    this._internals.states.delete('checked');
                    this._internals.setFormValue(null);
                }
                break;
            case 'disabled':
                if (newValue != null) {
                    this._internals.setFormValue(null);
                } else {
                    this._internals.setFormValue(<any> this.checked);
                }
                break;
            default:
                break;
        }
    }

    /**
     * Checks if the value of the input is valid and
     * reports the validity.
     */
    checkValidity(): boolean {
        return true;
    }

    /**
     * This native callback is called when the web component is added to the DOM.
     */
    connectedCallback(): void {
        this.addEventListener('click', () => this._clickCallback.bind(this)());
    }

    /**
     * The native callback function for resetting the input a part of a form.
     */
    formResetCallback(): void {
        this.checked = false;
    }

    /**
     * Resets the input to the default state.
     */
    reset(): HeliumToggle {
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
            const $form = this._internals.form;
            let $searchElem = $form == null
                ? document
                : $form;

            for (let $toggle of $searchElem.querySelectorAll(`he-toggle[name="${this.name}"]`)) {
                if ($toggle != this) {
                    ($toggle as HeliumToggle).checked = false;
                }
            }
        }

        this.dispatchEvent(new Event('change', { 'bubbles': true }));
    }
}
