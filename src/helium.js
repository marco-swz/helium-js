/*
                             __         .__         .__
___  ______   ____   _______/  |______  |  | ______ |__| ____   ____
\  \/ /  _ \_/ __ \ /  ___/\   __\__  \ |  | \____ \|  |/    \_/ __ \
 \   (  <_> )  ___/ \___ \  |  |  / __ \|  |_|  |_> >  |   |  \  ___/
  \_/ \____/ \___  >____  > |__| (____  /____/   __/|__|___|  /\___  >
                 \/     \/            \/     |__|           \/     \/

Description:
Helium is a custom webcomponent library, containing useful UI elements for various use cases.
The content and functionality will grow as needed.

So far, the following UI elements are implemented:
- Dialog: A dialog with better handling than the native `dialog`
- Tabs: Switch between predefined pages using tabs
- Select: A wrapper around `select2`

File: helium.js
Author: Marco Schwarz | U681181
Version: 1.0.0
Creation: 2024-08-06 15:31:40
Update: 2024-08-06 15:31:40
UpdateHistory:
v1.0.0 Creation

*/

class HeliumDialog extends HTMLElement {
    static observedAttributes = [
        "he-open",
        "he-title",
        "he-close-icon",
        "he-close-button",
    ];
    /** @type {HTMLDialogElement} */
    dialog;
    /** @type {HTMLDivElement} */
    title;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        let sheet = new CSSStyleSheet();

        sheet.replaceSync(`
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
                background-color: var(--he-color-accent, #0082b4);
                color: white;
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
        if (name === "he-open") {
            if (newValue === "true") {
                this.dialog.showModal();
            } else {
                this.dialog.close();
            }
        }

        if (name === "he-title") {
            this.title.innerText = newValue;
        }

        if (name === "he-close-button") {
            if (newValue === "true") {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'visible';
                this.shadowRoot.querySelector('#he-diag-footer').style.visibility = 'visible';
            } else {
                this.shadowRoot.querySelector('#he-btn-close').style.visibility = 'collapse';
                this.shadowRoot.querySelector('#he-diag-footer').style.visibility = 'collapse';
            }
        }

        if (name === "he-close-icon") {
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
        "he-tab",
    ];
    /** @type {HTMLElement} */
    navBar;
    /** @type {Number} The index of the currently visible tab */
    tabNrVisible;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        let sheet = new CSSStyleSheet();

        sheet.replaceSync(`
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
            case 'he-tab':
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
            const tabTitle = elem.getAttribute('he-title') ?? `Tab ${tabNr}`;

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

        self.showTab(self.getAttribute('he-tab') ?? 0);
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

class HeliumSelect extends HTMLElement {
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
        sheet.replaceSync(`
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
        sheet.replaceSync(`
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
        'he-loading',
        'he-show-dialog',
        'he-close-dialog',
    ];
    /** @type {HTMLInputElement} */
    button;
    /** @type {?EventListener} */
    listenerClick = null;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(`
:host {
    --he-color-accent: #0082b4;
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
    background-color: white;
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

#he-button:hover:enabled:not([he-loading]), 
#he-button:active:enabled:not([he-loading]), 
#he-button:focus:enabled:not([he-loading]) {
    cursor: pointer;
    text-shadow: 0px 0px 0.3px #0082b4;
    border-color: var(--he-color-accent);
    color: var(--he-color-accent);
}

#he-button:hover:enabled:not([he-loading]){
    background-color: #0082b40d;
}

#he-button[he-loading] {
    background-color: #d9d9d9;
    color: #6666668c;
    cursor: no-drop;
    text-shadow: none;
}

#he-button[he-loading]::after {
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
    border-top-color: var(--he-color-accent);
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
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
            case 'he-show-dialog':
                this.removeEventListener('click', this._showDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._showDialog);
                }
                break;
            case 'he-close-dialog':
                this.removeEventListener('click', this._hideDialog);
                if (newValue !== null) {
                    this.listenerClick = this.addEventListener('click', this._closeDialog());
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
            this.setAttribute('he-loading', true);
        } else {
            this.removeAttribute('he-loading');
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

    _showDialog() {
        const diag = document.querySelector(this.getAttribute('he-show-dialog'));
        diag.showModal();
    }

    _closeDialog() {
        const diag = document.querySelector(this.getAttribute('he-close-dialog'));
        diag.close();
    }
}

class HeliumFormDialog extends HTMLElement {
    static observedAttributes = [
        "he-open",
        "he-title",
        "he-close-icon",
        "he-close-button",
    ];
    /** @type {HeliumDialog} */
    dialog;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        let sheet = new CSSStyleSheet();

        sheet.replaceSync(`
            #he-form {
                display: grid;
                grid-template-columns: max-content 1fr;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            #he-form input, #he-form select {
                font-size: 16px;
                padding: 3px 7px;
            }

            #footer-diag-edit he-button:first-child {
                margin-right: 0.5rem;
            }

            .invalid-input {
                border-color: red;
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
            ?? this.getAttribute('he-endpoint')
            ?? this.getAttribute('action');

        fetchArgs = fetchArgs ?? {};
        fetchArgs.method = fetchArgs.method
            ?? this.getAttribute('he-method')
            ?? this.getAttribute('method')
            ?? 'POST';
        fetchArgs.headers = fetchArgs.headers
            ?? this.getAttribute('he-headers');
        fetchArgs.body = JSON.stringify(values);

        callbackBefore = callbackBefore ?? this.getAttribute('he-before-submit');
        if (callbackBefore) {
            console.log(callbackBefore)
            fetchArgs = eval(callbackBefore + '(fetchArgs)');
        }

        callbackAfter = callbackAfter ?? this.getAttribute('he-after-submit');

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
        if (pattern == null) {
            return true;
        }

        const regex = new RegExp(pattern);
        return regex.test(input.value);
    }

    clear() {
        for (const input of this.form.querySelectorAll('input')) {
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

            if (entry.options && entry.options.length > 0) {
                let select = document.createElement('select');
                select.id = id;
                select.name = entry.name;
                if (!entry.required) {
                    select.append(document.createElement('option'));
                }

                for (const option of entry.options) {
                    select.append(option.cloneNode(true));
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
        'he-endpoint',
        'he-pagination',
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
        sheet.replaceSync(`
        table {
            border-spacing: 0;
        }

        thead {
            position: sticky;
            top: 1px;
            z-index: 100;
        }

        thead th {
            background-color: #0082b4;
            color: white;
            font-weight: 500;
            padding: 7px 15px;
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
            gap: 0.4rem;
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


        thead input[type=search], input[type=date], select {
            margin: 0;
            padding: 0px 7px;
            font-size: 14px;
            font-weight: 500;
            height: 20px;
            outline: none;
            border: 0;
            background-color: #00000026;
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
        }
        
        thead .span-colname {
            position: absolute;
            left: 0.3rem;
            pointer-events: none;
            transition: 0.2s ease all;
            top: 0px;
            font-weight: 600;
        }

        .inp-filter {
            color: white;
        }

        .inp-filter:focus ~ .span-colname, inp-filter:not(:placeholder-shown) ~ .span-colname {
            top: -15px;
            font-size: 13px;
            opacity: 1;
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
            let colName = column.getAttribute('he-column') ?? column.innerText;

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
            column.setAttribute('he-column', colName);
            contHeaderCell.append(contSorters);
            column.append(contHeaderCell);
            rowColNames.append(column);

            let cellFilter = document.createElement('td');

            const options = this._getColumnOptions(column);

            if (options && options.length > 0) {
                let selFilter = document.createElement('select');
                selFilter.id = 'filter-' + colName;
                selFilter.name = colName;
                selFilter.classList.add('inp-filter');
                selFilter.onchange = (e) => this._filterChangeCallback(e);
                selFilter.append(document.createElement('option'));
                for (const option of options) {
                    selFilter.append(option.cloneNode(true));
                }
                contFilter.append(selFilter);
            } else {
                let inpFilter = document.createElement('input');
                inpFilter.id = 'filter-' + colName;
                inpFilter.type = 'search';
                inpFilter.name = colName;
                inpFilter.placeholder = ' ';
                inpFilter.classList.add('inp-filter');
                inpFilter.value = column.getAttribute('he-filter') ?? '';
                inpFilter.onchange = (e) => this._filterChangeCallback(e);
                contFilter.prepend(inpFilter);
            }

            rowFilters.append(cellFilter);
        }

        this.checkAll = document.createElement('input');
        this.checkAll.type = 'checkbox';
        this.checkAll.id = 'check-all';
        this.checkAll.onchange = (e) => this._checkAllCheckCallback.bind(this)(e);

        // Empty `<th>` for checkboxes
        rowColNames.prepend(document.createElement('th'));
        let cellCheckAll = document.createElement('td');
        cellCheckAll.append(this.checkAll);

        rowFilters.prepend(cellCheckAll);

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
                const data = cell.getAttribute('he-data') ?? cell.innerText;
                const colName = column.getAttribute('he-column') ?? column.innerText;
                rowData[colName] = data;
            }
            let rowRendered = this._renderRow(rowData);
            this.body.append(rowRendered);
        }
        table.append(this.body);

        this.diagEdit = this._renderDialogEdit();
        shadow.append(this.diagEdit);
        this.innerHTML = '';
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
        let selector = column.getAttribute('he-options');

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
            values.push([row.children[colIdx].getAttribute('he-data'), row]);
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
            filter.parentElement.parentElement.children,
            filter.parentElement
        );
        for (const row of this.body.children) {
            const data = row.children[colIdx].getAttribute('he-data');
            let hideMask = row.getAttribute('he-mask') ?? 0;

            if (data.toLowerCase().includes(filterValue)) {
                // Clear bit bit for column filter
                hideMask &= ~1 << colIdx;
            } else {
                // Set bit bit for column filter
                hideMask |= 1 << colIdx;
            }

            row.setAttribute('he-mask', hideMask);

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
        return this.shadowRoot.querySelectorAll('th[he-column]')
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
            let colName = column.getAttribute('he-column');
            let colType = column.getAttribute('he-type');
            let cell = document.createElement('td');
            let val = data[colName] ?? '';
            cell.innerHTML = this._renderCellText(colType, val);
            cell.setAttribute('he-data', val);
            cell.title = val;

            row.append(cell);
        }

        return row;
    }

    showDialogNew() {
        this.diagEdit.clear();
        this.editRequestType = 'POST';
        this.diagEdit.setAttribute('he-title', 'Erstellen');
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
        this.diagEdit.setAttribute('he-title', 'Bearbeiten');
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
        this.diagEdit.setAttribute('he-title', 'Duplizieren');
        this.diagEdit.showModal();
    }

    deleteChecked() {
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

        if (!window.confirm(`Es werden ${numDelete} Zeilen gelöscht.\nSind Sie sicher?`)) {
            return;
        }

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

            const colName = column.getAttribute('he-column');
            data[colName] = returnDisplayValues
                ? cell.innerText
                : cell.getAttribute('he-data');
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
            .catch(errorMsg => { console.log(errorMsg); });

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
            case 'he-endpoint':
                this.endpoint = newValue;
                break;

            case 'he-pagination':
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
            const colName = columns[i].getAttribute('he-column');
            const colType = columns[i].getAttribute('he-type') ?? 'text';
            const val = newData[colName];
            if (val == null) {
                continue;
            }

            // `+1` because of checkbox
            let cell = row.children[i + 1];
            cell.setAttribute('he-data', val);
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

    _renderDialogEdit() {
        let data = [];
        for (let column of this._getColumns()) {
            const options = this._getColumnOptions(column);
            let optionValues = null;
            if (options && options.length > 0) {
                optionValues = [];
                for (const option of options) {
                    optionValues[option.name] = option.innerHTML;
                }
            }
            data.push({
                name: column.getAttribute('he-column'),
                required: column.getAttribute('he-required') === 'true',
                label: column.querySelector('span').innerHTML,
                placeholder: column.getAttribute('he-default'),
                pattern: column.getAttribute('he-pattern'),
                options: optionValues,
            })
        }

        /** @type {HeliumFormDialog} */
        let dialog = document.createElement('he-form-dialog');
        dialog.renderRows(data);

        dialog.setAttribute('he-endpoint', this.endpoint);
        dialog.setAttribute('he-before-submit', `document.querySelector('#${this.id}').formEditBeforeSubmitCallback`);
        dialog.setAttribute('he-after-submit', `document.querySelector('#${this.id}').formEditAfterSubmitCallback`);
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
        request.method = this.editRequestType,
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


document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-dialog", HeliumDialog);
    customElements.define("he-form-dialog", HeliumFormDialog);
    customElements.define("he-tabs", HeliumTabs);
    customElements.define("he-select", HeliumSelect);
    customElements.define("he-help", HeliumHelp);
    customElements.define("he-menu", HeliumMenu);
    customElements.define("he-button", HeliumButton);
    customElements.define("he-table", HeliumTable);

    document.addEventListener("he-dialog-new", function(evt) {
        /** @type {HeliumDialog} */
        let diag = document.querySelector('#he-dialog-temp');
        if (diag === null) {
            diag = document.createElement('he-dialog');
            diag.id = 'he-dialog-temp';
            document.body.append(diag);
        }

        if (evt.detail && evt.detail.value) {
            diag.setBody(evt.detail.value);
        }
        diag.show();
    })
});
