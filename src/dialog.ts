// @ts-ignore
import styles from "./dialog.css";
import { LitElement,  PropertyValues, TemplateResult, html } from 'lit';
import {  property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { HeliumButton } from "./button.ts";
import { HeliumInput } from "./input.ts";
import { unsafeCSS } from 'lit-element';

export type DialogType = 'error' | 'warn' | 'info' | 'success';

/** 
 * A dialog with user filled content.
 * The content is filled using slots.
 *
 * @slot title - The title text  of the dialog
 * @slot body - The body of the dialog. This is also the default slot.
 * @slot footer - The foote of the dialog. This is where buttons are commonly placed.
 *
 * @extends LitElement
 * @element he-dialog
 *
 * @todo Write tests for `showPrompt` and `showConfirm`
 * @todo Finish docs
 */
export class HeliumDialog extends LitElement {
    static get styles() {
        return [
            unsafeCSS(styles),
        ];
    }
    _refs: {
        dialog: Ref<HTMLDialogElement>
    } = {
        dialog: createRef(),
    };

    /**
     * The dialog will open if set.
     * Can also be used to render the dialog already open.
     */
    @property({ type: Boolean })
    open: boolean = false;
    /** 
     * The text in the title of the dialog.
     * This text gets overwritten, if the title slot is used (e.g. `<div slot="title">My Title</div>`)
     */
    @property({ type: String, attribute: 'title-text' })
    titleText: string = '';
    /** 
     * If set, allows the user to close the dialog by clicking outside (on the backdrop)
     */
    //@property({ type: Boolean, attribute: 'outside-close' })
    //outsideClose: boolean = false;

    /**
     * The `resolve` callback of the promise
     */
    _resolve: null | ((value: any) => void) = null;

    constructor() {
        super();
    }

    render(): TemplateResult<1> {
        return html`
            <dialog 
                ${ref(this._refs.dialog)}
                id="he-diag-outer"
            >
                <div id="he-diag-inner">
                    <div id="he-diag-header">
                        <div id="he-title"><slot name="title">${this.titleText}</slot></div>
                        <div id="he-icon-close" @click=${this.close}>
                            <span>X</span>
                        </div>
                    </div>
                    <div id="he-diag-body">
                        <slot></slot>
                        <slot name="body"></slot>
                    </div>
                    <div id="he-diag-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </dialog>
        `;
    }

    protected updated(changed: PropertyValues): void {
        if (changed.has('open')) {
            if (this.open) {
                this._show();
            } else {
                this._close();
            }
        }

        //if (changed.has('outside-close')) {
        //    window.removeEventListener('click', this._handleClickOutsideClose);
        //    window.addEventListener('click', this._handleClickOutsideClose);
        //} else {
        //    window.removeEventListener('click', this._handleClickOutsideClose);
        //}

        super.updated(changed);
    }

    /**
     * Closes the dialog.
     */
    close(): HeliumDialog {
        // We don't want to call `this._close()` directly,
        // because we want to ensure `this.open` is updated.
        this.open = false;
        return this;
    }

    /**
     * Opens the dialog and returns a promise,
     * which is resolved when the dialog closes.
     * The promise always resolves to `null`.
     */
    show(): Promise<void> {
        let promise = new Promise<void>((resolve, _reject) => {
            this._resolve = resolve;
        })

        this.showModal();
        return promise;
    }

    /**
     * Opens the dialog.
     * This is the non-async alternative to `show()`.
     */
    showModal(): HeliumDialog {
        // We don't want to call `this._close()` directly,
        // because we want to ensure `this.open` is updated.
        this.open = true;
        return this;
    }

    _close(): void {
        const $dialog = this._refs.dialog.value;
        if ($dialog == null) {
            return;
        }

        $dialog.close();

        const evt = new CustomEvent('close');
        this.dispatchEvent(evt);


        if (this._resolve instanceof Function) {
            this._resolve(null);
        }
    }

    _handleClickOutsideClose(e: MouseEvent): void {
        const $dialog = this._refs.dialog.value;
        if ($dialog == null) {
            return;
        }
        const rect = $dialog.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog && e.target instanceof HeliumDialog) {
            this.close();
        }
    }

    _show(): void {
        this._refs.dialog.value?.showModal();

        const evt = new CustomEvent('show');
        this.dispatchEvent(evt);
    }

    /**
     * Creates a temporary dialog and shows the content.
     * @param content The body content of the dialog
     * @param type The dialog type changes the title color and text
     * @param title The title of the dialog
     */
    static async showDialog(content: string, type: DialogType, title?: string): Promise<void> {
        return await showDialogTemp(content, type, title);
    }

    /**
     * Creates a temporary prompt dialog and returns the input text as promise.
     * @param text The text shown above the prompt input
     * @param title The title of the dialog
     * @returns The prompt input
     */
    static showPrompt(text: string, title: string = 'Eingabe'): Promise<string> {
        let fnResolve: ((value: string) => void) | null = null;
        let fnReject: ((reason?: any) => void) | null = null;
        let promise = new Promise<string>((resolve, reject) => {
            fnResolve = resolve;
            fnReject = reject;
        });

        let $diag = document.querySelector<HeliumDialog>('#he-dialog-prompt-temp');
        if ($diag == null) {
            $diag = <HeliumDialog>document.createElement('he-dialog');
            $diag.id = 'he-dialog-pompt-temp';
            $diag.titleText = title;

            let $body = document.createElement('div');
            $body.slot = 'body';
            $body.innerHTML = `
                ${text}
                <he-input id="he-dialog-prompt-inp"></he-input>
            `;
            $diag.append($body);

            let $footer = document.createElement('div');
            $footer.slot = 'footer';
            let $btnSubmit = <HeliumButton>document.createElement('he-button');
            $btnSubmit.innerHTML = 'Absenden';
            $btnSubmit.variant = 'primary';
            $btnSubmit.onclick = () => {
                fnResolve!(document.querySelector<HeliumInput>('#he-dialog-prompt-inp')!.value ?? '');
                $diag!.close();
            };

            $footer.append($btnSubmit);
            $diag.append($footer);
            document.body.append($diag);
        }

        $diag.show().then(() => {
            fnReject!();
        });
        return promise;
    }

    /**
     * Creates a temporary confirm dialog and returns the selection as promise.
     * @param text The dialog text
     * @param title The title of the dialog
     */
    static showConfirm(text: string, title = 'Achtung'): Promise<boolean> {
        let fnResolve: ((arg0: boolean) => void) | null = null;
        const prom = new Promise<boolean>((resolve, _) => {
            fnResolve = resolve;
        });

        let $diag = document.querySelector<HeliumDialog>('#he-dialog-confirm-temp');
        if ($diag == null) {
            $diag = <HeliumDialog>document.createElement('he-dialog');
            $diag.id = 'he-dialog-confirm-temp';
            $diag.titleText = title;

            const $body = document.createElement('div');
            $body.slot = 'body';
            $body.innerHTML = text;
            $diag.append($body);

            const $footer = document.createElement('div');
            $footer.slot = 'footer';
            const $btnCancel = document.createElement('he-button');
            $btnCancel.innerHTML = 'Abbrechen';
            $btnCancel.onclick = () => {
                fnResolve!(false);
                $diag!.close();
            };
            const $btnSubmit = <HeliumButton>document.createElement('he-button');
            $btnSubmit.innerHTML = 'Ok';
            $btnSubmit.variant = 'primary';
            $btnSubmit.style = 'margin-left: 7px;';
            $btnSubmit.onclick = () => {
                fnResolve!(true);
                $diag!.close();
            };

            $footer.append($btnCancel);
            $footer.append($btnSubmit);
            $diag.append($footer);
            document.body.append($diag);
        }

        $diag.show().then(() => {
            fnResolve!(false);
        });
        return prom;
    }
}

function showDialogTemp(content: string, type?: DialogType, title?: string): Promise<void> {
    let $diag = document.querySelector<HeliumDialog>('#he-dialog-temp');
    if ($diag == null) {
        $diag = <HeliumDialog>document.createElement('he-dialog');
        $diag.id = 'he-dialog-temp';
        document.body.append($diag);
    }

    switch (type) {
        case 'error':
            title = title ?? 'Fehler';
            $diag.style.setProperty('--he-dialog-title-color', 'indianred');
            break;
        case 'warn':
            title = title ?? 'Warnung';
            $diag.style.setProperty('--he-dialog-title-color', 'orange');
            break;
        case 'success':
            title = title ?? 'Erfolg';
            $diag.style.setProperty('--he-dialog-title-color', 'seagreen');
            break;
        default:
            title = title ?? 'Info';
            $diag.style.removeProperty('--he-dialog-title-color');
            break;
    }
    $diag.titleText = title;

    $diag.innerHTML = `
        <div slot="body">${content}</div>
        <he-button slot="footer" onclick="document.querySelector('#he-dialog-temp').close()">
            Schließen
        </he-button>
    `;
    return $diag.show();
}

if (!customElements.get('he-dialog')) {
    // @ts-ignore
    window.HeliumDialog = HeliumDialog;

    customElements.define("he-dialog", HeliumDialog);

    // @ts-ignore
    document.addEventListener("he-dialog", function(e: CustomEvent) {
        showDialogTemp(e.detail.value);
    })

    // @ts-ignore
    document.addEventListener("he-dialog-error", function(e: CustomEvent) {
        showDialogTemp(e.detail.value, 'error');
    })

    // @ts-ignore
    document.addEventListener("he-dialog-warn", function(e: CustomEvent) {
        showDialogTemp(e.detail.value, 'warn');
    })

    // @ts-ignore
    document.addEventListener("he-dialog-success", function(e: CustomEvent) {
        showDialogTemp(e.detail.value, 'success');
    })
}
