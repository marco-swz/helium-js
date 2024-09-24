import { HeliumButton } from './button.js';
import { HeliumInput } from './input.js';
import { HeliumDialog } from './dialog.js';
import { HeliumSelect } from './select.js';
import sheet from './form_dialog.css';

export class HeliumFormDialog extends HTMLElement {
    static observedAttributes = [
        "open",
        "he-title",
        "close-icon",
    ];
    /** @type {HeliumDialog} */
    dialog;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

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
            ?? this.getAttribute('endpoint')
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
     * @param {HeliumInput} input
     * @returns boolean
     */
    _validateInput(input) {
        return input.checkValidity()

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
        this.form.reset();
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
                /** @type {HeliumSelect} */
                let select = document.createElement('he-select');
                select.id = id;
                select.name = entry.name;
                if (!entry.required) {
                    let option = document.createElement('option');
                    option.innerHTML = '‎';
                    select.append(option);
                }

                for (const [value, text] of Object.entries(entry.options)) {
                    const opt = document.createElement('option');
                    opt.value = value;
                    opt.innerHTML = text;
                    select.append(opt);
                }
                this.form.append(select);
            } else {
                let input = document.createElement('he-input');
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
            input.removeAttribute('invalid');
        } else {
            input.setAttribute('invalid', true);
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
     * @param {boolean} [reset=false] 
     * @returns Self
     */
    show(reset=false) {
        if (reset) {
            this.reset();
        }
        this.dialog.show(empty);
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

customElements.define("he-form-dialog", HeliumFormDialog);
