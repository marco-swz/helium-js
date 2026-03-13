import { _ as __decorate, i, r, A, b } from './lit-element-C9ed7Kq3.js';
import { s as styles } from './button-BhPFrdJo.js';
import { t } from './custom-element-DX8pDbbK.js';
import { n } from './property-BCLoIpyb.js';

/**
 * A simple button with pre-definied variants, themes and additional states.
 *
 * @cssprop [--he-button-cursor=pointer] - The default cursor type of the button
 * @cssprop [--he-button-loading-cursor=default] - The cursor type when in `loading` state
 * @cssprop [--he-button-disabled-cursor=not-allowed] - The cursor type when in `disabled` state
 * @cssprop [--he-button-height=35px] - The height of the button
 * @cssprop [--he-button-fontSize=14px] - The font size of the text
 * @cssprop [--he-button-width=fit-content] - The button width
 * @cssprop [--he-button-color=black] - The text color of the button
 * @cssprop [--he-button-backgroundColor=white] - The background color of the button
 * @cssprop [--he-button-borderWidth=0.1rem] - The border width of the button
 * @cssprop [--he-button-borderColor=hsl(240 4.9% 83.9%)] The border color of the button
 * @cssprop [--he-button-hover-backgroundColor=hsl(240 4.8% 95.9%)] - The background color when hovering
 * @cssprop [--he-button-hover-color=black] - The text color when hovering
 * @cssprop [--he-button-hover-borderColor=var(--he-button-borderColor)] - The border color when hovering
 *
 * @tag he-button
 */
let HeliumButton = class HeliumButton extends i {
    constructor() {
        super(...arguments);
        /**
         * Disables the button if set.
         * Clicks will no longer fire events.
         */
        this.disabled = false;
        /**
         * Sets the `loading` state the button.
         * It shows a loading animation and disables inputs.
         */
        this.loading = false;
        /**
         * This property can be used to assign a link to the button.
         * If it is clicked, the link is opened.
         */
        this.href = '';
        /**
         * Sets the (color) theme of the button.
         */
        this.theme = null;
        /**
         * Sets the style variant of the button.
         * @default 'outline'
         */
        this.variant = null;
    }
    static get styles() {
        return [
            r(styles),
        ];
    }
    /**
     * Lit render function.
     * @internal
     */
    render() {
        return b `
            <a href=${this.href || A}>
                <button id="he-button" @click=${() => this._handleClickButton()}>
                    <slot></slot>
                </button>
            </a>
        `;
    }
    /**
     * Callback for button clicks.
     * It is currently just a placeholder for future features.
     * @internal
     */
    _handleClickButton() {
    }
};
__decorate([
    n({ type: Boolean, reflect: true })
], HeliumButton.prototype, "disabled", void 0);
__decorate([
    n({ type: Boolean, reflect: true })
], HeliumButton.prototype, "loading", void 0);
__decorate([
    n({ type: String, reflect: true, useDefault: true })
], HeliumButton.prototype, "href", void 0);
__decorate([
    n({ reflect: true })
], HeliumButton.prototype, "theme", void 0);
__decorate([
    n({ reflect: true })
], HeliumButton.prototype, "variant", void 0);
HeliumButton = __decorate([
    t('he-button')
], HeliumButton);

export { HeliumButton };
