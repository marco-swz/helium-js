// @ts-ignore
import styles from "./button.css";
import { LitElement, TemplateResult, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeCSS } from 'lit-element';

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
 *
 * @tag he-button
 */
@customElement('he-button')
export class HeliumButton extends LitElement {
    static get styles() {
        return [
            unsafeCSS(styles),
        ];
    }

    /**
     * Disables the button if set. 
     * Clicks will no longer fire events.
     */
    @property({ type: Boolean, reflect: true })
    disabled: boolean = false;
    /**
     * Sets the `loading` state the button.
     * It shows a loading animation and disables inputs.
     */
    @property({ type: Boolean, reflect: true })
    loading: boolean = false;
    /**
     * This property can be used to assign a link to the button.
     * If it is clicked, the link is opened.
     */
    @property({ type: String, reflect: true, useDefault: true})
    href: string = '';
    /**
     * Sets the (color) theme of the button.
     */
    @property({ reflect: true })
    theme: 'danger' | 'warning' | 'success' | null = null;
    /**
     * Sets the style variant of the button.
     * @default 'outline'
     */
    @property({ reflect: true })
    variant: 'primary' | 'ghost' | 'outline' | null = null;

    /**
     * Lit render function.
     * @internal
     */
    render(): TemplateResult<1> {
        return html`
            <a href=${this.href || nothing}>
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
    _handleClickButton(): void {
    }
}

