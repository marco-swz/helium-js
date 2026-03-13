import { a as i, i as i$1, b, _ as __decorate } from './lit-element-CVcEPTag.js';
import { t } from './custom-element-DX8pDbbK.js';
import { n as n$1 } from './property-CSzmnPJu.js';
import { n, e } from './ref-CgVzTi_x.js';

const styles = i `
:host {
    --he-input-borderColor: lightgrey;
    --he-input-borderWidth: 1px;
    --he-input-borderStyle: solid;
    --he-input-color: black;
    --he-input-fontSize: 14px;
    --he-input-backgroundColor: whitesmoke;
    --he-input-hover-borderColor: grey;
    --he-input-loading-spinner-color: black;
    --he-input-padding: 0.3rem 0.4rem;

    display: inline-block;
    position: relative;
    border-radius: 3px;
    background-color: var(--he-input-backgroundColor);
    width: 100%;
    height: 1.6rem;
    font-size: var(--he-input-fontSize);
    border-style: var(--he-input-borderStyle);
    border-color: var(--he-input-borderColor);
    border-width: var(--he-input-borderWidth);
    color: var(--he-input-color);
    cursor: text;
}

#cont-inp {
    display: inline-flex;
    width: 100%;
    height: 100%;
}

:host(:hover), :host([variant="underline"]:hover) {
    transition:
        border-color 0.2s;
    border-color: var(--he-input-hover-borderColor);
}

:host([variant="underline"]) {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    border-bottom-color: var(--he-input-borderColor);

}

:host([invalid]) {
    transition:
        border-color 0.2s;
    border-color: indianred;
}

:host([invalid]:hover) {
    border-color: indianred;
}

:host([loading])::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto 10px auto auto;
    border: 3px solid darkgrey;
    border-radius: 50%;
    border-bottom-color: var(--he-input-loading-spinner-color);
    animation: button-loading-spinner 1s ease infinite;
}

:host([ok]) {
    border-color: green;
}

:host([ok])::after {
    content: "✔";
    position: absolute;
    width: 10px;
    height: 15px;
    color: green;
    top: 1px;
    right: 8px;
    font-weight: 700;
}

#inp-main {
    font-family: inherit;
    outline: none;
    background-color: inherit;
    width: 100%;
    font-size:inherit;
    border-radius: inherit;
    border: none;
    padding: var(--he-input-padding);
    cursor: inherit;
    color: inherit;
}

:host([readonly]:hover),
:host([disabled]:hover) {
    border-color: var(--he-input-borderColor);
}

:host([readonly]), :host([disabled]) {
    cursor: default;
    color: hsl(from var(--he-input-color) h s calc(l + 50))
}

div[slot=content] {
    max-height: 200px;
}

#cont-options {
    display: flex;
    flex-direction: column;
}

he-popover {
    --he-popover-borderRadius: 5px;
}

::slotted(*) {
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 3px;
}

::slotted(*:hover) {
    background-color: hsl(from white h s calc(l - 10));
}

@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }

    to {
        transform: rotate(1turn);
    }
}
`;

let HeliumInput = class HeliumInput extends i$1 {
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
