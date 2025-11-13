import { styles } from './dialog_styles.ts';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { HeliumButton } from "./button.ts";
import { HeliumInput } from "./input.ts";

export type DialogType = 'error' | 'warn' | 'info' | 'success';

/** A dialog with no content.
 * The content is filled using slots.
 * 
 * @element he-dialog
 *
 * @attr {on|off} open - If set, the dialog is open (will open if not)
 * @attr title-text - The text in the title of the dialog
 * @attr {on|off} hide-close-icon - If set, hides the close icon in the top-right corner
 * @attr {on|off} outside-close - If set, allows the user to close the dialog by clicking outside (on the backdrop)
 *
 * @slot body - The body of the dialog
 * @slot footer - The foote of the dialog. This is where buttons are commonly placed.
 *
 * @listens HeliumDialog#he-dialog-show - Shows the dialog
 * @listens HeliumDialog#he-dialog-close - Closes the dialog
 *
 * @extends LitElement
 */
export class HeliumDialog extends LitElement {
    static get styles() {
        return [
            styles
        ];
    }
    static observedAttributes = [
        "open",
    ];

    _refDialog: Ref<HTMLDialogElement> = createRef();

    @property({ reflect: true, type: Boolean })
    open = false;
    @property({ reflect: true, type: String, attribute: 'title-text' })
    titleText: string = '';
    @property({ reflect: true, type: Boolean, attribute: 'outside-close' })
    outsideClose = false;

    /**
     * The `resolve` callback of the promise
     */
    _resolve: null | ((value: any) => void) = null;

    constructor() {
        super();
    }

    render() {
        return html`
            <dialog 
                id="he-diag-outer"
                ${ref(this._refDialog)}
                @close=${(e: CloseEvent) => this._handleCloseDialog.bind(this)(e)}
                ${this.outsideClose
                ? html`@close=${(e: MouseEvent) => this._handleClickOutsideClose.bind(this)(e)}`
                : nothing
            }
            >
                <div id="he-diag-inner">
                    <div id="he-diag-header">
                        <div id="he-title"><slot name="title">${this.titleText}</slot></div>
                        <div id="he-icon-close" @click=${this.close()}>
                            <span>X</span>
                        </div>
                    </div>
                    <div id="he-diag-body">
                        <slot name="body"></slot>
                    </div>
                    <div id="he-diag-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </dialog>
        `;
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        if (name === "open") {
            const $dialog = this._refDialog.value;
            if ($dialog == null) {
                return;
            }
            if (newValue === "true") {
                $dialog.showModal();
            } else {
                $dialog.close();
            }
        }
    }

    /**
     * Closes the dialog.
     */
    close(): HeliumDialog {
        const $dialog = this._refDialog.value;
        if ($dialog == null) {
            return this;
        }
        $dialog.close();
        return this;
    }

    /**
     * Sets the values of all elements within the `body` slot to the provided value. 
     * @param values A mapping from `name` to value
     */
    fill(values: { [k: string]: number | string }): HeliumDialog {
        const $dialog = this._refDialog.value;
        if ($dialog == null) {
            return this;
        }

        const $slot = $dialog.querySelector<HTMLSlotElement>('slot[name=body]');
        if ($slot == null) {
            return this;
        }

        for (const [name, val] of Object.entries(values)) {
            $slot.assignedElements().forEach(($elem) =>
                $elem.querySelectorAll(`[name="${name}"]`).forEach(($el) => {
                    if ($el instanceof HTMLInputElement) {
                        $el.value = String(val)
                    }
                })
            );
        }
        return this;
    }

    /**
     * Calls `.reset()` on the body slot, if it is a `form` element.
     */
    reset(): HeliumDialog {
        const $dialog = this._refDialog.value;
        if ($dialog == null) {
            return this;
        }

        const $slot = $dialog.querySelector<HTMLSlotElement>('slot[name=body]');
        if ($slot == null) {
            return this;
        }

        $slot.assignedElements().forEach(($elem) => {
            if ($elem instanceof HTMLFormElement) {
                $elem.reset();
            }
        })
        return this;
    }

    /**
     * Opens the dialog.
     */
    show(): Promise<void> {
        this.showModal();
        let promise = new Promise<void>((resolve, _reject) => {
            this._resolve = resolve;
        })
        return promise;
    }

    /**
     * Opens the dialog. Alias for `show()`.
     */
    showModal(): HeliumDialog {
        this._refDialog.value?.showModal();
        const evt = new CustomEvent('open');
        this.dispatchEvent(evt);
        return this;
    }

    /**
     * Sets the body of the dialog to the provided value.
     * @param content The new body content
     */
    setBody(content: string): HeliumDialog {
        let $body = this.querySelector('[name=body]');
        if ($body == null) {
            $body = document.createElement('div');
            $body.slot = 'body';
            this.append($body);
        }
        $body.innerHTML = content;
        return this;
    }

    /**
     * Changes the title of the dialog.
     * @param newTitle The new title
     */
    setTitle(newTitle: string): HeliumDialog {
        let $title = this.querySelector('[name=body]');
        if ($title == null) {
            $title = document.createElement('div');
            $title.slot = 'title';
            this.append($title);
        }
        $title.innerHTML = newTitle;
        return this;
    }

    _handleCloseDialog(e: CloseEvent) {
        e.stopPropagation();

        const evt = new CustomEvent('close');
        this.dispatchEvent(evt);

        if (this._resolve instanceof Function) {
            this._resolve(null);
        }
    }

    _handleClickOutsideClose(e: MouseEvent) {
        const $dialog = this._refDialog.value;
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
     * Creates a temporary alert dialog.
     * @param content The body content of the dialog
     * @param title The title of the dialog
     */
    static async showAlert(content: string, title = 'Achtung'): Promise<void> {
        return await showDialogTemp(content, 'error', title);
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
