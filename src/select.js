import sheet from './select.css';
import { heSpaceBelow, hePositionRelative, heEnableBodyScroll, heDisableBodyScroll } from "./utils.js";

export class HeliumSelect extends HTMLElement {
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
            this.setAttribute('name', val)
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
            default:
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

        if (this.hasAttribute('open')) {
            this.open = true;
        }
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
            heDisableBodyScroll();
            this.$popover.style.visibility = '';
            this.$filter.focus();
        } else {
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
