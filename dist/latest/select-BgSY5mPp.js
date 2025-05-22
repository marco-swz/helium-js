import { h as heSpaceBelow, a as heCallOnOutsideClick } from './utils-SP1Llz9F.js';
import './popover-DFROOrPY.js';

const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    --he-select-backgroundColor: whitesmoke;\n    --he-select-borderColor: lightgrey;\n    --he-select-borderWidth: 1px;\n    --he-select-borderRadius: 3px;\n    --he-select-hover-borderColor: grey;\n    --he-select-color: black;\n    --he-select-padding: 0.3rem 0.4rem;\n    --he-select-popover-borderRadius: 4px;\n    --he-select-popover-maxHeight: 300px;\n    --he-select-popover-maxWidth: 300px;\n    --he-select-popover-width: fit-content;\n    --he-select-popover-backgroundColor: white;\n    --he-select-option-hover-backgroundColor: whitesmoke;\n    --he-select-option-selected-backgroundColor: whitesmoke;\n    --he-select-after-margin: auto 4px auto auto;\n    --he-select-after-content: \"▼\";\n    --he-select-after-fontSize: 10px;\n    --he-select-after-display: block;\n    --he-select-after-padding: 0px 2px 0px 5px;\n    --he-select-disabled-color: hsl(from var(--he-select-color) h s calc(l + 50));\n    --he-select-before-color: black;\n    --he-select-before-content: '';\n    --he-select-before-fontFamily: 'Font Awesome 5 Pro';\n    --he-select-before-display: 'none';\n    --he-select-before-fontSize: 10px;\n    --he-select-before-padding: 0;\n\n    height: 1.6rem;\n    font-size: 14px;\n    min-width: 150px;\n    width: 150px;\n    display: inline-block;\n}\n\n:host([disabled]), \n:host([disabled])::slotted([slot=button]) {\n    pointer-events: none;\n    color: var(--he-select-disabled-color);\n}\n\n:host([variant=\"underline\"]) {\n    & #inp {\n        border-top: 0;\n        border-left: 0;\n        border-right: 0;\n        border-radius: 0;\n    }\n}\n\n#cont-button {\n    height: inherit;\n    width: inherit;\n    display: flex;\n    align-items: center;\n    background-color: var(--he-select-backgroundColor);\n    border-width: var(--he-select-borderWidth);\n    border-radius: var(--he-select-borderRadius);\n    border-color: var(--he-select-borderColor);\n    border-style: solid;\n    padding: 0;\n\n    &::before {\n        content: var(--he-select-before-content);\n        color: var(--he-select-before-color);\n        font-family: var(--he-select-before-fontFamily);\n        font-size: var(--he-select-before-fontSize);\n        display: var(--he-select-before-display);\n        padding: var(--he-select-before-padding);\n    }\n\n    &::after {\n        content: var(--he-select-after-content);\n        font-size: var(--he-select-after-fontSize);\n        display: var(--he-select-after-display);\n        margin: var(--he-select-after-margin);\n        padding: var(--he-select-after-padding);\n    }\n}\n\n#inp {\n    position: relative;\n    font-size: inherit;\n    border-radius: var(--he-select-borderRadius);\n    width: 100%;\n    height: inherit;\n    min-width: inherit;\n    outline: none;\n    text-align: left;\n    padding: var(--he-select-padding);\n    background-color: var(--he-select-backgroundColor);\n    text-wrap: nowrap;\n    border: 0;\n    color: inherit;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    align-items: center;\n}\n\n#inp:hover {\n    transition:\n        border-color 0.2s;\n    cursor: pointer;\n    border-color: var(--he-select-hover-borderColor);\n}\n\n#popover-content {\n    width: min-content;\n    border-radius: var(--he-select-popover-borderRadius);\n}\n\n#cont-options {\n    display: flex;\n    flex-direction: column;\n    background-color: var(--he-select-popover-backgroundColor);\n    max-height: var(--he-select-popover-maxHeight);\n    width: var(--he-select-popover-width);\n    overflow: auto;\n    overscroll-behavior: contain;\n    user-select: none;\n}\n\nslot[name=option] {\n    display: inline-flex;\n    flex-direction: column;\n}\n\nslot[name=button] {\n    display: flex;\n    align-items: center;\n    height: 100%;\n}\n\n#cont-options option,\n::slotted(*) {\n    padding: 5px 10px;\n    border-radius: 3px;\n    text-align: left;\n    width: 100%;\n    width: -moz-available;          /* WebKit-based browsers will ignore this. */\n    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */\n    width: fill-available;\n    display: inline-block;\n    align-items: center;\n    text-overflow: ellipsis;\n    overflow: hidden;\n}\n\n#cont-options option[selected]::before,\n::slotted([slot=option][selected])::before {\n    font-family: \"Font Awesome 5 Pro\";\n    content: \"\\f00c\";\n    font-weight: 600;\n    margin-right: 6px;\n    color: steelblue;\n}\n\n#cont-options:not(:hover) option[highlighted],\n#cont-options:not(:hover) ::slotted([slot=option][highlighted]) {\n    background-color: var(--he-select-option-selected-backgroundColor);\n}\n\n#cont-options option:hover:not(:disabled),\n::slotted([slot=option]:hover:not(:disabled))\n{\n    background-color: var(--he-select-option-hover-backgroundColor);\n    cursor: pointer;\n}\n\n#filter {\n    width: 100%;\n    width: -moz-available;          /* WebKit-based browsers will ignore this. */\n    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */\n    width: fill-available;\n    margin: 3px;\n}\n\n:host([filter=\"inline\"]) {\n    & #filter {\n        --he-input-padding: 0;\n        padding: var(--he-select-padding);\n        border: 0;\n        font-size: inherit;\n        width: 100%;\n        margin: 0;\n        min-width: inherit;\n        border-radius: var(--he-select-borderRadius);\n        background-color: var(--he-select-backgroundColor);\n        outline: none;\n        text-align: left;\n        text-wrap: nowrap;\n        color: inherit;\n    }\n}\n\n:host([multiple]) {\n    --he-select-padding: 3px 15px;\n\n    & #cont-button {\n        & #inp {\n            display: flex;\n            gap: 3px;\n            & span:not(.placeholder) {\n                display: inline-table;\n                align-items: center;\n                border: 1px solid lightgrey;\n                border-radius: 5px;\n                padding: 2px 5px;\n                background-color: white;\n                overflow: hidden;\n                width: fit-content;\n                text-overflow: ellipsis;\n            }\n\n            & span.placeholder {\n                color: grey;\n            }\n        }\n    }\n}\n\n");

class HeliumSelect extends HTMLElement {
    static formAssociated = true;
    static observedAttributes = [
        'open',
        'filter',
        'disabled',
        'placeholder',
    ];
    /** @type {HeliumPopover} */
    $popover;
    /** @type {HTMLDivElement} */
    $popoverContent;
    /** @type {HeliumInput} */
    $filter;
    /** @type {HTMLElement} */
    $options;
    /** @type {Array<HTMLElement>} */
    selections = [];
    /** @type {HTMLElement} */
    $button;
    /** @type {HTMLDivElement} */
    $contButton;
    /** @type {ElementInternals} */
    internals;
    /** @type {function(string, HtmlElement): boolean} */
    onfilter = this._onfilterDefault;
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
        this.$popoverContent.slot = 'content';
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
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    get open() {
        return this.getAttribute('open') !== null;
    }

    /**
     * Gets or sets the placeholder.
     * This is used as hint, if the input is empty.
     * @type {string}
     */
    set placeholder(val) {
        if (val) {
            this.setAttribute('placeholder', val);
        } else {
            this.removeAttribute('placeholder');
        }
    }

    get placeholder() {
        return this.getAttribute('placeholder');
    }

    set value(val) {
        if (val == null) {
            return;
        }

        if (Array.isArray(val)) { 
            if(this.getAttribute('multiple') == null) {
                throw new Error('Multiple values are not allowed unless the select has the attribute `multiple`');
            }
        } else {
            val = [val];
        }

        if (this.hasAttribute('slotted')) {
            /** @type {Array<HTMLElement>} */
            let options = this.$options.children[0].assignedNodes()
                .filter($el => val.includes($el.getAttribute('value')));
            if (options.length === 0)  {
                throw new Error('No option found with provided value!');
            }
            this._select(options);
            return;
        }

        let options = [];
        for (const v of val) {
            let $opt = this.$options.querySelector(`[value="${v}"]`);
            if ($opt == null) {
                throw new Error('No option found with provided value!');
            }
            options.push($opt);
        }
        this._select(options);
    }

    get value() {
        let selVals = this.selections.map(sel => sel.value ?? sel.getAttribute('value'));
        switch (selVals.length) {
            case 0:
                return '';
            case 1:
                return selVals[0];
        }
        return selVals;
    }
    
    addOption(text, value, fnInsertBefore=null) {
        let $opt = document.createElement('option');
        $opt.value = value;
        $opt.innerHTML = text;

        let $contInsert = this;
        if (this.hasAttribute('slotted')) {
            $opt.slot = 'option';
            //$opt.onclick = (e) => this._handleClickOption.bind(this)(e);
        } else {
            $contInsert = this.$options;
            $opt.onclick = (e) => this._handleClickOption.bind(this)(e);
        }

        if (fnInsertBefore == null) {
            $contInsert.append($opt);
            return $opt;
        }

        for (const $el of $contInsert.children) {
            if (fnInsertBefore($el, $opt)) {
                $contInsert.insertBefore($opt, $el);
                return $opt;
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

        if (this.hasAttribute('slotted')) {
            let $slot = document.createElement('slot');
            $slot.name = 'option';
            $slot.addEventListener('slotchange', (e) => this._handleSlotchange(e));
            this.$options.append($slot);
            $slot = document.createElement('slot');
            $slot.name = 'button';
            this.$button.append($slot);
        } else {
            for (let $opt of this.querySelectorAll('option')) {
                $opt.onclick = (e) => this._handleClickOption.bind(this)(e);
                this.$options.append($opt);
            }
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
        this._select([]);
    }

    /**
     * Returns all option elements.
     * @returns {HTMLCollection}
     */
    getOptions() {
        return this.hasAttribute('slotted')
            ? this.$options.children[0].assignedNodes()
            : this.$options.children;
    }

    /**
     * Hides the provided options in the option list.
     * Hides all options if `null` passed. 
     * @param {Array<string>} [values=null] A list of option values to hide.
     * @returns {Self}
     */
    hideOptions(values=null) {
        for (let $el of this.getOptions()) {
            if (values == null || values.includes($el.value)) {
                $el.style.display = 'none';
            } else {
                $el.style.display = '';
            }
        }

        this._select(this.selections);
        return this;
    }

    /**
     * Selects the next option.
     */
    nextOption(visualOnly=false) {
        this._moveOption(visualOnly, 1);
    }

    /**
     * Selects the next option.
     */
    _moveOption(visualOnly, dir) {
        if (!visualOnly && this.getAttribute('multiple')) {
            return;
        }

        let $elem = visualOnly 
            ? this.$highlight
            : this.selections[0];

        let options = this.getOptions();
        if (options.length === 0) {
            return;
        }

        if (!$elem) {
            if (visualOnly) {
                this._highlight(options[0]);
            } else {
                this._select([options[0]]);
            }
            return;
        }

        let i = Array.prototype.indexOf.call(
            options,
            $elem
        );
        let $next = $elem;
        while (options.length > 1 && true) {
            i += dir;
            $next = options[i];

            if ($next == null) {
                i = dir > 0
                    ? -1
                    : options.length;
                continue;
            }

            if ($elem.isSameNode($next)) {
                return;
            }

            if ($next.style.display !== 'none') {
                break;
            }
        }
        if (visualOnly) {
            this._highlight($next);
            return;
        }
        this._select([$next]);
    }

    prevOption(visualOnly=false) {
        this._moveOption(visualOnly, -1);
    }

    /**
     * Replaces all options with the ones provided.
     * If the same value exists in the old and new options, the value is selected.
     * @param {Array<string>} newOptions A list of options
     * @param {?Object.<string, string>} displayMapping A mapping from value to text
     * @returns {Self}
     */
    replaceOptions(newOptions, displayMapping = null) {
        if (this.hasAttribute('slotted')) {
            this.innerHTML = '';
        } else {
            this.$options.innerHTML = '';
        }

        displayMapping = displayMapping ?? {};

        for (const val of newOptions) {
            this.addOption(displayMapping[val] ?? val, val);
        }

        this._select(this.selections);
        return this;
    }

    reset() {
        this.formResetCallback();
    }

    /**
     * 
     * @param {?Array<string>} [values=null]
     * @returns {Self}
     */
    showOptions(values=null) {
        for (let $el of this.getOptions()) {
            if (values == null || values.includes($el.value)) {
                $el.style.display = '';
            }
        }

        this._select(this.selections);
        return this;
    }

    /** 
     * @param {number} optionIndex
     * @returns void
     */
    select(optionIndex) {
        let options = this.getOptions();
        if (options.length === 0 && optionIndex === 0) {
            return;
        }
        const option = options[optionIndex];
        console.assert(option != null, `No option with the given index ${optionIndex}!`);
        this._select([option]);
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

            let $firstVisible = null;
            let options = this.getOptions();
            for (const $option of options) {
                if (this.onfilter(filterVal, $option)) {
                    if ($firstVisible == null) {
                        $firstVisible = $option;
                    }
                    $option.style.display = '';
                } else {
                    $option.style.display = 'none';
                }
            }
            this._highlight($firstVisible);
        }, 250);
    }

    /**
     * @param {string} filterVal
     * @param {HtmlElement} $option
     * @returns {boolean} `true` if the options should be visible
     */
    _onfilterDefault(filterVal, $option) {
        filterVal.toLowerCase();
        let val = $option.value ?? $option.getAttribute('value');
        return filterVal.length === 0 || (val !== '' && $option.innerText.toLowerCase().includes(filterVal))
    }

    /**
     * This callback is called when an option is clicked.
     * @returns {void}
     */
    _handleClickOption(e) {
        const $target = e.currentTarget;

        if (this.hasAttribute('multiple')) {
            let newSelections = [];
            let isSelected = false;
            for (let $sel of this.selections) {
                if ($sel.isSameNode($target)) {
                    isSelected = true;
                    continue;
                }
                newSelections.push($sel);
            }

            if (!isSelected) {
                newSelections.push($target);
            }

            this._select(newSelections);

        } else {
            this.open = false;
            this._select([$target]);
        }

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
                    let $option = this.$highlight;

                    let filterVal = this.$filter.value;
                    if (this.hasAttribute('create-new') && filterVal !== '' && this.$highlight.innerHTML !== filterVal) {
                        $option = this.addOption(filterVal, '#@+' + filterVal, ($el, $new) => $new.innerText.localeCompare($el.innerText) < 0);
                    }

                    if (this.hasAttribute('multiple')) {
                        if ($option.hasAttribute('selected')) {
                            this.selections = this.selections.filter($x => !$x.isSameNode($option));
                            $option.removeAttribute('selected');
                        } else {
                            this.selections.push($option);
                        }

                        this._select(this.selections);
                    } else {
                        this._hidePopover();
                        this._select([$option]);
                    }
                    this.dispatchEvent(new CustomEvent('change'));
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

    _handleSlotchange() {
        for (let $opt of this.$options.children[0].assignedNodes()) {
            $opt.onclick = (e) => this._handleClickOption.bind(this)(e);
        }

        this._select(this.selections);
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
    
    /**
     * @param {?HTMLElement} $option
     */
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
        this._highlight(this.selections[0]);
        this.$filter.focus();
    }

    /**
     * @param {Array<HtmlElement>} options
     */
    _setButtonText(options) {
        if (this.hasAttribute('slotted')) {
            this.querySelectorAll('[slot="button"]')
                .forEach($el => $el.remove());

            for (const $option of options) {
                let $opt = $option.cloneNode();
                $opt.innerHTML = $option.innerHTML;
                $opt.slot = 'button';
                this.append($opt);
            }
        } else {
            let html = options.length > 0 
                ? options
                    .reduce((xs, $x) => `${xs}<span>${$x.innerHTML}</span>`, '')
                : '<span class="placeholder">' + this.getAttribute('placeholder') ?? '' + '</span>';
            this.$button.innerHTML = html;
        }
    }

    /** 
     * Selects a specific options given the option HTML element.
     * @param {Array<HTMLElement>} options
     * @returns {void}
     */
    _select(options) {
        let optionsValid = [];
        // TODO(marco): It should be possible to make the search a bit more efficent.
        for (let $optExisting of this.getOptions()) {
            for (let $optNew of options) {
                if ($optExisting.isSameNode($optNew) 
                    && $optNew.style.display !== 'none' 
                    && !$optNew.hasAttribute('disabled')
                ) {
                    optionsValid.push($optNew);
                    break;
                }
            }
        }
        this.selections.forEach($el => $el.removeAttribute('selected'));

        if (optionsValid.length === 0) {
            if (this.hasAttribute('multiple')) {
                // In `multiple` mode, it should be allowed to select nothing
                this.selections = [];
                this._setButtonText([]);
                return;
            }
            for (let $opt of this.getOptions()) {
                if ($opt.style.display !== 'none' && !$opt.hasAttribute('disabled')) {
                    return this._select([$opt]);
                }
            }
            
            this.selections = [];
            this.internals.setFormValue(null);
            this.$filter.value = '';
            return;
        }

        this._setButtonText(optionsValid);

        this.selections = optionsValid;
        this.selections.forEach($el => {
            $el.setAttribute('selected', '');
        });

        if (!this.disabled) {
            this.internals.setFormValue(this.value);
        }
    }
}

if (!customElements.get('he-select')) {
    customElements.define("he-select", HeliumSelect);
}

export { HeliumSelect };
