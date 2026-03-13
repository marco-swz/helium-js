import { i, b, _ as __decorate } from './lit-element-C9ed7Kq3.js';
import { s as styles } from './button-BhPFrdJo.js';
import { t } from './custom-element-DX8pDbbK.js';
import { n as n$1 } from './property-BCLoIpyb.js';
import { n, e } from './ref-C9xuETNn.js';

let HeliumInput = class HeliumInput extends i {
    static get styles() {
        return [
            styles
        ];
    }
    static { this.formAssociated = true; }
    render() {
        return b `
            <div id="cont-inp">
                <input 
                    @change=${this._handleChangeInput}
                    ${n(this._refInput)}
                    id="inp-main"
                    .type=${this.type}
                    .placeholder=${this.placeholder ?? ''}
                    .step=${this.step ?? '1'}
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
        this._refInput = e();
        this.default = null;
        this.disabled = false;
        this.invalid = false;
        this.loading = false;
        this.name = null;
        this.ok = false;
        this.placeholder = null;
        this.required = false;
        this.readonly = false;
        this.type = null;
        this.value = null;
        this.step = null;
        this.pattern = null;
        this._internals = this.attachInternals();
        this._internals.setFormValue('');
    }
    /**
     * Native callback for attribute changes of the web component.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'type':
                if (newValue === 'hidden') {
                    this.style.display = 'none';
                }
                else if (oldValue === 'hidden') {
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
                }
                else {
                    this._internals.setFormValue(this.value);
                }
                break;
        }
    }
    /**
     * Checks if the value of the input is valid and
     * reports the validity.
     */
    checkValidity() {
        const validity = this._refInput.value?.validity ?? { valid: true };
        if (validity.valid) {
            this.invalid = false;
        }
        else {
            this.invalid = true;
        }
        return validity.valid;
    }
    /**
     * Sets the focus to the input.
     */
    focus() {
        this._refInput.value?.focus();
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
    reset() {
        this.formResetCallback();
        return this;
    }
    /**
     * Selects (highlights) the input text.
     */
    select() {
        this._refInput.value?.select();
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
            this._internals.setFormValue(this._refInput.value?.value ?? '');
        }
        this.dispatchEvent(new CustomEvent('change'));
    }
};
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "default", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "disabled", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "invalid", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "loading", void 0);
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "name", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "ok", void 0);
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "placeholder", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "required", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "readonly", void 0);
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "type", void 0);
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "value", void 0);
__decorate([
    n$1({ reflect: true, type: Number })
], HeliumInput.prototype, "step", void 0);
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "pattern", void 0);
HeliumInput = __decorate([
    t('he-input')
], HeliumInput);

export { HeliumInput };
