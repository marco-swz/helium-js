import sheet from './select.css';
import { heSpaceBelow, heCallOnOutsideClick } from "./utils.js";
import { HeliumPopover } from "./popover.js";

export class HeliumSelect extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'open',
        'filter',
        'disabled',
    ];
    /** @type {HeliumPopover} */
    $popover;
    /** @type {HTMLDivElement} */
    $popoverContent;
    /** @type {HeliumInput} */
    $filter;
    /** @type {HTMLElement} */
    $options;
    /** @type {HTMLElement} */
    $button;
    /** @type {HTMLDivElement} */
    $contButton;
    /** @type {ElementInternals} */
    internals;
    /** @type {number | TimerHandler} */
    _filterTimeout = 0;
    /** @type {function(InputEvent): void} The click handler to detect outside clicks. This should be cleaned up when closing */
    _handleClickDocument;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.internals = this.attachInternals();

        this.$contButton = document.createElement('div');
        this.$contButton.id = 'cont-button';
        shadow.append(this.$contButton);

        this.$popover = document.createElement('he-popover');
        this.$popover.id = 'popover';
        this.$popover.dismiss = 'manual';
        this.$popover.$anchor = this.$contButton;

        this.$popoverContent = document.createElement('div');
        this.$popoverContent.id = 'popover-content';
        this.$popoverContent.slot = 'content'
        this.$popover.append(this.$popoverContent);

        this.$filter = document.createElement('he-input');
        this.$filter.id = 'filter';
        this.$filter.style.display = 'none';
        this.$filter.oninput = (e) => this._handleChangeFilter.bind(this)(e);

        this.$button = document.createElement('button');
        this.$button.id = 'inp';
        this.$button.onclick = () => {
            this.open = true;
        };
        this.$contButton.append(this.$button);

        this.$options = document.createElement('div');
        this.$options.id = 'cont-options';
        this.$popoverContent.append(this.$options);

        this.onkeydown = (e) => this._handleKeydown(e);

        shadow.append(this.$popover);
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
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
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
        switch (name) {
            case 'open':
                if (newValue != null) {
                    this._showPopover();
                } else {
                    this._hidePopover();
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
                if (newValue != null) {
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

    /**
     * This callback function is triggered once the `he-select` is attached to the document.
     */
    connectedCallback() {
        switch (this.getAttribute('filter')) {
            case 'inline':
                this.$contButton.append(this.$filter);
                this.$filter.style.display = 'none';
                break;
            default:
                this.$popoverContent.prepend(this.$filter);
                break;
        }

        for (const $opt of this.querySelectorAll('option')) {
            $opt.onclick = (e) => this._handleClickOption.bind(this)(e);
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
            this.$button.innerHTML = '';
            this.internals.setFormValue(null);
            return;
        }

        this._select($optionSelected);
    }

    /**
     * Returns all option elements.
     * @returns {HTMLCollection}
     */
    getOptions() {
        return this.$options.children;
    }

    /**
     * Hides the provided options in the option list.
     * Hides all options if `null` passed. 
     * @param {Array<string>} [values=null] A list of option values to hide.
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
            this.$button.innerHTML = '';
            this.internals.setFormValue(null);
        } else {
            this._select($sel);
        }
        return this;
    }

    /**
     * Selects the next option.
     */
    nextOption(visualOnly=false) {
        let $elem = visualOnly 
            ? this.$highlight
            : this.$selection;

        if (!$elem) {
            if (visualOnly) {
                this._highlight(this.$options.firstChild);
            } else {
                this._select(this.$options.firstChild);
            }
            return;
        }

        let $next = $elem.nextSibling;
        while (true) {
            if ($elem.isSameNode($next)) {
                return;
            }

            if ($next == null) {
                $next = this.$options.firstChild;
                continue;
            }

            if (!$next.hidden) {
                break;
            }
            $next = $next.nextSibling;
        }
        if (visualOnly) {
            this._highlight($next);
            return;
        }
        this._select($next);
    }

    prevOption(visualOnly=false) {
        let $elem = visualOnly 
            ? this.$highlight
            : this.$selection;

        if (!$elem) {
            if (visualOnly) {
                this._highlight(this.$options.lastChild);
            } else {
                this._select(this.$options.lastChild);
            }
            return;
        }

        let $prev = $elem.previousSibling;
        while (true) {
            if ($elem.isSameNode($prev)) {
                return;
            }

            if ($prev == null) {
                $prev = this.$options.lastChild;
                continue;
            }

            if (!$prev.hidden) {
                break;
            }
            $prev = $prev.previousSibling;
        }
        if (visualOnly) {
            this._highlight($prev);
            return;
        }
        this._select($prev);
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
            $opt.onclick = (e) => this._handleClickOption.bind(this)(e);
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

    /**
     * Opens the select element if closed, closes it if open.
     * @returns {Self}
     */
    toggle() {
        this.$popover.togglePopover();
        return this;
    }

    /**
     * This callback is called when the filter value changes
     * @returns {void}
     */
    _handleChangeFilter() {
        window.clearTimeout(this._filterTimeout);

        this._filterTimeout = setTimeout(() => {
            let filterVal = this.$filter.value;
            if (filterVal) {
                filterVal.toLowerCase();
            }

            let $firstVisible = null;
            for (const $option of this.$options.children) {
                if (filterVal.length === 0 || ($option.value !== '' && $option.innerText.toLowerCase().includes(filterVal))) {
                    if ($firstVisible == null) {
                        $firstVisible = $option;
                    }
                    $option.hidden = false;
                } else {
                    $option.hidden = true;
                }
            }
            this._highlight($firstVisible);
        }, 250);
    }

    /**
     * This callback is called when an option is clicked.
     * @returns {void}
     */
    _handleClickOption(e) {
        this.open = false;
        const $target = e.currentTarget;
        this._select($target);

        this.dispatchEvent(new CustomEvent('change'));
    }

    /**
     * This callback handles all shortcuts.
     * @param {KeyboardEvent} e
     */
    _handleKeydown(e) {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.nextOption(true);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.prevOption(true);
                break;
            case 'Enter':
                if (this.open) {
                    e.preventDefault();
                    this._select(this.$highlight);
                    this._hidePopover();
                } else {
                    this.open = true;
                }

                break;
            case 'Escape':
                e.preventDefault();
                this._hidePopover();
                break;
        }
    }

    /**
     * This callback is responsible for hiding the popover
     * @returns {void}
     */
    _hidePopover() {
        if (this.getAttribute('filter') === 'inline') {
            this.$button.style.display = '';
            this.$filter.style.display = 'none';
        }
        this.$filter.value = '';
        this.$popover.hidePopover();
        document.removeEventListener('click', this._handleClickDocument);
    }
    
    _highlight($option) {
        if (this.$highlight) {
            this.$highlight.removeAttribute('highlighted');
        }
        if ($option == null) {
            return;
        }
        this.$highlight = $option;
        this.$highlight.setAttribute('highlighted', '');
    }

    /**
     * This callback is responsible for showing the popover.
     * @returns {void}
     */
    _showPopover() {
        if (this.getAttribute('filter') === 'inline') {
            this.$button.style.display = 'none';
            this.$filter.style.display = '';
        }

        let positionDefault = 'bottom-left';
        if (heSpaceBelow(this) < this.$popover.offsetHeight + 20) {
            positionDefault = 'top-left';
        }
        this._handleClickDocument = heCallOnOutsideClick([this.$popoverContent, this.$contButton], () => {
            this.open = false;
        });

        this.$popover.setAttribute('position', this.getAttribute('position') ?? positionDefault);
        this.$filter.value = '';
        this.showOptions();
        this.$popover.style.visibility = 'hidden';
        this.$popover.showPopover();
        let width = this.$options.getBoundingClientRect().width;
        let btnWidth = this.$contButton.getBoundingClientRect().width;
        if (btnWidth > width) {
            this.$options.style.width = btnWidth + 'px';
        }
        this.$popover.style.visibility = '';
        this._highlight(this.$selection);
        this.$filter.focus();
    }

    /** 
     * Selects a specific options given the option HTML element.
     * @param {?HTMLOptionElement} $option
     * @param {boolean} visalOnly If `true`, changes the selection only visually
     * @returns {void}
     */
    _select($option) {
        if (this.$selection) {
            this.$selection.removeAttribute('selected');
        }
        if ($option == null) {
            this.$selection = null;
            this.internals.setFormValue(null);
            this.$filter.value = '';
            return;
        }
        this.$button.innerHTML = $option.innerHTML;
        this.$selection = $option;
        this.$selection.setAttribute('selected', '');

        if (!this.disabled) {
            this.internals.setFormValue(this.$selection.value);
        }
    }
}

if (!customElements.get('he-select')) {
    customElements.define("he-select", HeliumSelect);
}
