function scss(text) {
    return text;
}

function html(text) {
    return text;
}

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

/**
 * Returns the amount of pixels between the element and
 * the bottom of the screen.
 * @param {HTMLElement} element
 * @returns number
 */
function heSpaceBelow(element) {
    const elementRect = element.getBoundingClientRect();
    const spaceBelow = window.innerHeight - elementRect.bottom;
    return spaceBelow;
}

/**
 * 
 * @param {HTMLElement} elem
 * @param {HTMLElement} target
 * @param {string} position
 * @param {number} offset
 * @returns void
 */
function hePositionRelative(elem, target, position, offset=0) {
    const rect = target.getBoundingClientRect();

    switch (position) {
        case 'bottom-right':
            elem.style.left = rect.left + 'px';
            elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'top-right':
            elem.style.top = '';
            elem.style.left = rect.left + 'px';
            elem.style.top = rect.top - elem.offsetHeight - offset + 'px';
            break;
        default:
            throw new Error('Invalid position');
    }
}

function heDisableBodyScroll() {
    const width = window.innerWidth - document.body.offsetWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = width + 'px';
}

function heEnableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
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

function showToastTemp(evt, type) {
    /** @type {HeliumToast} */
    let $toast = document.querySelector('#he-toast-temp');
    if ($toast === null) {
        $toast = document.createElement('he-toast');
        $toast.id = 'he-toast-temp';
        $toast.setAttribute('position', 'top-right');
        document.body.append($toast);
    }

    $toast.showToast(evt.detail.value, type);
}


class HeliumDialog extends HTMLElement {
    static observedAttributes = [
        "open",
        "title",
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

        if (name === "title") {
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

class HeliumTabs extends HTMLElement {
    static observedAttributes = [
        "tab",
    ];
    /** @type {HTMLElement} */
    navBar;
    /** @type {Number} The index of the currently visible tab */
    tabNrVisible;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        let sheet = new CSSStyleSheet();

        sheet.replaceSync(scss`
            #he-tabs-nav {
                display: flex;
            }

            #he-tabs-nav label {
                padding: 0.5rem 1rem;
                cursor: pointer;
                color: gray;
                border: 1px solid lightgray;
                border-bottom: 0;
                border-top-right-radius: 3px;
                border-top-left-radius: 3px;
                background-color: whitesmoke;
            }

            #he-tabs-nav label:has(:checked) {
                color: black;
                background-color: white;
                border-bottom: 1px solid white;
                margin-bottom: -1px;
            }

            #he-tabs-nav label:hover {
                background-color: #0082b40d;
            }
        `);

        shadow.adoptedStyleSheets = [sheet];
        shadow.innerHTML = `
            <nav id="he-tabs-nav">
            </nav>
            <div id="he-tabs-content">
                <slot name="tab"/>
            </div>
        `;

        this.navBar = shadow.querySelector('#he-tabs-nav');
        shadow.addEventListener('slotchange', e => this.slotChangeCallback(e, this));
    }

    connectedCallback() {
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'tab':
                this.showTab(Number(newValue));
                break;
        }
    }

    /**
     * Callback for slot changes.
     * Rebuilds the tabs and shows the correct content.
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    slotChangeCallback(event, self) {
        /** @type {HTMLSlotElement} */
        const slot = event.target;
        self.navBar.innerHTML = '';
        let tabNr = 0;

        for (const elem of slot.assignedElements()) {
            const tabTitle = elem.getAttribute('title') ?? `Tab ${tabNr}`;

            const checkId = 'he-tabs-check' + tabNr;
            /** @type {HTMLLabelElement} */
            let label = document.createElement('label');
            label.for = checkId;

            /** @type {HTMLInputElement} */
            let check = document.createElement('input');
            check.id = checkId;
            check.type = 'radio';
            check.name = 'he-tabs-idx';
            check.value = tabNr;
            check.setAttribute('hidden', 'true');
            check.onchange = e => self.tabChangeCallback(e);

            if (tabNr > 0) {
                elem.style.display = 'none';
            }

            /** @type {HTMLSpanElement} */
            let span = document.createElement('span');
            span.innerHTML = tabTitle;

            label.append(check);
            label.append(span);
            self.navBar.append(label);

            tabNr++;
        }

        self.showTab(self.getAttribute('tab') ?? 0);
    }

    /**
     * Callback for changes of the tab bar.
     * Hides the old content and shows the new.
     * @param {Event} e
     */
    tabChangeCallback(e) {
        /** @type {HTMLInputElement} */
        const check = e.target;
        const tabNrNew = Number(check.value);
        const contentOld = this.children.item(this.tabNrVisible);
        contentOld.style.display = 'none';

        const contentNew = this.children.item(tabNrNew);
        contentNew.style.display = '';

        this.tabNrVisible = tabNrNew;
    }

    /**
     * Shows the tab with the provided index.
     * @param {Number} tabNr The index of the tab
     */
    showTab(tabNr) {
        const id = '#he-tabs-check' + tabNr;
        /** @type {HTMLInputElement} */
        let check = this.navBar.querySelector(id);
        if (check !== null) {
            check.click();
        }
    }
}

class HeliumSelect2 extends HTMLElement {
    static observedAttributes = [
        "allowClear",
        "amdLanguageBase",
        "closeOnSelect",
        "debug",
        "dir",
        "disabled",
        "dropdownAutoWidth",
        "dropdownCssClass",
        "dropdownParent",
        "language",
        "maximumInputLength",
        "maximumSelectionLength",
        "minimumInputLength",
        "minimumResultsForSearch",
        "multiple",
        "placeholder",
        "selectionCssClass",
        "selectOnClose",
        "tags",
        "theme",
        "width",
        "scrollAfterSelect",
    ];
    /** @type {{[x: string]: string}} */
    attrVals = {};
    /** @type {jQuery} */
    select2;
    /** @type {HTMLSelectElement} */
    select;

    constructor() {
        super();
        this.select = document.createElement('select');
        this.select.append(...this.childNodes);
        this.append(this.select)
        this.attrVals['dropdownParent'] = $(this);
    }

    connectedCallback() {
        this.select2 = $(this.select).select2(
            this.attrVals
        );
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        this.attrVals[name] = newValue;
    }
}

class HeliumHelp extends HTMLElement {
    static observedAttributes = [
        'title,'
    ];

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            #he-help-btn {
                display: inline-block;
                width: 1.2rem;
                height: 1.2rem;
                text-align: center;
                vertical-align: middle;
                font-weight: 900;
                border-radius: 50%;
                cursor: help;
            }
        `);

        let button = document.createElement('div');
        button.id = 'he-help-btn';
        button.innerHTML = '?';
        let content = document.createElement('content');
        content.id = 'he-help-content';
        let slot = document.createElement('slot');
        slot.name = 'text';

        shadow.adoptedStyleSheets = [sheet];
        content.append(slot);
        shadow.append(button);
        shadow.append(content);

        button.addEventListener('click', e => this.clickBtnCallback(e, this));
        shadow.addEventListener('slotchange', e => this.slotChangeCallback(e, this));
    }

    connectedCallback() {
    }

    /**
     * Callback for slot changes.
     * Rebuilds the tabs and shows the correct content.
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    slotChangeCallback(event, self) {
        const slot = event.target;
    }

    /**
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    clickBtnCallback(e, self) {
        console.log('click');
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
    }
}

class HeliumMenu extends HTMLElement {
    static observedAttributes = [
        'title,'
    ];

    /** @type {HTMLDivElement} */
    items;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
:host {
    position: relative;
    display: inline-block;
    --he-color-accent: #0082b4;
}

#he-menu-items {
    position: absolute;
    border: 1px solid lightgrey;
    min-width: 70px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    border-radius: 3px;
    z-index: 1;
    top: 20px;
    display: flex;
    flex-direction: column;
    padding: 0.2rem;
}

::slotted([slot=item]) {
    padding: 0.2rem 0.3rem !important;
    border-radius: 3px;
    cursor: pointer;
}

::slotted([slot=item]:hover) {
    background-color: whitesmoke;
}
        `);

        this.items = document.createElement('div');
        this.items.id = 'he-menu-items';
        this.items.style.display = 'none';

        let item = document.createElement('slot');
        item.name = 'item';


        this.button = document.createElement('slot');
        this.button.name = 'button';
        this.button.id = 'he-menu-button';

        this.items.append(item);
        shadow.append(this.items);
        shadow.append(this.button);

        shadow.adoptedStyleSheets = [sheet];
        shadow.addEventListener('slotchange', this.slotChangeCallback.bind(this));
    }

    connectedCallback() {
    }

    /**
     * Callback for slot changes.
     * Rebuilds the tabs and shows the correct content.
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    slotChangeCallback(event) {
        const slot = event.target;
        for (const elem of slot.assignedElements()) {
            if (elem.slot === 'button') {
                elem.addEventListener('click', e => {
                    if (this.fnClose == null) {
                        this.open.bind(this)()
                    }
                });
            }
        }
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
    }

    close() {
        this.items.style.display = 'none';
        window.removeEventListener('mousedown', this.fnClose);
        this.fnClose = null;
    }

    open() {
        if (this.fnClose != null) {
            return;
        }
        this.items.style.display = '';
        this.fnClose = this.close.bind(this);
        window.addEventListener('mousedown', this.fnClose);
    }
}

class HeliumButton extends HTMLElement {
    static observedAttributes = [
        'value',
        'name',
        'form',
        'popovertarget',
        'popovertargetaction',
        'disabled',
        'form',
        'formtarget',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'loading',
        'show-dialog',
        'close-dialog',
        'submit',
        'input-invalid',
    ];
    /** @type {HTMLInputElement} */
    button;
    /** @type {?EventListener} */
    listenerClick = null;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
        :host {
            text-wrap: nowrap;
        }

        #he-button {
            border-radius: 2px;
            color: black;
            height: 35px;
            padding: 0px 10px;
            vertical-align: middle;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, 0.2235294118);
            font-size: 14px;
            background-color: var(--he-button-clr-bg, white);
            outline-style: none;
            box-shadow: none !important;
            width: auto;
            position: relative;
        }

        #he-button[disabled] {
            background-color: #d9d9d9;
            color: #666666;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button:hover:enabled:not([loading]), 
        #he-button:active:enabled:not([loading]), 
        #he-button:focus:enabled:not([loading]) {
            cursor: pointer;
            text-shadow: 0px 0px 0.3px var(--he-button-clr-border-hover);
            border-color: var(--he-button-clr-border-hover, grey);
            color: var(--he-button-clr-border-hover, black);
        }

        #he-button:hover:enabled:not([loading]){
            background-color: color-mix(in srgb,var(--he-button-clr-bg, white),black 2%)
        }

        #he-button[loading] {
            background-color: #d9d9d9;
            color: #6666668c;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button[loading]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-top-color: var(--he-button-clr-spinner, black);
            border-radius: 50%;
            animation: button-loading-spinner 1s ease infinite;
        }

        #he-button[ok]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-bottom-color: var(--he-button-clr-spinner, black);
            border-right-color: var(--he-button-clr-spinner, black);
            transform: rotate(45deg);
        }

        @keyframes button-loading-spinner {
            from {
                transform: rotate(0turn);
            }

            to {
                transform: rotate(1turn);
            }
        }
        `);

        this.button = document.createElement('button');
        this.button.id = 'he-button'

        shadow.append(this.button);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        this.button.innerHTML = this.innerHTML;
        this.innerHTML = '';
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'show-dialog':
                this.removeEventListener('click', this._showDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._showDialog);
                }
                break;
            case 'close-dialog':
                this.removeEventListener('click', this._hideDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._closeDialog());
                }
                break;
            case 'submit':
                this.addEventListener('click', () => this._submitForm())
                break;
            case 'input-invalid':
                if (newValue) {
                    this.disable();
                } else {
                    this.enable();
                }
                break;
            default:
                if (newValue === null || newValue === 'false') {
                    this.button.removeAttribute(name);
                } else {
                    this.button.setAttribute(name, newValue);
                }
                break;
        }
    }

    /**
     * Shows or hides the loading animation.
     * @param {bool} showLoading 
     */
    loading(showLoading) {
        if (showLoading == null || showLoading) {
            this.setAttribute('loading', true);
        } else {
            this.removeAttribute('loading');
        }
    }

    /**
     * Disables the button.
     */
    disable() {
        this.setAttribute('disabled', true);
    }

    /**
     * Enables the button.
     */
    enable() {
        this.removeAttribute('disabled');
    }

    _submitForm() {
        const id = this.getAttribute('submit');
        const form = document.querySelector(id);
        console.assert(form == null, `No form found with ID ${id}`)
        form.submit();
    }

    _showDialog() {
        const diag = document.querySelector(this.getAttribute('show-dialog'));
        diag.showModal();
    }

    _closeDialog() {
        const diag = document.querySelector(this.getAttribute('close-dialog'));
        diag.close();
    }
}

class HeliumFormDialog extends HTMLElement {
    static observedAttributes = [
        "open",
        "title",
        "close-icon",
        "close-button",
    ];
    /** @type {HeliumDialog} */
    dialog;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        let sheet = new CSSStyleSheet();

        sheet.replaceSync(scss`
            #he-form {
                display: grid;
                grid-template-columns: max-content 1fr;
                gap: 0.5rem;
                margin: 0.5rem;
                margin-bottom: 0.5rem;
            }

            #he-form input, #he-form select {
                font-size: 16px;
                padding: 3px 7px;
                outline: none;
                border: 1px solid grey;
                background-color: whitesmoke;
                border-radius: var(--he-form-dialog-radius-input, 2px);
            }

            #he-form input:focus, #he-form select:focus {
                border-color: var(--he-form-dialog-clr-focus, black);
            }

            #footer-diag-edit he-button:first-child {
                margin-right: 0.5rem;
            }

            #he-form .invalid-input {
                border: 1px solid red;
            }

            #he-form label {
                display: flex;
                align-items: center;
            }
        `);

        shadow.adoptedStyleSheets = [sheet];

        this.dialog = document.createElement('he-dialog');

        this.form = document.createElement('form');
        this.form.id = 'he-form';
        this.form.slot = 'body';
        this.dialog.append(this.form);

        let footer = document.createElement('div');
        footer.id = 'footer-diag-edit';
        footer.slot = 'footer';
        this.dialog.append(footer);

        let btnSave = document.createElement('he-button');
        btnSave.innerHTML = 'Speichern';
        btnSave.id = 'btn-save';
        btnSave.onclick = () => this.submit.bind(this)();
        footer.append(btnSave)

        let btnClose = document.createElement('he-button');
        btnClose.innerHTML = 'Schließen';
        btnClose.onclick = () => this.dialog.close();
        footer.append(btnClose);

        shadow.append(this.dialog);
    }

    connectedCallback() {
        this.addEventListener("he-dialog-show", function() {
            this.show();
        })
        this.addEventListener("he-dialog-close", function() {
            this.close();
        })
    }

    getValues(validate = true) {
        let values = {};
        for (const input of this.body.querySelectorAll('input, select')) {
            if (this._formInputBlurCallback({ currentTarget: input })) {
                values[input.name] = input.value;
            }
        }
        return values;
    }

    /**
     * 
     * @param {?string} enpoint 
     * @param {?Object<string, string>} fetchArgs 
     * @param {?function(RequestInit): RequestInit} callbackBefore
     * @param {?function(Response): any} callbackAfter
     * @returns void
     */
    submit(endpoint, fetchArgs, callbackBefore, callbackAfter) {
        let values = {};
        for (const input of this.form.querySelectorAll('input, select')) {
            if (!this._formInputBlurCallback({ currentTarget: input })) {
                return;
            }
            values[input.name] = input.value;
        }

        endpoint = endpoint
            ?? this.getAttribute('-endpoint')
            ?? this.getAttribute('action');

        fetchArgs = fetchArgs ?? {};
        fetchArgs.method = fetchArgs.method
            ?? this.getAttribute('method')
            ?? 'POST';
        fetchArgs.headers = fetchArgs.headers
            ?? this.getAttribute('headers');
        fetchArgs.body = JSON.stringify(values);

        callbackBefore = callbackBefore ?? this.getAttribute('before-submit');
        if (callbackBefore) {
            fetchArgs = eval(callbackBefore + '(fetchArgs)');
        }

        callbackAfter = callbackAfter ?? this.getAttribute('after-submit');

        this.dialog.querySelector('#btn-save').loading();

        fetch(endpoint, fetchArgs)
            .then(resp => {
                this.dialog.querySelector('#btn-save').loading(false);

                if (callbackAfter) {
                    eval(callbackAfter + '(resp)');
                }

                const event = new CustomEvent("he-form-dialog-submit", {
                    detail: {
                        source: this.id,
                        data: resp,
                    }
                });

                this.dispatchEvent(event);
            });
    }

    /**
     * 
     * @param {HTMLInputElement} input
     * @returns boolean
     */
    _validateInput(input) {
        const pattern = input.pattern

        if (input.required && input.value === '') {
            return false;
        }

        if (pattern == null) {
            return true;
        }

        const regex = new RegExp(pattern);
        return regex.test(input.value);
    }

    reset() {
        for (const input of this.form.querySelectorAll('he-input')) {
            console.log(input.value);
            input.value = '';
        }
    }

    /**
     * 
     * @param {Object<string, string>} data
     * @returns Self
     */
    setValues(data) {
        for (const [name, val] of Object.entries(data)) {
            const input = this.form.querySelector(`[name="${name}"]`);
            if (input) {
                input.value = val;
            }
        }

        return this;
    }

    /**
     * 
     * @param {Array<{
     *   name: string,
     *   label: string,
     *   pattern: ?string,
     *   required: ?boolean,
     *   placeholder: ?string,
     *   value: ?string,
     *   options: ?Object<string, string>
     * }>} data
     * @returns void
     */
    renderRows(data) {
        this.form.innerHTML = '';

        data.forEach((entry, i) => {
            let labelText = entry.label;
            if (entry.required) {
                labelText += '*';
            }

            let id = `edit-${i}`;
            let label = document.createElement('label');
            label.for = id;
            label.innerHTML = labelText;
            this.form.append(label);

            if (entry.options && Object.keys(entry.options).length > 0) {
                let select = document.createElement('select');
                select.id = id;
                select.name = entry.name;
                if (!entry.required) {
                    select.append(document.createElement('option'));
                }

                for (const [value, text] of Object.entries(entry.options)) {
                    const opt = document.createElement('option');
                    opt.value = value;
                    opt.innerHTML = text;
                    select.append(opt);
                }
                this.form.append(select);
            } else {
                let input = document.createElement('input');
                input.required = entry.required;
                input.id = id;
                input.name = entry.name;
                input.type = 'text';
                input.onblur = (e) => this._formInputBlurCallback.bind(this)(e);
                if (entry.pattern) {
                    input.pattern = entry.pattern;
                }
                if (entry.placeholder != null) {
                    input.placeholder = entry.placeholder;
                }
                this.form.append(input);
            }
        });
    }

    /**
     * @param {InputEvent} e
     * @returns boolean
     */
    _formInputBlurCallback(e) {
        const input = e.currentTarget;
        const isValid = this._validateInput(input);
        if (isValid) {
            input.classList.remove('invalid-input');
        } else {
            input.classList.add('invalid-input');
        }

        return isValid;
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        this.dialog.attributeChangedCallback(name, oldValue, newValue);
    }

    /**
     * Opens the dialog.
     * @returns Self
     */
    show() {
        this.dialog.show();
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
}

class HeliumTable extends HTMLElement {
    static observedAttributes = [
        'endpoint',
        'pagination',
    ];

    /** @type {?string} */
    endpoint;
    /** @type {HTMLInputElement} */
    checkAll;
    /** @type {HTMLFormElement} */
    form;
    /** @type {HTMLFormElement} */
    formDialogEdit;
    /** @type {HTMLTableSectionElement} */
    body;
    /** @type {HeliumFormDialog} */
    diagEdit;
    /** @type {?Object.<string, string>} */
    dataOld;
    /** @type {?string} */
    editRequestType;
    /** @type {array<string>} */
    idsEdit = [];
    /** @type {number} */
    nextRowId = 0;
    /** @type {?number} */
    pagination;
    /** @type {number} */
    offset = 0;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
        table {
            border-spacing: 0;
            border-collapse: separate;
            border-radius: var(--he-table-radius, 4px);
        }

        thead {
            position: sticky;
            top: 1px;
            z-index: 100;
        }

        thead th {
            background-color: var(--he-table-clr-accent, #0082b4);
            color: var(--he-table-clr-bg, white);
            font-weight: 500;
            padding: 7px 15px;
            padding-top: 15px;
            text-align: center;
            vertical-align: middle;
            text-wrap: nowrap;
            width: 0;
        }

        thead th:hover .label-sorter {
            opacity: 0.5;
        }

        thead th div {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            justify-content: space-between;
        }

        thead td {
            background-color: #0082b4;
            padding: 0px 4px 8px 4px;
            width: 0;

        }

        thead td:first-child {
            padding: 3px 15px;
            border-radius: 0;
        }

        thead td:last-child {
            border-radius: 0;
            padding-right: 15px;
        }

        thead select {
            padding: 0px 3px;
        }

        thead a {
            color: rgba(255, 255, 255, 0.5411764706);
            padding-left: 5px;

        }

        thead a:hover {
            color: white;
        }

        thead .cont-filter {
            position: relative;    
            width: 100%;
        }
        
        thead .span-colname {
            position: absolute;
            left: 0.3rem;
            pointer-events: none;
            transition: 0.2s ease all;
            top: 0px;
            font-weight: 600;
        }

        thead .inp-filter {
            margin: 0;
            padding: 0px 5px;
            font-size: 0.9rem;
            font-weight: 500;
            background-color: transparent;
            outline: none;
            border: 0;
            color: white;
            width: 100%;
            -webkit-appearance: none;
            -moz-appearance: none;
            text-indent: 1px;
            text-overflow: '';
            border-radius: var(--he-table-filter-radius, 2px);
        }

        tbody tr:last-child td:first-child {
            border-bottom-left-radius: var(--he-table-radius, 4px);
        }
        tbody tr:last-child td:last-child {
            border-bottom-right-radius: var(--he-table-radius, 4px);
        }
        thead tr:first-child th:first-child {
            border-top-left-radius: var(--he-table-radius, 4px);
        }
        thead tr:first-child th:last-child {
            border-top-right-radius: var(--he-table-radius, 4px);
        }

        thead .inp-filter:focus,
        .cont-filter input:not(:placeholder-shown),
        .cont-filter select:has(option:checked:not([value=""])) {
            background-color: #00000026;
            transform: translateY(5px);
            font-weight: 600;
        }

        thead .inp-filter:focus + .span-colname, 
        .cont-filter input:not(:placeholder-shown) + .span-colname,
        .cont-filter select:has(option:checked:not([value=""])) + .span-colname {
            transform: translateY(-11px);
            font-size: 0.7rem;
            opacity: 1;
        }
        
        tbody {
            min-height: 15px;
        }

        tbody tr:nth-child(odd) {
            background-color: #f0f0f0;
        }

        tbody tr:hover {
            background-color: #dcdcdc;
        }

        tbody td {
            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 400px;
            padding: 3px 15px;
            vertical-align: middle;
            width: 0;

        }

        tbody td xmp {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        tbody #row-btn-more {
            background-color: var(--he-table-clr-accent, #0082b4);
            color: var(--he-table-clr-bg, white);
            cursor: pointer;
            text-align: center;
        }

        tbody #row-btn-more:hover {
            filter: brightness(110%);
        }

        tbody #row-btn-more td {
            padding: 0.3rem;
        }

        .check-row, #check-all {
            scale: 1.2;
        }

        .cont-sorters {
            display: inline-flex;
            flex-direction: column;
            font-size: 0.7rem;
            gap: 0;
            cursor: pointer;
        }

        .label-sorter {
            opacity: 0;
        }

        thead th div .label-sorter:hover {
            opacity: 1;
        }

        thead th div .label-sorter:has(input:checked) {
            opacity: 1;
        }

        .label-sorter input {
            display: none;
        }

        table[loading] {
            pointer-events: none;
            cursor: no-drop;
        }

        table[loading] tbody {
            position: relative;
        }

        table[loading] tbody::after {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: linear-gradient(-90deg, #dbd8d8 0%, #fcfcfc 50%, #dbd8d8 100%);
            background-size: 400% 400%;
            animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
            0% {
                background-position: 0% 0%
            }
            100% {
                background-position: -135% 0%
            }
        }
        `);

        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        const shadow = this.shadowRoot;

        this.id = this.id == ''
            ? 'he-table-' + Math.floor(Math.random() * (1e10 + 1))
            : this.id;

        let table = document.createElement('table');

        this.form = document.createElement('form');
        this.form.id = "form-tbl";
        this.form.append(table);

        shadow.append(this.form);

        let rowFilters = document.createElement('tr');
        let rowColNames = document.createElement('tr');

        const columns = this.querySelectorAll('th');
        for (let column of columns) {
            let colName = column.getAttribute('column') ?? column.innerText;

            let contHeaderCell = document.createElement('div');
            let contFilter = document.createElement('div');
            contFilter.classList.add('cont-filter')
            contHeaderCell.append(contFilter);

            let spanName = document.createElement('span');
            spanName.innerHTML = column.innerHTML.trim();
            spanName.classList.add('span-colname');
            column.innerHTML = '';
            contFilter.append(spanName);

            let contSorters = this._renderSorters(colName);
            column.setAttribute('column', colName);
            contHeaderCell.append(contSorters);
            column.append(contHeaderCell);
            rowColNames.append(column);

            const options = this._getColumnOptions(column);

            if (options && options.length > 0) {
                let selFilter = document.createElement('select');
                selFilter.id = 'filter-' + colName;
                selFilter.name = colName;
                selFilter.classList.add('inp-filter');
                selFilter.onchange = (e) => this._filterChangeCallback(e);
                let optionEmpty = document.createElement('option');
                optionEmpty.value = '';
                selFilter.append(optionEmpty);
                for (const option of options) {
                    selFilter.append(option.cloneNode(true));
                }
                contFilter.prepend(selFilter);
            } else {
                let inpFilter = document.createElement('input');
                inpFilter.id = 'filter-' + colName;
                inpFilter.type = 'search';
                inpFilter.name = colName;
                inpFilter.autocomplete = 'off';
                inpFilter.placeholder = ' ';
                inpFilter.classList.add('inp-filter');
                inpFilter.value = column.getAttribute('filter') ?? '';
                inpFilter.onchange = (e) => this._filterChangeCallback(e);
                contFilter.prepend(inpFilter);
            }
        }

        this.checkAll = document.createElement('input');
        this.checkAll.type = 'checkbox';
        this.checkAll.id = 'check-all';
        this.checkAll.onchange = (e) => this._checkAllCheckCallback.bind(this)(e);

        let cellCheckAll = document.createElement('th');
        cellCheckAll.append(this.checkAll);
        rowColNames.prepend(cellCheckAll);

        let tHead = document.createElement('thead');
        tHead.append(rowColNames);
        tHead.append(rowFilters);
        table.append(tHead);

        this.body = document.createElement('tbody');

        const rows = this.querySelectorAll('tr:has(td)');
        for (const row of rows) {
            let rowData = {};
            for (let i = 0; i < columns.length; ++i) {
                const cell = row.children[i];
                const column = columns[i]
                const data = cell.getAttribute('data') ?? cell.innerText;
                const colName = column.getAttribute('column') ?? column.innerText;
                rowData[colName] = data;
            }
            let rowRendered = this._renderRow(rowData);
            this.body.append(rowRendered);
        }
        table.append(this.body);

        this.diagEdit = this._renderDialogEdit();
        shadow.append(this.diagEdit);
        this.innerHTML = '';

        for (let cont of this.form.querySelectorAll('.cont-filter')) {
            let input = cont.querySelector('.span-colname');
            let filter = cont.querySelector('.inp-filter');
            filter.style.minWidth = input.offsetWidth + 'px';
        }

        this._requestRows(this._replaceBody);
    }

    /**
     * @param {string} colName The name of column for the sorters
     * @returns HTMLDivElement
     */
    _renderSorters(colName) {
        let radioSortAsc = document.createElement('input');
        radioSortAsc.type = 'radio';
        radioSortAsc.name = 'sort';
        radioSortAsc.value = colName + '-asc';
        radioSortAsc.id = colName + '-asc';
        radioSortAsc.onclick = (e) => this._sortClickCallback.bind(this)(e, false);

        let labelSortAsc = document.createElement('label');
        labelSortAsc.for = colName + 'asc';
        labelSortAsc.innerHTML = '▲';
        labelSortAsc.classList.add('label-sorter');
        labelSortAsc.append(radioSortAsc);

        let radioSortDesc = document.createElement('input');
        radioSortDesc.type = 'radio';
        radioSortDesc.name = 'sort';
        radioSortDesc.value = colName + '-desc';
        radioSortDesc.id = colName + '-desc';
        radioSortDesc.onclick = (e) => this._sortClickCallback.bind(this)(e, true);

        let labelSortDesc = document.createElement('label');
        labelSortDesc.for = colName + 'desc';
        labelSortDesc.classList.add('label-sorter');
        labelSortDesc.innerHTML = '▼';
        labelSortDesc.append(radioSortDesc);

        let contSorters = document.createElement('div');
        contSorters.classList.add('cont-sorters')
        contSorters.append(labelSortAsc);
        contSorters.append(labelSortDesc);

        return contSorters;
    }

    /**
     * @param {HTMLElement} column
     * @returns {?HTMLCollection<HTMLOptionElement>}
     */
    _getColumnOptions(column) {
        let selector = column.getAttribute('options');

        /** @type {HTMLDataListElement} */
        let list = document.querySelector('datalist' + selector);
        return list == null ? null : list.children;
    }


    /**
     * @param {InputEvent} e 
     * @param {bool} isDesc 
     * @returns void
     */
    _sortClickCallback(e, isDesc) {
        if (this.endpoint) {
            this._requestRows(this._replaceBody);
            return;
        }

        let sort = e.currentTarget;
        const colIdx = Array.prototype.indexOf.call(
            sort.parentElement.parentElement.parentElement.parentElement.parentElement.children,
            sort.parentElement.parentElement.parentElement.parentElement
        );

        let values = [];
        for (const row of this.body.children) {
            values.push([row.children[colIdx].getAttribute('data'), row]);
        }

        let newOrder = isDesc
            ? Array.from(values).sort((a, b) => b[0].localeCompare(a[0]))
            : Array.from(values).sort((a, b) => a[0].localeCompare(b[0]));


        for (const row of newOrder) {
            this.body.append(row[1]);
        }
    }

    _filterChangeCallback(e) {
        this.offset = 0;

        if (this.endpoint != null) {
            this._requestRows(this._replaceBody);
            return;
        }

        const filter = e.currentTarget;
        const filterValue = filter.value.toLowerCase();
        const colIdx = Array.prototype.indexOf.call(
            filter.parentElement.parentElement.parentElement.parentElement.children,
            filter.parentElement.parentElement.parentElement
        );
        for (const row of this.body.children) {
            const data = row.children[colIdx].getAttribute('data');
            let hideMask = row.getAttribute('mask') ?? 0;

            if (data.toLowerCase().includes(filterValue)) {
                // Clear bit for column filter
                hideMask &= ~1 << colIdx;
            } else {
                // Set bit bit for column filter
                hideMask |= 1 << colIdx;
            }

            row.setAttribute('mask', hideMask);

            if (hideMask > 0) {
                row.style.visibility = 'collapse';
            } else {
                row.style.visibility = null;
            }
        }
    }

    /**
     * @returns {NodeListOf<HTMLTableCellElement>}
     */
    _getColumns() {
        return this.shadowRoot.querySelectorAll('th[column]')
    }

    /**
      * TODO(marco): Maybe remove
      * Returns the *text* representation of a value depending on the data type.
      * @param {string} type 
      * @param {string} val 
      * @returns string
      */
    _renderCellText(type, val) {
        switch (type) {
            case 'date':
                return val.split('-').reverse().join('.');
            case 'datetime':
                val = val.replace('T', ' ');
                const [date, time] = val.split(' ');
                return date.split('-').reverse().join('.') + ' ' + time;
            default:
                return val;
        }
    }

    /**
     * @param {Object.<string, string>} data 
     * @returns {HTMLTableRowElement}
     */
    _renderRow(data) {
        let inpCheck = document.createElement('input');
        inpCheck.type = 'checkbox';
        inpCheck.name = 'rows[]'
        inpCheck.value = data['id'] ?? '';
        inpCheck.classList.add('check-row');
        let cellCheck = document.createElement('td');
        cellCheck.append(inpCheck);

        let row = document.createElement('tr');
        row.id = 'row-' + this.nextRowId++;
        row.append(cellCheck);
        row.onclick = (e) => this._rowClickCallback.bind(this)(e);

        for (let column of this._getColumns()) {
            let colName = column.getAttribute('column');
            let colType = column.getAttribute('type');
            let cell = document.createElement('td');
            let val = data[colName] ?? '';
            cell.innerHTML = this._renderCellText(colType, val);
            cell.setAttribute('data', val);
            cell.title = val;

            row.append(cell);
        }

        return row;
    }

    showDialogNew() {
        this.diagEdit.reset();
        this.editRequestType = 'POST';
        this.diagEdit.setAttribute('title', 'Erstellen');
        this.diagEdit.showModal();
    }

    showDialogEdit() {
        let check = this.shadowRoot.querySelector('.check-row:checked');
        if (check == null) {
            throw new Error('No row selected');
        }

        let row = check.parentElement.parentElement;
        let data = this._getRowData(row, true);

        this.diagEdit.setValues(data);
        this.dataOld = data;
        this.idsEdit = [row.id];
        this.editRequestType = 'PATCH';
        this.diagEdit.setAttribute('title', 'Bearbeiten');
        this.diagEdit.showModal();
    }

    showDialogDuplicate() {
        let check = this.shadowRoot.querySelector('.check-row:checked');
        if (check == null) {
            throw new Error('No row selected');
        }

        let row = check.parentElement.parentElement;
        let data = this._getRowData(row, true);

        this.diagEdit.setValues(data);
        this.editRequestType = 'POST';
        this.diagEdit.setAttribute('title', 'Duplizieren');
        this.diagEdit.showModal();
    }

    loading(enable = true) {
        if (enable) {
            this.body.parentElement.setAttribute('loading', true);
        } else {
            this.body.parentElement.removeAttribute('loading');
        }
    }

    deleteChecked(confirm = true) {
        let checks = this.shadowRoot.querySelectorAll('.check-row:checked');

        let request = {
            data: [],
        }

        for (let check of checks) {
            let row = check.parentElement.parentElement;
            let data = this._getRowData(row);
            request.data.push(data);
        }

        let numDelete = request.data.length;
        if (numDelete === 0) {
            window.alert('Keine Zeilen ausgewählt.');
            return;
        }

        const msg = numDelete > 1
            ? `werden ${numDelete} Zeilen`
            : `wird 1 Zeile`;
        if (confirm && !window.confirm(`Es ${msg} gelöscht.\nSind Sie sicher?`)) {
            return;
        }

        if (this.endpoint != null) {
            fetch(this.endpoint, {
                method: 'DELETE',
                body: request,
            })
                .then(resp => resp.json())
                .then(data => {
                    data.foreach((delStatus, i) => {
                        if (delStatus) {
                            checks[i].parentElement.parentElement.remove();
                        }
                    })
                })
                .catch(errorMsg => { console.log(errorMsg); });
            return;
        }

        for (const check of checks) {
            check.parentElement.parentElement.remove();
        }
    }

    /**
     * @returns {Object.<string, string>}
     */
    _getRowData(row, returnDisplayValues = false) {
        let data = {};
        let columns = this._getColumns();
        for (let i = 0; i < columns.length; ++i) {
            // `i+1` to skip the checkbox column
            let cell = row.children[i + 1];
            let column = columns[i];

            const colName = column.getAttribute('column');
            data[colName] = returnDisplayValues
                ? cell.innerText
                : cell.getAttribute('data');
        }

        return data;
    }

    /**
     * Sends a new `GET` request to update all rows.
     * Only if an endpoint is defined!
     * @param {function(array<Object<string, string>>): void} callback 
     * @returns void
     */
    _requestRows(callback) {
        if (this.endpoint == null) {
            return;
        }

        this.loading();

        let formData = new FormData(this.form);

        if (this.pagination != null) {
            formData.append('offset', this.offset)
            formData.append('count', this.pagination + 1);
        }

        fetch(this.endpoint + '/?' + new URLSearchParams(formData).toString(), {
            method: 'GET',
        })
            .then(resp => resp.json())
            .then(data => {
                callback.bind(this)(data);
            })
            .catch(errorMsg => { console.log(errorMsg); })
            .finally(() => this.loading(false));

    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     * @returns void
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'endpoint':
                this.endpoint = newValue;
                break;

            case 'pagination':
                this.pagination = Number(newValue);
                break;
        }
    }

    /**
     * Replaces the row with the provided ID with new data.
     * @param {string} rowId The HTML id of the row to update
     * @throws If no row is found with this ID
     */
    replaceRowData(rowId, newData) {
        let row = this.body.querySelector('#' + rowId);
        if (row == null) {
            throw new Error('No row found with the row ID ' + rowId);
        }

        let columns = this._getColumns();
        for (let i = 0; i < columns.length; ++i) {
            const colName = columns[i].getAttribute('column');
            const colType = columns[i].getAttribute('type') ?? 'text';
            const val = newData[colName];
            if (val == null) {
                continue;
            }

            // `+1` because of checkbox
            let cell = row.children[i + 1];
            cell.setAttribute('data', val);
            cell.innerHTML = this._renderCellText(colType, val);
        }
    }

    /**
     * @param {array<Object.<string, string>>} data 
     * @returns {HTMLDialogElement}
     */
    _replaceBody(data) {
        this.body.innerHTML = '';
        this.offset = 0;

        this.checkAll.checked = false;
        this.checkAll.indeterminate = false;

        let renderMore = false;
        if (this.pagination != null && data.length > this.pagination) {
            data.pop();
            renderMore = true;
        }

        for (let rowData of data) {
            this.body.append(this._renderRow(rowData));
        }

        if (renderMore) {
            this.body.append(this._renderButtonMore());
        }
    }

    /**
     * Creates and returns the `show more` button for pagination.
     * @returns {HTMLTableRowElement}
     */
    _renderButtonMore() {
        let row = document.createElement('tr');
        row.id = 'row-btn-more';
        let cell = document.createElement('td');
        cell.colSpan = '100';
        cell.title = 'Mehr anzeigen';
        cell.innerHTML = 'Mehr anzeigen';
        cell.onclick = () => this._handlePagination();

        row.append(cell);
        return row;
    }

    _handlePagination() {
        this.offset += this.pagination ?? 0;
        this._requestRows(this._appendRows);
    }


    /**
     * @param {array<Object<string, string>>} rowData 
     */
    _appendRows(rowData) {
        if (this.pagination != null && rowData.length > this.pagination) {
            rowData.pop();
        }

        let rowMore = null;
        if (this.body.lastChild.id === 'row-btn-more') {
            rowMore = this.body.lastChild;
            this.body.removeChild(rowMore);
        }

        for (let row of rowData) {
            this.body.append(this._renderRow(row));
        }

        if (rowMore != null && rowData.length === this.pagination) {
            this.body.append(rowMore);
        }
    }

    _renderDialogEdit() {
        let data = [];
        for (let column of this._getColumns()) {
            const options = this._getColumnOptions(column);
            let optionValues = null;
            if (options && options.length > 0) {
                optionValues = [];
                for (const option of options) {
                    optionValues[option.value] = option.innerHTML;
                }
            }

            if (column.getAttribute('no-edit') === 'true') {
                continue;
            }

            data.push({
                name: column.getAttribute('column'),
                required: column.getAttribute('required') === 'true',
                label: column.querySelector('span').innerHTML,
                placeholder: column.getAttribute('default'),
                pattern: column.getAttribute('pattern'),
                options: optionValues,
            })
        }

        /** @type {HeliumFormDialog} */
        let dialog = document.createElement('he-form-dialog');
        dialog.renderRows(data);

        dialog.setAttribute('endpoint', this.endpoint);
        dialog.setAttribute('before-submit', `document.querySelector('#${this.id}').formEditBeforeSubmitCallback`);
        dialog.setAttribute('after-submit', `document.querySelector('#${this.id}').formEditAfterSubmitCallback`);
        return dialog;
    }

    /**
     * 
     * @param {RequestInit} request
     * @returns request
     */
    formEditBeforeSubmitCallback(request) {
        request.body = {
            data: [JSON.parse(request.body)],
        };

        if (this.dataOld != null) {
            request.body.old = [this.dataOld];
        }
        request.method = this.editRequestType;
        request.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        request.body = JSON.stringify(request.body);

        return request;
    }


    /**
     * 
     * @param {Response} response
     * @returns void
     */
    formEditAfterSubmitCallback(response) {
        response.json().then(data => {
            switch (this.editRequestType) {
                case 'POST':
                    this._requestRows(this._replaceBody);
                    break;
                case 'PATCH':
                    data.forEach((entry, i) => {
                        const rowId = this.idsEdit[i];
                        this.replaceRowData(rowId, entry);
                    });
                    break;
            }
            this.diagEdit.close();
        });

    }

    /**
     * Callback when the checkbox on top has changed.
     * @returns void
     */
    _checkAllCheckCallback() {
        this.checkAll.indeterminate = false;

        for (const check of this.body.querySelectorAll('.check-row')) {
            if (this.checkAll.checked) {
                check.checked = true;
            } else {
                check.checked = false;
            }
        }

    }

    _updateExternElements() {
        for (const elem of document.querySelectorAll(`[he-table-checked="#${this.id}"]`)) {
            elem.classList.remove('.he-table-checked-none');
            elem.classList.remove('.he-table-checked-one');
            elem.classList.remove('.he-table-checked-multiple');
            switch (this.countChecked) {
                case 0:
                    elem.setAttribute('he-table-state', 'none');
                    break;
                case 1:
                    elem.setAttribute('he-table-state', 'one');
                    break;
                default:
                    elem.setAttribute('he-table-state', 'multiple');
                    break;
            }
        }
    }

    /**
     * 
     * @param {InputEvent} e
     * @returns void
     */
    _rowClickCallback(e) {
        const row = e.currentTarget;

        const checked = this.body.querySelectorAll('.check-row:checked');
        let numChecked = checked.length;

        if (!e.target.classList.contains('check-row')) {
            for (let check of checked) {
                check.checked = false;
            }

            row.children[0].children[0].checked = true;
            numChecked = 1;
        }

        if (numChecked === 0) {
            this.checkAll.checked = false;
            this.checkAll.indeterminate = false;
        } else if (numChecked < this.body.children.length) {
            this.checkAll.checked = true;
            this.checkAll.indeterminate = true;
        } else {
            this.checkAll.indeterminate = false;
            this.checkAll.checked = true;
        }
    }
}


class HeliumCheck extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'name',
        'indeterminate',
    ];

    /** @type {HTMLSpanElement} */
    mark;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
        :host {
            display: inline-block;
            width: fit-content;
        }

        .container {
            display: block;
            position: relative;
            padding-left: 25px;
            margin-bottom: 12px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            background-color: #eee;
            border-radius: var(--he-check-radius, 3px);
            transform: scale(var(--he-check-scale, 0.7)) translateY(-5px);
        }

        :host(:hover) .checkmark {
            background-color: var(--he-check-clr-check, #ccc);
        }

        :host(:state(checked)) .checkmark {
            background-color: var(--he-check-clr-box, #2196F3);
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        :host(:state(checked)) .checkmark:after {
            display: block;
        }

        :host(:state(checked):state(indeterminate)) .checkmark:after {
            display: block;
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
            height: 0px;
            top: 11px;
            width: 7px;
            left: 7px;
        }

        .checkmark:after {
            left: 8px;
            top: 2px;
            width: 5px;
            height: 12px;
            border: solid white;
            border-width: 0 4px 4px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        } 
        `);

        let container = document.createElement('div');
        container.classList.add('container');
        container.innerHTML = this.innerHTML;
        this.innerHTML = '';

        this.mark = document.createElement('div');
        this.mark.classList.add('checkmark');
        container.append(this.mark);

        shadow.append(container);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        this.internals = this.attachInternals();
        this.addEventListener('click', () => this.toggle());
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', true);
            this.internals.states.add('checked');
            this.internals.setFormValue('on', 'checked');
        } else {
            this.removeAttribute('checked');
            this.internals.states.delete('checked');
            this.internals.setFormValue(null);
        }
    }

    get checked() {
        return this.internals.states.has('checked');
    }

    set name(val) {
        this.setAttribute('name', val);
    }

    get name() {
        return this.getAttribute('name');
    }

    set indeterminate(val) {
        if (val) {
            this.internals.states.add('indeterminate');
        } else {
            this.internals.states.delete('indeterminate');
        }
    }

    get indeterminate() {
        return this.internals.states.has('indeterminate');
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'name':
                this.name = newValue;
                break;
            case 'indeterminate':
                if (newValue == null || newValue === 'false') {
                    this.indeterminate = false;
                } else {
                    this.indeterminate = true;
                }
                break;
        }
    }

    toggle() {
        this.checked = !this.checked;
    }
}

class HeliumInput extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'pattern',
        'required',
        'report-validity',
        'type',
    ];

    /** @type {HTMLInputElement} */
    input;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            :host {
                display: inline-flex;
                position: relative;
            }

            :host[loading]::after {
                content: "";
                position: absolute;
                width: 12px;
                height: 12px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 3px solid darkgrey;
                border-radius: 50%;
                border-bottom-color: var(--he-input-clr-spinner, black);
                animation: button-loading-spinner 1s ease infinite;
            }

            :host[ok]::after {
                content: "";
                position: absolute;
                width: 10px;
                height: 15px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 3px solid transparent;
                border-bottom-color: var(--he-input-clr-ok, black);
                border-right-color: var(--he-input-clr-ok, black);
                transform: rotate(45deg);
            }

            #inp-main {
                outline: none;
                background-color: var(--he-input-clr-bg, whitesmoke);
                border: 1px solid lightgrey;
                width: var(--he-input-width, 100%);
                padding: 0.3rem 0.4rem;
                font-size: var(--he-input-fs, 14px);
                border-radius: var(--he-input-border-radius, 3px);
            }

            #inp-main:hover, #inp-main:focus {
                border-color: var(--he-input-clr-border-hover, grey);
            }

            #inp-main[valid=false] {
                border-color: var(--he-input-clr-border-invalid, indianred);
            }

            @keyframes button-loading-spinner {
                from {
                    transform: rotate(0turn);
                }

                to {
                    transform: rotate(1turn);
                }
            }
        `);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.autocomplete = false;
        this.input.id = 'inp-main';

        shadow.append(this.input);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        this.internals = this.attachInternals();
        this.input.onchange = () => this.inputChangedCallback.bind(this)();
        this.value = this.innerHTML;
    }

    focus() {
        this.input.focus();
    }

    /**
     * @returns boolean
     */
    checkValidity() {
        const validity = this.input.validity;
        if (validity.valid) {
            this.input.setAttribute('valid', true);
        } else {
            this.input.setAttribute('valid', false);
        }

        const reportSelector = this.getAttribute('report-invalid');
        if (reportSelector) {
            console.assert(
                this.id && this.id !== '',
                'The input cannot report its validity if it has no ID'
            );
            const id = '#' + this.id;
            const elems = document.querySelectorAll(reportSelector);
            for (const elem of elems) {
                const validList = elem.getAttribute('input-invalid') ?? '';
                let validSet = new Set(validList.split(' '));
                if (validity.valid) {
                    validSet.delete(id)
                } else {
                    validSet.add(id);
                }

                if (validSet.size === 0) {
                    elem.removeAttribute('input-invalid');
                    continue;
                }

                elem.setAttribute('input-invalid', Array.from(validSet).join(' '));
            }
        }

        return validity.valid;
    }

    formResetCallback() {
        this.input.value = "";
    }

    set name(val) {
        this.setAttribute('name', val);
    }

    get name() {
        return this.getAttribute('name');
    }

    set value(val) {
        this.input.value = val;
        this.internals.setFormValue(val);
    }

    get value() {
        return this.input.value;
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'type':
                if (newValue === 'hidden') {
                    this.style.display = 'none';
                } else {
                    this.style.display = '';
                }
            default:
                if (newValue) {
                    this.input.setAttribute(name, newValue);
                } else {
                    this.input.removeAttribute(name);
                }
                break;
        }
    }

    inputChangedCallback() {
        if (this.checkValidity()) {
            this.internals.setFormValue(this.input.value);
        }
    }
}

class HeliumPopover extends HTMLElement {
    static observedAttributes = [
        'attach',
        'position',
        'open,',
        'trigger',
    ];
    /** @type {HTMLDivElement} */
    popover;
    /** @type {?HTMLElement} */
    attach;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            :host {
                border: 1px solid black;
                position: fixed;
                margin-top: var(--he-popover-outer-gap, 0.2rem);
                margin-buttom: var(--he-popover-outer-gap, 0.2rem);
                box-shadow: 1px 1px 5px #808080c9;
                z-index: 10;
            }

        `);

        this.popover = document.createElement('div');
        this.popover.id = 'popover';
        this.popover.style.display = 'none';

        const slot = document.createElement('slot');
        slot.name = 'content';
        this.popover.append(slot);

        shadow.append(this.popover);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        const attachElem = this.getAttribute('attach');
        if (attachElem == null) {
            throw new Error('Ho attachment element defined!');
        }

        this.attach = document.querySelector(attachElem);
        if (this.attach == null) {
            throw new Error('Attachment element not found!');
        }

        window.addEventListener('click', () => this.hide.bind(this)())
        this.addEventListener('click', (e) => e.stopPropagation())

        const trigger = this.getAttribute('trigger') ?? 'click';
        this.attach.addEventListener(trigger, (e) => this.triggeredCallback.bind(this)(e));
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'open':
                if (newValue == null || newValue === 'false') {
                    this.popover.hide();
                } else {
                    this.popover.show();
                }

                break;
            default:
                break;
        }
    }

    hide() {
        this.removeAttribute('open');
        this.moveToTarget(this.attach, 'bottom-right');
        this.popover.style.display = 'none';
    }

    show() {
        this.moveToTarget(this.attach, 'bottom-right');
        this.popover.style.display = '';
        this.setAttribute('open', 'true');
    }

    /**
     * 
     * @param {InputEvent} e 
     * @returns void
     */
    triggeredCallback(e) {
        e.stopPropagation();
        const open = this.getAttribute('open')
        if (open == null || open === 'false') {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * @param {HTMLElement} elem 
     * @returns void
     */
    moveToTarget(elem, position) {
        const rect = elem.getBoundingClientRect();
        this.style.left = rect.left + 'px';
        this.style.top = rect.top + 'px';

        switch (position) {
            case 'bottom-right':
                this.style.left = rect.left + 'px';
                this.style.top = rect.bottom + 'px';
                break;
            default:
                throw new Error('Invalid position');
        }

    }
}

class HeliumSelect extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'open',
        'search',
    ];
    /** @type {HTMLDivElement} */
    popover;
    /** @type {HeliumInput} */
    filter;
    /** @type {HTMLElement} */
    options;
    /** @type {ElementInternals} */
    internals;
    /** @type {number | TimerHandler} */
    _filterTimeout = 0;
    /** @type {boolean} This flag prevents recursive calls in popover callback */
    _disableAttrCallback = false;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals();

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            :host {
                height: fit-content;
                width: fit-content;
            }

            #inp {
                position: relative;
                background-color: var(--he-select-clr-bg, whitesmoke);
                border: 1px solid lightgrey;
                width: 100%;
                padding: 0.3rem 0.4rem;
                font-size: var(--he-select-fs, 14px);
                border-radius: 3px;
                outline: none;
                text-align: left;
                padding-right: 25px;
                text-wrap: nowrap;
            }

            #inp:hover, #inp:focus {
                cursor: pointer;
                border-color: var(--he-select-clr-border-hover, grey);
            }

            #inp::after {
                content: "";
                position: absolute;
                width: 4px;
                height: 4px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 2px solid transparent;
                border-bottom-color: var(--he-select-clr-arrow, black);
                border-right-color: var(--he-select-clr-arrow, black);
                transform: rotate(45deg) translateY(-2.5px);
            }

            #popover {
                inset: unset;
                outline: none;
                border: 1px solid grey;
                border-radius: var(--he-select-border-radius, 3px);
            }

            #cont-options {
                display: flex;
                flex-direction: column;
                background-color: var(--he-select-clr-bg, white);
                max-height: 300px;
                overflow: auto;
                overscroll-behavior: contain;
            }

            #cont-options option {
                padding: 5px 4px;
                border-radius: 3px;
            }

            #cont-options option[selected] {
                background-color: var(--he-select-clr-bg-hover, whitesmoke);
            }

            #cont-options option:hover:not(:disabled) {
                background-color: var(--he-select-clr-bg-hover, whitesmoke);
                cursor: pointer;
            }

            #filter {
                --he-input-border-radius: 2px;
                width: 100%;
            }
        `);

        this.input = document.createElement('button');
        this.input.id = 'inp';
        this.input.setAttribute('popovertarget', 'popover');

        this.filter = document.createElement('he-input');
        this.filter.id = 'filter';
        this.filter.style.display = 'none';
        this.filter.onkeyup = () => this.changedFilterCallback.bind(this)();

        //this.popover = document.createElement('he-popover');
        this.popover = document.createElement('div');
        this.popover.id = 'popover';
        this.popover.popover = '';
        this.popover.append(this.filter);

        this.popover.addEventListener("beforetoggle", (e) => this.beforetoggledPopoverCallback.bind(this)(e));
        this.popover.addEventListener("toggle", (e) => this.toggledPopoverCallback.bind(this)(e));

        shadow.append(this.popover);
        shadow.append(this.input);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        if (this.id == null || this.id === '') {
            throw new Error('This elements needs an ID!');
        }
        this.popover.setAttribute('attach', '#' + this.id);

        this.options = document.createElement('div');
        this.options.id = 'cont-options';
        this.options.slot = 'content';

        for (const opt of this.querySelectorAll('option')) {
            opt.onclick = (e) => this.clickedOptionCallback.bind(this)(e);
            this.options.append(opt);
        }

        // This is an empty whitespace character. 
        // It keeps the correct height of the input element.
        this.input.innerHTML = '‎';
        this.popover.append(this.options);
        this.select(0);
    }

    changedFilterCallback() {
        window.clearTimeout(this._filterTimeout);

        this._filterTimeout = setTimeout(() => {
            const filterVal = this.filter.value.toLowerCase();

            for (const option of this.options.children) {
                if (filterVal.length === 0 || (option.value !== '' && option.innerText.toLowerCase().includes(filterVal))) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            }
        }, 500);
    }

    beforetoggledPopoverCallback(e) {
        this._disableAttrCallback = true
        if (e.newState === "open") {
            this.setAttribute('open', '');
            this.popover.style.visibility = 'hidden';
        } else {
            heEnableBodyScroll();
            this.removeAttribute('open');
        }
        this._disableAttrCallback = false;
    }

    toggledPopoverCallback(e) {
        if (e.newState === "open") {
            let positionDefault = 'bottom-right';
            if (heSpaceBelow(this) < this.popover.offsetHeight + 20) {
                positionDefault = 'top-right';
            }
            const position = this.getAttribute('position') ?? positionDefault;
            hePositionRelative(this.popover, this.input, position, 6);
            // Manually compensate for the margins with the number
            this.popover.style.width = this.input.offsetWidth - 7 + 'px';
            heDisableBodyScroll();
            this.popover.style.visibility = '';
            this.filter.focus();
        } else {
            this.filter.value = '';

            for (const option of this.options.children) {
                option.style.display = '';
            }
        }
    }

    /** 
     * @param {number} optionIndex
     * @returns void
     */
    select(optionIndex) {
        const option = this.options.children[optionIndex];
        console.assert(option != null, 'No option with the given index!');
        this._select(option);
    }

    /** 
     * @param {HTMLOptionElement} option
     * @returns void
     */
    _select(option) {
        this.input.innerHTML = option.innerHTML;
        this.value = option.value;
        if (this.selection != null) {
            this.selection.removeAttribute('selected');
        }
        this.selection = option;
        this.selection.setAttribute('selected', '');
        this.internals.setFormValue(this.value);
    }

    open() {
        this.popover.showPopover();
    }

    close() {
        this.popover.hidePopover();
    }

    toggle() {
        this.popover.togglePopover();
    }

    clickedOptionCallback(e) {
        this.popover.hidePopover();
        const target = e.currentTarget;
        this._select(target);
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        if (this._disableAttrCallback) {
            return;
        }
        switch (name) {
            case 'open':
                if (newValue == null || newValue === 'false') {
                    this.popover.hidePopover();
                } else {
                    this.popover.showPopover();
                }
                break;
            case 'filter':
                if (newValue == null || newValue === 'false') {
                    this.filter.style.display = "none";
                } else {
                    this.filter.style.display = "";
                }
            default:
                break;
        }
    }
}

class HeliumToast extends HTMLElement {
    static observedAttributes = [
        'position',
    ];
    /** @type {HTMLDivElement} */
    $contToasts;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals();

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            :host {
                position: fixed;
                top: unset;
                right: unset;
                left: 50%;
                bottom: 10px;
                transform: translateX(-50%);
                width: 300px;
            }

            :host([position=bottom-right]) {
                top: unset;
                left: unset;
                bottom: 10px;
                right: 10px;
                transform: unset;
            }

            :host([position=bottom-left]) {
                top: unset;
                right: unset;
                bottom: 10px;
                left: 10px;
                transform: unset;
            }

            :host([position=top-left]) {
                bottom: unset;
                right: unset;
                top: 10px;
                left: 10px;
                transform: unset;
            }

            :host([position=top-right]) {
                bottom: unset;
                left: unset;
                top: 10px;
                right: 10px;
                transform: unset;
            }

            :host([position=top]) {
                bottom: unset;
                right: unset;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
            }

            #contToasts {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            #toast {
                border: 1px solid grey;
                border-radius: var(--he-toast-radius-border, 3px);
                background-color: var(--he-toast-clr-bg, white);
                z-index: 10;
            }

            #bar {
                width: 100%;
                height: 5px;
                background-color: red;
                margin-left: auto;
                margin-right: auto;
            }

            #bar[type=warn] {
                background-color: var(--he-toast-bg-bar-warn, orange);
            }

            #bar[type=error] {
                background-color: var(--he-toast-bg-bar-error, indianred);
            }

            #bar[type=success] {
                background-color: var(--he-toast-bg-bar-success, seagreen);
            }

            #contMain {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #contText {
                padding: 1rem 2rem;
                font-size: 16px;
            }

            #btnClose {
                border-radius: 50%;
                font-size: 20px;
                font-weight: 500;
                margin-right: 10px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                text-align: center;
                vertical-align: middle;
            }

            #btnClose:hover {
                background-color: whitesmoke;
            }
        `);

        this.$contToasts = document.createElement('div');
        this.$contToasts.id = 'contToasts';

        shadow.append(this.$contToasts);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
    }

    /**
     * @param {string} content
     * @param {null|'info'|'warn'|'error'} type 
     * @returns {HTMLDivElement}
     */
    _renderToast(content,type) {
        const duration = this.getAttribute('timeout-ms') ?? 4000;

        const $toast = document.createElement('div');
        $toast.id = 'toast';

        const $bar = document.createElement('div');
        $bar.id = 'bar';
        $bar.style.width = '0%';
        $bar.setAttribute('type', type);
        const animation = $bar.animate(
            [
                { width: '100%' },
                { width: '0%' },
            ], {
                duration: duration,
            }
        )
        animation.onfinish = () => this.hideToast($toast);
        $toast.append($bar);

        const $contMain = document.createElement('div');
        $contMain.id = 'contMain';
        $toast.append($contMain);

        const $contText = document.createElement('div');
        $contText.id = 'contText';
        $contText.innerHTML = content;
        $contMain.append($contText);

        const $btnClose = document.createElement('div');
        $btnClose.id = 'btnClose';
        $btnClose.onclick = () => this.hideToast($toast);
        $btnClose.innerHTML = 'x';

        $contMain.append($btnClose);

        return $toast;
    }

    showToast(message, type) {
        const $toast = this._renderToast(message, type);
        $toast.animate(
            [
                { opacity: '0' },
                { opacity: '1' },
            ], {
                duration: 200,
            }
        )

        const position = this.getAttribute('position') ?? '';
        if (position.includes('top')) {
            this.$contToasts.prepend($toast);
        } else {
            this.$contToasts.append($toast);
        }
    }

    hideToast($toast) {
        const animation = $toast.animate(
            [
                { opacity: '1' },
                { opacity: '0' },
            ], {
                duration: 200,
            }
        )
        animation.onfinish = () => $toast.remove();
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            default:
                break;
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-dialog", HeliumDialog);
    customElements.define("he-form-dialog", HeliumFormDialog);
    customElements.define("he-tabs", HeliumTabs);
    customElements.define("he-select", HeliumSelect);
    customElements.define("he-help", HeliumHelp);
    customElements.define("he-menu", HeliumMenu);
    customElements.define("he-button", HeliumButton);
    customElements.define("he-table", HeliumTable);
    customElements.define("he-check", HeliumCheck);
    customElements.define("he-input", HeliumInput);
    customElements.define("he-popover", HeliumPopover);
    customElements.define("he-toast", HeliumToast);

    document.addEventListener("he-toast", function(e) {
        showToastTemp(e);
    })

    document.addEventListener("he-toast-error", function(e) {
        showToastTemp(e, 'error');
    })

    document.addEventListener("he-toast-warn", function(e) {
        showToastTemp(e, 'warn');
    })

    document.addEventListener("he-toast-success", function(e) {
        showToastTemp(e, 'success');
    })

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
});
