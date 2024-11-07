const sheet = new CSSStyleSheet();sheet.replaceSync("#he-diag-outer {\n    outline: none;\n    padding: 0;\n    border-radius: 3px;\n    border: 0;\n    box-shadow:0 5px 10px 0 #80808054;\n}\n\n#he-icon-close {\n    font-weight: 900;\n    width: 30px;\n    aspect-ratio: 1;\n    height: fit-content;\n    text-align: center;\n    cursor: pointer;\n    border-radius: 50%;\n    font-family: cursive;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n#he-icon-close:hover {\n    background-color: whitesmoke;\n}\n\n#he-diag-inner {\n    min-height: 100px;\n    min-width: 200px;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n}\n\n#he-diag-body {\n    padding-left: 10px;\n    padding-right: 10px;\n    padding-top: 10px;\n}\n\n#he-diag-header {\n    display: flex;\n    justify-content: space-between;\n    padding: 3px 15px;\n    padding-top: 10px;\n}\n\n#he-diag-footer {\n    display: flex;\n    justify-content: flex-end;\n    padding: 10px;\n    gap: 5px;\n}\n\n#he-title {\n    display: flex;\n    font-weight: 500;\n    font-size: 1.5rem;\n    align-items: center;\n}\n\n#he-diag-footer input[type=button] {\n    border-radius: 3px;\n    color: black;\n    height: 35px;\n    padding: 0px 10px;\n    vertical-align: middle;\n    text-align: center;\n    border: 1px solid rgba(0, 0, 0, 0.2235294118);\n    font-size: 14px;\n    background-color: white;\n    outline-style: none;\n    box-shadow: none !important;\n    width: auto;\n    visibility: collapse;\n\n    &[disabled] {\n        background-color: #d9d9d9;\n        color: #666666;\n        cursor: no-drop;\n        text-shadow: none;\n    }\n\n    &:hover:enabled, &:active:enabled, &:focus:enabled {\n        cursor: pointer;\n        text-shadow: 0px 0px 0.3px #0082b4;\n        border-color: #0082b4;\n        color: #0082b4;\n    }\n\n    &:hover:enabled{\n        background-color: #0082b40d;\n    }\n}\n");

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
 * @attr {on|off} show-close-button - If set, shows a button in the footer to close the dialog
 *
 * @slot body - The body of the dialog
 * @slot footer - The foote of the dialog. This is where buttons are commonly placed.
 *
 * @listens HeliumDialog#he-dialog-show - Shows the dialog
 * @listens HeliumDialog#he-dialog-close - Closes the dialog
 *
 * @extends HTMLElement
 */
class HeliumDialog extends HTMLElement {
    static observedAttributes = [
        "open",
        "title-text",
        "hide-close-icon",
        "show-close-button",
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

    connectedCallback() {
        this.addEventListener("he-dialog-show", function() {
            this.show();
        });
        this.addEventListener("he-dialog-close", function() {
            this.close();
        });
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

        if (name === "show-close-button") {
            if (newValue != null) {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'visible';
                this.shadowRoot.querySelector('#he-diag-footer').style.visibility = 'visible';
            } else {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'collapse';
                this.shadowRoot.querySelector('#he-diag-footer').style.visibility = 'collapse';
            }
        }

        if (name === "hide-close-icon") {
            if (newValue != null) {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'collapse';
            } else {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'visible';
            }
        }
    }

    /**
     * Opens the dialog.
     * @returns Self
     */
    show() {
        this.$dialog.showModal();
        return this;
    }

    /**
     * Opens the dialog. Alias for `show()`.
     * @returns Self
     */
    showModal() {
        this.$dialog.showModal();
        return this;
    }

    /**
     * Closes the dialog.
     * @return Self
     */
    close() {
        this.$dialog.close();
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
}

function showDialogTemp(evt, type) {
    /** @type {HeliumDialog} */
    let $diag = document.querySelector('#he-dialog-temp');
    if ($diag === null) {
        $diag = document.createElement('he-dialog');
        $diag.id = 'he-dialog-temp';
        switch (type) {
            case 'error':
                $diag.style.setProperty('--he-dialog-clr-title', 'indianred');
                $diag.setAttribute('title', 'Fehler');
                break;
            case 'warn':
                $diag.style.setProperty('--he-dialog-clr-title', 'orange');
                $diag.setAttribute('title', 'Warnung');
                break;
            case 'success':
                $diag.style.setProperty('--he-dialog-clr-title', 'seagreen');
                $diag.setAttribute('title', 'Erfolg');
                break;
            default:
                $diag.style.removeProperty('--he-dialog-clr-title');
                $diag.removeAttribute('title');
                break;
        }
        document.body.append($diag);
    }

    if (evt.detail && evt.detail.value) {
        $diag.setBody(evt.detail.value);
    }
    $diag.show();
}

if (!customElements.get('he-dialog')) {
    customElements.define("he-dialog", HeliumDialog);

    document.addEventListener("he-dialog", function(e) {
        showDialogTemp(e);
    });

    document.addEventListener("he-dialog-error", function(e) {
        showDialogTemp(e, 'error');
    });

    document.addEventListener("he-dialog-warn", function(e) {
        showDialogTemp(e, 'warn');
    });

    document.addEventListener("he-dialog-success", function(e) {
        showDialogTemp(e, 'success');
    });
}

export { HeliumDialog };
