import { _ as __decorate, i, r, b } from './lit-element-C9ed7Kq3.js';
import { n } from './property-BCLoIpyb.js';
import { e, n as n$1 } from './ref-C9xuETNn.js';

var styles = "#he-diag-outer {\n    outline: none;\n    padding: 0;\n    border-radius: 4px;\n    border: 0;\n    box-shadow:0 5px 10px 0 #80808054;\n    animation: fadeout 0.1s ease-in forwards;\n}\n\n#he-diag-outer[open] {\n  animation: fadein 0.1s ease-in forwards;\n}\n\n#he-diag-outer[open]::backdrop {\n    transition: opacity 0.2s;\n    background-color: black;\n    opacity: 0.2;\n}\n\n#he-icon-close {\n    font-weight: 900;\n    width: 35px;\n    aspect-ratio: 1;\n    height: fit-content;\n    text-align: center;\n    cursor: pointer;\n    border-radius: 50%;\n    font-family: cursive;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n#he-icon-close:hover {\n    transition:\n        background-color 0.2s;\n    background-color: whitesmoke;\n}\n\n#he-diag-inner {\n    min-height: 100px;\n    min-width: 200px;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}\n\n#he-diag-body {\n    padding: 10px 15px;\n}\n\n#he-diag-header {\n    display: flex;\n    justify-content: space-between;\n    gap: 10px;\n    padding: 10px 15px;\n}\n\n#he-diag-footer {\n    display: flex;\n    justify-content: flex-end;\n    padding: 15px;\n    gap: 5px;\n}\n\n#he-title {\n    display: flex;\n    font-weight: 500;\n    font-size: 1.5rem;\n    align-items: center;\n    color: var(--he-dialog-title-color);\n}\n\n#he-diag-footer input[type=button] {\n    border-radius: 3px;\n    color: black;\n    height: 35px;\n    padding: 0px 10px;\n    vertical-align: middle;\n    text-align: center;\n    border: 1px solid rgba(0, 0, 0, 0.2235294118);\n    font-size: 14px;\n    background-color: white;\n    outline-style: none;\n    box-shadow: none !important;\n    width: auto;\n    visibility: collapse;\n\n    &[disabled] {\n        background-color: #d9d9d9;\n        color: #666666;\n        cursor: no-drop;\n        text-shadow: none;\n    }\n\n    &:hover:enabled, &:active:enabled, &:focus:enabled {\n        cursor: pointer;\n        text-shadow: 0px 0px 0.3px #0082b4;\n        border-color: #0082b4;\n        color: #0082b4;\n    }\n\n    &:hover:enabled{\n        background-color: #0082b40d;\n    }\n}\n\n@keyframes fadein{\n    0%{\n        opacity:0;\n    }\n    100%{\n        opacity:1;\n    }\n}\n\n@keyframes fadeout{\n    0%{\n        opacity:1;\n    }\n    100%{\n        opacity:0;\n    }\n}\n";

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
class HeliumDialog extends i {
    static get styles() {
        return [
            r(styles),
        ];
    }
    constructor() {
        super();
        this._refs = {
            dialog: e(),
        };
        /**
         * The dialog will open if set.
         * Can also be used to render the dialog already open.
         */
        this.open = false;
        /**
         * The text in the title of the dialog.
         * This text gets overwritten, if the title slot is used (e.g. `<div slot="title">My Title</div>`)
         */
        this.titleText = '';
        /**
         * If set, allows the user to close the dialog by clicking outside (on the backdrop)
         */
        this.outsideClose = false;
        /**
         * The `resolve` callback of the promise
         */
        this._resolve = null;
    }
    render() {
        return b `
            <dialog 
                ${n$1(this._refs.dialog)}
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
    updated(changed) {
        if (changed.has('open')) {
            if (this.open) {
                this._show();
            }
            else {
                this._close();
            }
        }
        if (changed.has('outside-close')) {
            window.removeEventListener('click', this._handleClickOutsideClose);
            window.addEventListener('click', this._handleClickOutsideClose);
        }
        else {
            window.removeEventListener('click', this._handleClickOutsideClose);
        }
        super.updated(changed);
    }
    /**
     * Closes the dialog.
     */
    close() {
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
    show() {
        let promise = new Promise((resolve, _reject) => {
            this._resolve = resolve;
        });
        this.showModal();
        return promise;
    }
    /**
     * Opens the dialog.
     * This is the non-async alternative to `show()`.
     */
    showModal() {
        // We don't want to call `this._close()` directly,
        // because we want to ensure `this.open` is updated.
        this.open = true;
        return this;
    }
    _close() {
        const $dialog = this._refDialog.value;
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
    _handleClickOutsideClose(e) {
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
    _show() {
        this._refDialog.value?.showModal();
        const evt = new CustomEvent('show');
        this.dispatchEvent(evt);
    }
    /**
     * Creates a temporary dialog and shows the content.
     * @param content The body content of the dialog
     * @param type The dialog type changes the title color and text
     * @param title The title of the dialog
     */
    static async showDialog(content, type, title) {
        return await showDialogTemp(content, type, title);
    }
    /**
     * Creates a temporary prompt dialog and returns the input text as promise.
     * @param text The text shown above the prompt input
     * @param title The title of the dialog
     * @returns The prompt input
     */
    static showPrompt(text, title = 'Eingabe') {
        let fnResolve = null;
        let fnReject = null;
        let promise = new Promise((resolve, reject) => {
            fnResolve = resolve;
            fnReject = reject;
        });
        let $diag = document.querySelector('#he-dialog-prompt-temp');
        if ($diag == null) {
            $diag = document.createElement('he-dialog');
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
            let $btnSubmit = document.createElement('he-button');
            $btnSubmit.innerHTML = 'Absenden';
            $btnSubmit.variant = 'primary';
            $btnSubmit.onclick = () => {
                fnResolve(document.querySelector('#he-dialog-prompt-inp').value ?? '');
                $diag.close();
            };
            $footer.append($btnSubmit);
            $diag.append($footer);
            document.body.append($diag);
        }
        $diag.show().then(() => {
            fnReject();
        });
        return promise;
    }
    /**
     * Creates a temporary confirm dialog and returns the selection as promise.
     * @param text The dialog text
     * @param title The title of the dialog
     */
    static showConfirm(text, title = 'Achtung') {
        let fnResolve = null;
        const prom = new Promise((resolve, _) => {
            fnResolve = resolve;
        });
        let $diag = document.querySelector('#he-dialog-confirm-temp');
        if ($diag == null) {
            $diag = document.createElement('he-dialog');
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
                fnResolve(false);
                $diag.close();
            };
            const $btnSubmit = document.createElement('he-button');
            $btnSubmit.innerHTML = 'Ok';
            $btnSubmit.variant = 'primary';
            $btnSubmit.style = 'margin-left: 7px;';
            $btnSubmit.onclick = () => {
                fnResolve(true);
                $diag.close();
            };
            $footer.append($btnCancel);
            $footer.append($btnSubmit);
            $diag.append($footer);
            document.body.append($diag);
        }
        $diag.show().then(() => {
            fnResolve(false);
        });
        return prom;
    }
}
__decorate([
    n({ type: Boolean })
], HeliumDialog.prototype, "open", void 0);
__decorate([
    n({ type: String, attribute: 'title-text' })
], HeliumDialog.prototype, "titleText", void 0);
__decorate([
    n({ type: Boolean, attribute: 'outside-close' })
], HeliumDialog.prototype, "outsideClose", void 0);
function showDialogTemp(content, type, title) {
    let $diag = document.querySelector('#he-dialog-temp');
    if ($diag == null) {
        $diag = document.createElement('he-dialog');
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
    document.addEventListener("he-dialog", function (e) {
        showDialogTemp(e.detail.value);
    });
    // @ts-ignore
    document.addEventListener("he-dialog-error", function (e) {
        showDialogTemp(e.detail.value, 'error');
    });
    // @ts-ignore
    document.addEventListener("he-dialog-warn", function (e) {
        showDialogTemp(e.detail.value, 'warn');
    });
    // @ts-ignore
    document.addEventListener("he-dialog-success", function (e) {
        showDialogTemp(e.detail.value, 'success');
    });
}

export { HeliumDialog };
