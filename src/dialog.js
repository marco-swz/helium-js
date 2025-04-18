import sheet from './dialog.css';

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

    static showDialog(content, type) {
        heShowDialogTemp(content, type);
    }
}

function heShowDialogTemp(content, type) {
    /** @type {HeliumDialog} */
    let $diag = document.querySelector('#he-dialog-temp');
    if ($diag === null) {
        $diag = document.createElement('he-dialog');
        $diag.id = 'he-dialog-temp';
        switch (type) {
            case 'error':
                $diag.style.setProperty('--he-dialog-clr-title', 'indianred');
                $diag.setAttribute('title-text', 'Fehler');
                break;
            case 'warn':
                $diag.style.setProperty('--he-dialog-clr-title', 'orange');
                $diag.setAttribute('title-text', 'Warnung');
                break;
            case 'success':
                $diag.style.setProperty('--he-dialog-clr-title', 'seagreen');
                $diag.setAttribute('title-text', 'Erfolg');
                break;
            default:
                $diag.style.removeProperty('--he-dialog-clr-title');
                $diag.setAttribute('title-text', 'Info');
                break;
        }
        document.body.append($diag);
    }

    $diag.innerHTML = `
        <div slot="body">${content}</div>
        <he-button slot="footer" onclick="document.querySelector('#he-dialog-temp').close()">
            Schließen
        </he-button>
    `;
    $diag.show();
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
