import sheet from './dialog.css';
import { HeliumButton } from "./button.js";

/**
 * Will open the targeted dialog.
 * @event HeliumDialog#he-dialog-show
 * @type {object}
 */

/**
 * Will close the targeted dialog.
 * @event HeliumDialog#he-dialog-close
 * @type {object}
 */

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
 * @extends HTMLElement
 */
export class HeliumDialog extends HTMLElement {
    static observedAttributes = [
        "open",
        "title-text",
    ];
    /** 
     * The underlying dialog element.
     * @type {HTMLDialogElement} 
     */
    $dialog;
    /** 
     * The element holding the title.
     * @type {HTMLDivElement} 
     */
    $title;
    /**
     * The `resolve` callback of the promise
     * @type {(value: any) => void}
     */
    resolve;

    constructor() {
        super();
        let $shadow = this.attachShadow({ mode: "open" });

        $shadow.adoptedStyleSheets = [sheet];
        $shadow.innerHTML = `
            <dialog id="he-diag-outer">
                <div id="he-diag-inner">
                    <div id="he-diag-header">
                        <div id="he-title"></div>
                        <div id="he-icon-close"><span>X</span></div>
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

        let $icon = $shadow.querySelector('#he-icon-close');
        $icon.onclick = () => $shadow.querySelector('#he-diag-outer').close();

        this.$dialog = $shadow.querySelector('#he-diag-outer');
        this.$title = $shadow.querySelector('#he-title');
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        if (name === "open") {
            if (newValue === "true") {
                this.$dialog.showModal();
            } else {
                this.$dialog.close();
            }
        }

        if (name === "title-text") {
            this.$title.innerText = newValue;
        }
    }

    /**
     * Closes the dialog.
     * @return Self
     */
    close() {
        this.$dialog.close();
        return this;
    }

    connectedCallback() {
        this.addEventListener("he-dialog-show", function() {
            this.show();
        })
        this.addEventListener("he-dialog-close", function() {
            this.close();
        })

        this.$dialog.addEventListener('close', (e) => this._handleCloseDialog.bind(this)(e));

        if (this.hasAttribute('outside-close')) {
            this.addEventListener('click', e => {
                let rect = this.$dialog.getBoundingClientRect();
                let isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                    rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
                if (!isInDialog && e.target.tagName === 'HE-DIALOG') {
                    this.close();
                }
            });
        }
    }

    /**
     * Sets the values of all elements within the `body` slot to the provided value. 
     * @param {Object.<string, number|string>} values A mapping from `name` to value
     * @returns {Self}
     */
    fill(values) {
        const $slot = this.$dialog.querySelector('slot[name=body]');
        for (const [name, val] of Object.entries(values)) {
            $slot.assignedElements().forEach((elem) =>
                elem.querySelectorAll(`[name="${name}"]`).forEach(
                    (e) => e.value = val
                )
            );
        }
        return this;
    }

    /**
     * Calls `.reset()` on the body slot, if it is a `form` element.
     * @returns {self}
     */
    reset() {
        const $slot = this.$dialog.querySelector('slot[name=body]');
        $slot.assignedElements().forEach(($elem) => {
            if ($elem.nodeName === "FORM") {
                $elem.reset();
            }
        })
        return this;
    }

    /**
     * Opens the dialog.
     * @returns Promise
     */
    show() {
        this.showModal();
        let promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
        return promise;
    }

    /**
     * Opens the dialog. Alias for `show()`.
     * @returns Self
     */
    showModal() {
        this.$dialog.showModal();
        const evt = new CustomEvent('open');
        this.dispatchEvent(evt);
        return this;
    }

    /**
     * Sets the body of the dialog to the provided value.
     * @param {string} content The new body content
     * @returns Self
     */
    setBody(content) {
        const $slot = this.shadowRoot.querySelector('#he-diag-body slot[name=body]');
        $slot.innerHTML = content;
        return this;
    }

    /**
     * Changes the title of the dialog.
     * @param {string} content The new title
     * @returns {Self}
     */
    setTitle(newTitle) {
        this.setAttribute('title-text', newTitle);
        return this;
    }

    _handleCloseDialog(e) {
        e.stopPropagation();

        const evt = new CustomEvent('close');
        this.dispatchEvent(evt);

        if (this.resolve) {
            this.resolve();
        }
    }

    /**
     * Creates a temporary dialog and shows the content.
     * @param {'error'|'warn'|'info'|'success'} type The dialog type changes the title color and text
     * @param {string} content The body content of the dialog
     * @param {?string} title The title of the dialog
     * @returns {void}
     */
    static showDialog(content, type, title=null) {
        return heShowDialogTemp(content, type, title);
    }

    /**
     * Creates a temporary alert dialog.
     * @param {string} content The body content of the dialog
     * @param {?string} title The title of the dialog
     * @returns {Promise<()>}
     */
    static showAlert(content, title='Achtung') {
        return heShowDialogTemp(content, 'error', title);
    }

    /**
     * Creates a temporary prompt dialog and returns the input text as promise.
     * @param {string} text The text shown above the prompt input
     * @param {?string} title The title of the dialog
     * @returns {Promise<string>} The prompt input
     */
    static showPrompt(text, title='Eingabe') {
        let fnResolve = null;
        let fnReject = null;
        let promise = new Promise((resolve, reject) => {
            fnResolve = resolve;
            fnReject = reject;
        });

        /** @type {HeliumDialog} */
        let $diag = document.querySelector('#he-dialog-prompt-temp');
        if ($diag === null) {
            $diag = document.createElement('he-dialog');
            $diag.id = 'he-dialog-pompt-temp';
            $diag.setAttribute('title-text', title);

            let $body = document.createElement('div');
            $body.slot = 'body';
            $body.innerHTML = `
                ${text}
                <he-input id="he-dialog-prompt-inp"></he-input>
            `;
            $diag.append($body);

            let $footer = document.createElement('div');
            $footer.slot = 'footer';
            /** @type {HeliumButton} */
            let $btnSubmit = document.createElement('he-button');
            $btnSubmit.innerHTML = 'Absenden';
            $btnSubmit.setAttribute('variant', 'primary');
            $btnSubmit.onclick = () => {
                fnResolve(document.querySelector('#he-dialog-prompt-inp').value);
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
     * @param {string} text The dialog text
     * @param {?string} title The title of the dialog
     * @returns {Promise<bool>}
     */
    static showConfirm(text, title='Achtung') {
        let fnResolve = null;
        let prom = new Promise((resolve, _) => {
            fnResolve = resolve;
        });

        /** @type {HeliumDialog} */
        let $diag = document.querySelector('#he-dialog-confirm-temp');
        if ($diag === null) {
            $diag = document.createElement('he-dialog');
            $diag.id = 'he-dialog-confirm-temp';
            $diag.setAttribute('title-text', title);

            let $body = document.createElement('div');
            $body.slot = 'body';
            $body.innerHTML = text;
            $diag.append($body);

            let $footer = document.createElement('div');
            $footer.slot = 'footer';
            let $btnCancel= document.createElement('he-button');
            $btnCancel.innerHTML = 'Abbrechen';
            $btnCancel.onclick = () => {
                fnResolve(false);
                $diag.close();
            };
            let $btnSubmit = document.createElement('he-button');
            $btnSubmit.innerHTML = 'Ok';
            $btnSubmit.setAttribute('variant', 'primary');
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

function heShowDialogTemp(content, type, title=null) {
    /** @type {HeliumDialog} */
    let $diag = document.querySelector('#he-dialog-temp');
    if ($diag === null) {
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
    $diag.setAttribute('title-text', title);

    $diag.innerHTML = `
        <div slot="body">${content}</div>
        <he-button slot="footer" onclick="document.querySelector('#he-dialog-temp').close()">
            Schließen
        </he-button>
    `;
    return $diag.show();
}

if (!customElements.get('he-dialog')) {
    window.heShowDialogTemp = heShowDialogTemp;
    window.HeliumDialog = HeliumDialog;

    customElements.define("he-dialog", HeliumDialog);

    document.addEventListener("he-dialog", function(e) {
        heShowDialogTemp(e.detail.value);
    })

    document.addEventListener("he-dialog-error", function(e) {
        heShowDialogTemp(e.detail.value, 'error');
    })

    document.addEventListener("he-dialog-warn", function(e) {
        heShowDialogTemp(e.detail.value, 'warn');
    })

    document.addEventListener("he-dialog-success", function(e) {
        heShowDialogTemp(e.detail.value, 'success');
    })
}
