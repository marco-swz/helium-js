import { i, r, b, _ as __decorate } from './lit-element-C9ed7Kq3.js';
import { t } from './custom-element-DX8pDbbK.js';
import { n as n$1 } from './property-BCLoIpyb.js';
import { n, e } from './ref-C9xuETNn.js';

var styles = ":host {\n    --he-input-borderColor: lightgrey;\n    --he-input-borderWidth: 1px;\n    --he-input-borderStyle: solid;\n    --he-input-color: black;\n    --he-input-fontSize: 14px;\n    --he-input-backgroundColor: whitesmoke;\n    --he-input-hover-borderColor: grey;\n    --he-input-loading-spinner-color: black;\n    --he-input-padding: 0.3rem 0.4rem;\n\n    display: inline-block;\n    position: relative;\n    border-radius: 3px;\n    background-color: var(--he-input-backgroundColor);\n    width: 100%;\n    height: 1.6rem;\n    font-size: var(--he-input-fontSize);\n    border-style: var(--he-input-borderStyle);\n    border-color: var(--he-input-borderColor);\n    border-width: var(--he-input-borderWidth);\n    color: var(--he-input-color);\n    cursor: text;\n}\n\n#cont-inp {\n    display: inline-flex;\n    width: 100%;\n    height: 100%;\n}\n\n:host(:hover), :host([variant=\"underline\"]:hover) {\n    transition:\n        border-color 0.2s;\n    border-color: var(--he-input-hover-borderColor);\n}\n\n:host([variant=\"underline\"]) {\n    border-top: 0;\n    border-left: 0;\n    border-right: 0;\n    border-radius: 0;\n    border-bottom-color: var(--he-input-borderColor);\n\n}\n\n:host([invalid]) {\n    transition:\n        border-color 0.2s;\n    border-color: indianred;\n}\n\n:host([invalid]:hover) {\n    border-color: indianred;\n}\n\n:host([loading])::after {\n    content: \"\";\n    position: absolute;\n    width: 12px;\n    height: 12px;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto 10px auto auto;\n    border: 3px solid darkgrey;\n    border-radius: 50%;\n    border-bottom-color: var(--he-input-loading-spinner-color);\n    animation: button-loading-spinner 1s ease infinite;\n}\n\n:host([ok]) {\n    border-color: green;\n}\n\n:host([ok])::after {\n    content: \"✔\";\n    position: absolute;\n    width: 10px;\n    height: 15px;\n    color: green;\n    top: 1px;\n    right: 8px;\n    font-weight: 700;\n}\n\n#inp-main {\n    font-family: inherit;\n    outline: none;\n    background-color: inherit;\n    width: 100%;\n    font-size:inherit;\n    border-radius: inherit;\n    border: none;\n    padding: var(--he-input-padding);\n    cursor: inherit;\n    color: inherit;\n}\n\n:host([readonly]:hover),\n:host([disabled]:hover) {\n    border-color: var(--he-input-borderColor);\n}\n\n:host([readonly]), :host([disabled]) {\n    cursor: default;\n    color: hsl(from var(--he-input-color) h s calc(l + 50))\n}\n\ndiv[slot=content] {\n    max-height: 200px;\n}\n\n#cont-options {\n    display: flex;\n    flex-direction: column;\n}\n\nhe-popover {\n    --he-popover-borderRadius: 5px;\n}\n\n::slotted(*) {\n    cursor: pointer;\n    padding: 5px 10px;\n    border-radius: 3px;\n}\n\n::slotted(*:hover) {\n    background-color: hsl(from white h s calc(l - 10));\n}\n\n@keyframes button-loading-spinner {\n    from {\n        transform: rotate(0turn);\n    }\n\n    to {\n        transform: rotate(1turn);\n    }\n}\n";

let HeliumInput = class HeliumInput extends i {
    static get styles() {
        return [
            r(styles),
        ];
    }
    static { this.formAssociated = true; }
    render() {
        return b `
            <div id="cont-inp">
                <input id="inp-main"
                    ${n(this._refs.input)}
                    @change=${this._handleChangeInput}
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
        this._refs = {
            input: e(),
        };
        this.default = null;
        this.disabled = false;
        this.loading = false;
        this.name = null;
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
        const validity = this._refs.input.value?.validity ?? { valid: true };
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
    reset() {
        this.formResetCallback();
        return this;
    }
    /**
     * Selects (highlights) the input text.
     */
    select() {
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
};
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "default", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "disabled", void 0);
__decorate([
    n$1({ reflect: true, type: Boolean })
], HeliumInput.prototype, "loading", void 0);
__decorate([
    n$1({ reflect: true, type: String })
], HeliumInput.prototype, "name", void 0);
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
