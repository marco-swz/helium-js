// @ts-ignore
import styles from "./input.css";
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { unsafeCSS } from 'lit-element';

@customElement('he-input')
export class HeliumInput extends LitElement {
    static get styles() {
        return [
            unsafeCSS(styles),
        ];
    }
    static formAssociated = true;

    _internals: ElementInternals;
    _refs: {
        input: Ref<HTMLInputElement> 
    } = {
        input: createRef(),
    };

    @property({ reflect: true, type: String })
    default: string | null = null;
    @property({ reflect: true, type: Boolean })
    disabled = false;
    @property({ reflect: true, type: Boolean })
    loading = false;
    @property({ reflect: true, type: String })
    name: string | null = null;
    @property({ reflect: true, type: String })
    placeholder: string | null = null;
    @property({ reflect: true, type: Boolean })
    required = false;
    @property({ reflect: true, type: Boolean })
    readonly = false;
    @property({ reflect: true, type: String })
    type: string | null = null;
    @property({ reflect: true, type: String })
    value: string | null = null;
    @property({ reflect: true, type: Number })
    step: number | null = null;
    @property({ reflect: true, type: String })
    pattern: string | null = null;

    render() {
        return html`
            <div id="cont-inp">
                <input id="inp-main"
                    ${ref(this._refs.input)}
                    @change=${this._handleChangeInput}
                    .type=${this.type}
                    .placeholder=${this.placeholder ?? ''}
                    .step=${this.step ?? nothing}
                    .pattern=${this.pattern ?? '.*'}
                    ?readonly=${this.readonly}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    autocomplete="off"
                />
            </div>
        `;
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._internals.setFormValue('');
    }

    /**
     * Native callback for attribute changes of the web component.
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'type':
                if (newValue === 'hidden') {
                    this.style.display = 'none';
                } else if (oldValue === 'hidden') {
                    this.style.display = '';
                }
                break;
            case 'default':
                if (this.value === '' && !this.disabled) {
                    this._internals.setFormValue(newValue);
                }
                break;
            case 'value':
                if (!this.disabled) {
                    this._internals.setFormValue(newValue ?? '');
                }
                break;
            case 'disabled':
                if (newValue != null) {
                    this._internals.setFormValue(null);
                } else {
                    this._internals.setFormValue(this.value);
                }
                break;
        }
    }

    /**
     * Checks if the value of the input is valid and
     * reports the validity.
     */
    checkValidity(): boolean {
        const validity = this._refs.input.value?.validity ?? { valid: true };
        if (validity.valid) {
            this.invalid = false;
        } else {
            this.invalid = true;
        }

        return validity.valid;
    }

    /**
     * Sets the focus to the input.
     */
    focus(): HeliumInput {
        this._refs.input.value?.focus();
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
     * Resets the input to the default state.
     */
    reset(): HeliumInput {
        this.formResetCallback();
        return this;
    }

    /**
     * Selects (highlights) the input text.
     */
    select(): HeliumInput {
        this._refs.input.value?.select();
        return this;
    }

    /**
     * Callback for input changes.
     */
    _handleChangeInput() {
        if (this.disabled) {
            return;
        }

        if (this.checkValidity()) {
            this._internals.setFormValue(this._refs.input.value?.value ?? '');
        }

        this.dispatchEvent(new CustomEvent('change'));
    }
}
