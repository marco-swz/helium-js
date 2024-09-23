import { s as scss } from './utils-B65AITo8.js';

//import sheet from './dialog.css' assert { type: "css" };

class HeliumDialog extends HTMLElement {
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

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
#he-diag-outer {
    outline: none;
    padding: 0;
    border-radius: 3px;
    border: 0;
}

#he-icon-close {
    font-weight: 900;
    width: 20px;
    text-align: center;
    cursor: pointer;
    padding: 0.15rem;
    border-radius: 50%;
    font-family: cursive;
}

#he-diag-inner {
    min-height: 100px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#he-diag-body {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
}

#he-diag-header {
    display: flex;
    justify-content: space-between;
    background-color: var(--he-dialog-clr-title, #0082b4);
    color: var(--he-dialog-clr-title-text, white);
    padding: 3px 10px;
}

#he-diag-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    gap: 5px;
}

#he-title {
    display: flex;
    font-weight: 500;
    align-items: center;
}

#he-diag-footer input[type=button] {
    border-radius: 3px;
    color: black;
    height: 35px;
    padding: 0px 10px;
    vertical-align: middle;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2235294118);
    font-size: 14px;
    background-color: white;
    outline-style: none;
    box-shadow: none !important;
    width: auto;
    visibility: collapse;

    &[disabled] {
        background-color: #d9d9d9;
        color: #666666;
        cursor: no-drop;
        text-shadow: none;
    }

    &:hover:enabled, &:active:enabled, &:focus:enabled {
        cursor: pointer;
        text-shadow: 0px 0px 0.3px #0082b4;
        border-color: var(--he-color-accent, #0082b4);
        color: var(--he-color-accent, #0082b4);
    }

    &:hover:enabled{
        background-color: #0082b40d;
    }
}
        `);

        shadow.adoptedStyleSheets = [sheet];
        shadow.innerHTML = `
            <dialog id="he-diag-outer">
                <div id="he-diag-inner">
                    <div id="he-diag-header">
                        <div id="he-title"></div>
                        <div id="he-icon-close">X</div>
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
                this.dialog.showModal();
            } else {
                this.dialog.close();
            }
        }

        if (name === "he-title") {
            this.title.innerText = newValue;
        }

        if (name === "lose-button") {
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

export { HeliumDialog };
