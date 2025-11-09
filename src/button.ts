import { styles } from './button_styles.ts';
import {LitElement, html } from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

@customElement('he-button')
export class HeliumButton extends LitElement {
    static get styles() {
        return [
            styles
        ];
    }

    @property() 
    disabled = false;
    @property() 
    loading = false;
    @property() 
    submit = null;
    @property() 
    href = null;
    //@property() 
    //theme: 'danger'|'warning'|'success'|null = null;
    //@property() 
    //variant: 'primary'|'ghost'|'outline' = 'outline';
    @state() 
    private _text = '';


    render() {
        return html`
            <a .href=${this.href}>
                <button id="he-button" @click=${() => this._handleClickButton()}>
                    ${this._text}
                </button>
            </a>
        `;
    }

    setText(newText: string): HeliumButton {
        this._text = newText;
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

