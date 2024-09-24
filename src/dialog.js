import sheet from './dialog.css';

export class HeliumDialog extends HTMLElement {
    static observedAttributes = [
        "open",
        "he-title",
        "close-icon",
        "close-button",
    ];
    /** @type {HTMLDialogElement} */
    dialog;
    /** @type {HTMLDivElement} */
    title;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        shadow.adoptedStyleSheets = [sheet];
        shadow.innerHTML = `
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

        let body = shadow.querySelector('#he-diag-body');
        body.append(...this.children);

        let icon = shadow.querySelector('#he-icon-close');
        icon.onclick = () => shadow.querySelector('#he-diag-outer').close();

        this.dialog = shadow.querySelector('#he-diag-outer');
        this.title = shadow.querySelector('#he-title');
    }

    connectedCallback() {
        this.addEventListener("he-dialog-show", function() {
            this.show();
        })
        this.addEventListener("he-dialog-close", function() {
            this.close();
        })
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
                this.dialog.showModal();
            } else {
                this.dialog.close();
            }
        }

        if (name === "he-title") {
            this.title.innerText = newValue;
        }

        if (name === "close-button") {
            if (newValue === "true") {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'visible';
                this.shadowRoot.querySelector('#he-diag-footer').style.visibility = 'visible';
            } else {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'collapse';
                this.shadowRoot.querySelector('#he-diag-footer').style.visibility = 'collapse';
            }
        }

        if (name === "close-icon") {
            if (newValue === "true") {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'visible';
            } else {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'collapse';
            }
        }
    }

    /**
     * Opens the dialog.
     * @returns Self
     */
    show() {
        this.dialog.showModal();
        return this;
    }

    /**
     * Opens the dialog. Alias for `show()`.
     * @returns Self
     */
    showModal() {
        this.dialog.showModal();
        return this;
    }

    /**
     * Closes the dialog.
     * @return Self
     */
    close() {
        this.dialog.close();
        return this;
    }

    /**
     * Sets the body of the dialog to the provided value.
     * @param {string} content The new body content
     * @returns Self
     */
    setBody(content) {
        const slot = this.shadowRoot.querySelector('#he-diag-body slot[name=body]');
        slot.innerHTML = content;
        return this;
    }
}

function showDialogTemp(evt, type) {
    /** @type {HeliumDialog} */
    let diag = document.querySelector('#he-dialog-temp');
    if (diag === null) {
        diag = document.createElement('he-dialog');
        diag.id = 'he-dialog-temp';
        switch (type) {
            case 'error':
                diag.style.setProperty('--he-dialog-clr-title', 'indianred');
                diag.setAttribute('title', 'Fehler');
                break;
            case 'warn':
                diag.style.setProperty('--he-dialog-clr-title', 'orange');
                diag.setAttribute('title', 'Warnung');
                break;
            case 'success':
                diag.style.setProperty('--he-dialog-clr-title', 'seagreen');
                diag.setAttribute('title', 'Erfolg');
                break;
            default:
                diag.style.removeProperty('--he-dialog-clr-title');
                diag.removeAttribute('title');
                break;
        }
        document.body.append(diag);
    }

    if (evt.detail && evt.detail.value) {
        diag.setBody(evt.detail.value);
    }
    diag.show();
}

customElements.define("he-dialog", HeliumDialog);

document.addEventListener("he-dialog", function(e) {
    showDialogTemp(e);
})

document.addEventListener("he-dialog-error", function(e) {
    showDialogTemp(e, 'error');
})

document.addEventListener("he-dialog-warn", function(e) {
    showDialogTemp(e, 'warn');
})

document.addEventListener("he-dialog-success", function(e) {
    showDialogTemp(e, 'success');
})
