import { h as heSpaceBelow, a as hePositionRelative, b as heEnableBodyScroll } from './utils-BGzlNXdX.js';

const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    height: 1.8rem;\n    width: fit-content;\n    font-size: 14px;\n    min-width: 60px;\n    display: inline-block;\n}\n\n:host([disabled]) {\n    pointer-events: none;\n    color: hsl(from var(--he-select-clr, black) h s calc(l + 50))\n}\n\n#inp {\n    position: relative;\n    background-color: var(--he-select-clr-bg, whitesmoke);\n    border: 1px solid lightgrey;\n    width: 100%;\n    height: inherit;\n    min-width: inherit;\n    padding: 0.3rem 0.4rem;\n    border-radius: 3px;\n    outline: none;\n    text-align: left;\n    padding-right: 25px;\n    text-wrap: nowrap;\n    color: inherit;\n}\n\n#inp:hover {\n    transition:\n        border-color 0.2s;\n    cursor: pointer;\n    border-color: var(--he-select-clr-border-hover, grey);\n}\n\n#inp::after {\n    content: \"▼\";\n    position: absolute;\n    font-size: 10px;\n    width: fit-content;\n    height: fit-content;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto 4px auto auto;\n}\n\n#popover {\n    inset: unset;\n    outline: none;\n    border: 1px solid grey;\n    border-radius: var(--he-select-border-radius, 3px);\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n    width: min-content;\n}\n\n#cont-options {\n    display: flex;\n    flex-direction: column;\n    background-color: var(--he-select-clr-bg, white);\n    max-height: 300px;\n    overflow: auto;\n    overscroll-behavior: contain;\n}\n\n#cont-options option {\n    padding: 5px 10px;\n    border-radius: 3px;\n    text-align: left;\n    width: 100%;\n    width: -moz-available;          /* WebKit-based browsers will ignore this. */\n    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */\n    width: fill-available;\n}\n\n#cont-options option[selected] {\n    background-color: var(--he-select-clr-bg-hover, whitesmoke);\n}\n\n#cont-options option:hover:not(:disabled) {\n    background-color: var(--he-select-clr-bg-hover, whitesmoke);\n    cursor: pointer;\n}\n\n#filter {\n    --he-input-border-radius: 2px;\n    width: 100%;\n    min-width: 50px;\n}\n\n");

class HeliumSelect extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'open',
        'filter',
        'disabled',
    ];
    /** @type {HTMLDivElement} */
    $popover;
    /** @type {HeliumInput} */
    $filter;
    /** @type {HTMLElement} */
    $options;
    /** @type {HTMLElement} */
    $input;
    /** @type {ElementInternals} */
    internals;
    /** @type {number | TimerHandler} */
    _filterTimeout = 0;
    ignoreAttributes = false;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals();

        this.$input = document.createElement('button');
        this.$input.id = 'inp';
        this.$input.setAttribute('popovertarget', 'popover');

        this.$filter = document.createElement('he-input');
        this.$filter.id = 'filter';
        this.$filter.style.display = 'none';
        this.$filter.onkeyup = () => this._changedFilterCallback.bind(this)();

        this.$popover = document.createElement('div');
        this.$popover.id = 'popover';
        this.$popover.popover = '';
        this.$popover.append(this.$filter);

        this.$popover.addEventListener("beforetoggle", (e) => this._beforetoggledPopoverCallback.bind(this)(e));
        this.$popover.addEventListener("toggle", (e) => this._toggledPopoverCallback.bind(this)(e));

        this.$options = document.createElement('div');
        this.$options.id = 'cont-options';
        this.$options.slot = 'content';
        this.$popover.append(this.$options);

        shadow.append(this.$popover);
        shadow.append(this.$input);
        shadow.adoptedStyleSheets = [sheet];
    }

    /**
     * Disables or enables the select.
     * @type {boolean}
     */
    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', true);
        } else {
            this.removeAttribute('disabled');
        }
    }

    get disabled() {
        return this.getAttribute('disabled') !== null;
    }

    /**
     * Gets or sets the filter attribute.
     * The filter allows searching the options of the select.
     * @type {boolean}
     */
    set filter(val) {
        if (val) {
            this.setAttribute('filter', true);
        } else {
            this.removeAttribute('filter');
        }
    }

    get filter() {
        return this.getAttribute('filter') !== null;
    }

    /** 
     * Gets or sets the name of the element for form submissions.
     * @type {string} 
     */
    set name(val) {
        if (val) {
            this.setAttribute('name', val);
        } else {
            this.removeAttribute('name');
        }
    }

    get name() {
        return this.getAttribute('name');
    }


    /** 
     * Gets or sets the `open` state of the element.
     * If `open` is set, the options are shown to the user.
     * @type {boolean} 
     */
    set open(val) {
        if (val) {
            this.$popover.showPopover();
        } else {
            this.$popover.hidePopover();
        }
    }

    get open() {
        return this.getAttribute('open') !== null;
    }

    set value(val) {
        if (val) {
            const $option = this.$options.querySelector(`[value="${val}"]`);
            if ($option == null)  {
                throw new Error('No option found with provided value!');
            }
            this._select($option);
        }
    }

    get value() {
        return this.$selection ? this.$selection.value : '';
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        if (this.ignoreAttributes) {
            return;
        }
        switch (name) {
            case 'open':
                if (newValue) {
                    this.$popover.showPopover();
                } else {
                    this.$popover.hidePopover();
                }
                break;
            case 'filter':
                if (newValue == null || newValue === 'false') {
                    this.$filter.style.display = "none";
                } else {
                    this.$filter.style.display = "";
                }
                break;
            case 'disabled':
                if (newValue) {
                    this.internals.setFormValue(null);
                } else {
                    this.internals.setFormValue(this.value);
                }
                break;
        }
    }

    /**
     * Checks if the value of the select is valid and
     * reports the validity to external elements.
     * @returns {boolean}
     */
    checkValidity() {
        return true;
    }

    connectedCallback() {
        for (const $opt of this.querySelectorAll('option')) {
            $opt.onclick = (e) => this._clickedOptionCallback.bind(this)(e);
            this.$options.append($opt);
        }

        this.select(0);
    }

    /**
     * The native callback function for resetting the input a part of a form.
     */
    formResetCallback() {
        let $optionSelected = null;
        for (const $opt of this.$options.children) {
            if (!$opt.hidden && !$opt.disabled) {
                $optionSelected = $opt;
                break;
            }
        }

        if ($optionSelected == null) {
            this.$input.innerHTML = '';
            this.internals.setFormValue(null);
            return;
        }

        this._select($optionSelected);
    }

    getOptions() {
        return this.$options.children;
    }

    /**
     * 
     * @param {Array<string>} [values=null]
     * @returns {Self}
     */
    hideOptions(values=null) {
        let $sel = null;
        for (let $el of this.$options.children) {
            if (values == null || values.includes($el.value)) {
                $el.hidden = true;
            } else {
                $el.hidden = false;
                if ($sel == null) {
                    $sel = $el;
                }
            }
        }

        if ($sel == null) {
            this.$input.innerHTML = '';
            this.internals.setFormValue(null);
        } else {
            this._select($sel);
        }
        return this;
    }

    /**
     * Replaces all options with the ones provided.
     * If the same value exists in the old and new options, the value is selected.
     * @param {Array<string>} newOptions A list of options
     * @param {?Object.<string, string>} displayMapping A mapping from value to text
     * @returns {Self}
     */
    replaceOptions(newOptions, displayMapping = null) {
        displayMapping = displayMapping ?? {};
        this.$options.innerHTML = '';
        const valOld = this.value;
        let $optSelect = null;
        for (const val of newOptions) {
            let $opt = document.createElement('option');
            $opt.value = val;
            $opt.innerHTML = displayMapping[val] ?? val;
            $opt.onclick = (e) => this._clickedOptionCallback.bind(this)(e);
            this.$options.append($opt);

            if (valOld === val) {
                $optSelect = $opt;
            }
        }
        if ($optSelect != null) {
            this._select($optSelect);
        } else {
            this.select(0);
        }
        return this;
    }

    /**
     * 
     * @param {?Array<string>} [values=null]
     * @returns {Self}
     */
    showOptions(values=null) {
        let $sel = null;
        for (let $el of this.$options.children) {
            if (values == null || values.includes($el.value)) {
                $el.hidden = false;
                if ($sel == null) {
                    $sel = $el;
                }
            }
        }

        $sel = this.$selection ?? $sel;

        if ($sel != null) {
            this._select($sel);
        }
        return this;
    }

    /** 
     * @param {number} optionIndex
     * @returns void
     */
    select(optionIndex) {
        if (this.$options.children.length === 0 && optionIndex === 0) {
            return;
        }
        const option = this.$options.children[optionIndex];
        console.assert(option != null, `No option with the given index ${optionIndex}!`);
        this._select(option);
    }

    toggle() {
        this.$popover.togglePopover();
    }

    _beforetoggledPopoverCallback(e) {
        this.ignoreAttributes = true;
        if (e.newState === "open") {
            this.$popover.style.visibility = 'hidden';
            this.setAttribute('open', true);
        } else {
            this.removeAttribute('open');
        }
        this.ignoreAttributes = false;
    }

    _changedFilterCallback() {
        window.clearTimeout(this._filterTimeout);

        this._filterTimeout = setTimeout(() => {
            let filterVal = this.$filter.value;
            if (filterVal) {
                filterVal.toLowerCase();
            }

            for (const option of this.$options.children) {
                if (filterVal.length === 0 || (option.value !== '' && option.innerText.toLowerCase().includes(filterVal))) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            }
        }, 500);
    }

    /** 
     * @param {HTMLOptionElement} $option
     * @returns void
     */
    _select($option) {
        this.$input.innerHTML = $option.innerHTML;
        if (this.$selection != null) {
            this.$selection.removeAttribute('selected');
        }
        this.$selection = $option;
        this.$selection.setAttribute('selected', '');

        if (!this.disabled) {
            this.internals.setFormValue(this.$selection.value);
        }
    }

    _toggledPopoverCallback(e) {
        if (e.newState === "open") {
            this.internals.states.add('open');

            let positionDefault = 'bottom-left';
            if (heSpaceBelow(this) < this.$popover.offsetHeight + 20) {
                positionDefault = 'top-left';
            }
            const position = this.getAttribute('position') ?? positionDefault;
            hePositionRelative(this.$popover, this.$input, position, 3);
            // Manually compensate for the margins with the number
            const compensation = 7;
            if (this.$popover.offsetWidth < this.$input.offsetWidth - compensation) {
                this.$popover.style.width = this.$input.offsetWidth - 7 + 'px';
            }
            this.$popover.style.visibility = '';
            this.$filter.focus();
        } else {
            this.internals.states.delete('open');
            this.$filter.value = '';

            for (const option of this.$options.children) {
                option.style.display = '';
            }

            heEnableBodyScroll();
        }
    }

    _clickedOptionCallback(e) {
        this.open = false;
        const target = e.currentTarget;
        this._select(target);

        this.dispatchEvent(new CustomEvent('change'));
    }

}

if (!customElements.get('he-select')) {
    customElements.define("he-select", HeliumSelect);
}

export { HeliumSelect };
