import { styles } from './button_styles.ts';
import {LitElement, html } from 'lit';
import {customElement, property } from 'lit/decorators.js';

@customElement('he-button')
export class HeliumButton extends LitElement {
    static get styles() {
        return [
            styles
        ];
    }

    @property({ type: Boolean, reflect: true }) 
    disabled = false;
    @property({ type: Boolean, reflect: true }) 
    loading = false;
    @property({ reflect: true }) 
    submit = null;
    @property({ reflect: true }) 
    href = null;
    @property({ reflect: true }) 
    theme: 'danger'|'warning'|'success'|null = null;
    @property({ reflect: true }) 
    variant: 'primary'|'ghost'|'outline'|null = null;

    render() {
        return html`
            <a ${this.href}>
                <button id="he-button" @click=${() => this._handleClickButton()}>
                    <slot></slot>
                </button>
            </a>
        `;
    }

    setText(newText: string): HeliumButton {
        this.innerHTML = newText;
        return this;
    }

    _handleClickButton() {
        this._submitForm()
    }

    _submitForm() {
        const id = this.submit
        if (id == null) {
            return;
        }
        const $form = document.querySelector<HTMLFormElement>(id);
        if ($form == null) {
            throw new Error(`No form found with ID ${id}`);
        }
        if (!($form instanceof HTMLFormElement)) {
            throw new Error('The element is not a form!');
        }
        $form.submit();
    }
}

