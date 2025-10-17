import sheet from './select.css';
import { heSpaceBelow, heCallOnOutsideClick } from "./utils.js";
import { HeliumPopover } from "./popover.js";
import { HeliumInput } from "./input.js";

export class HeliumSelect extends HTMLElement {
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
    /** @type {Set<HTMLElement>} */
    selections;
    /** @type {HTMLElement} */
    $button;
    /** @type {HTMLDivElement} */
    $contButton;
    /** @type {ElementInternals} */
    internals;
    /** @type {?function(HTMLOptionElement, string) -> Promise<?HTMLOptionElement>} */
    createCallback;
    /** @type {function(string, HtmlElement): boolean} */
    onfilterelement = this._onFilterelementDefault;
    /** @type {number | TimerHandler} */
    _filterTimeout = 0;
    /** @type {function(InputEvent): void} The click handler to detect outside clicks. This should be cleaned up when closing */
    _handleClickDocument;

    constructor() {
        super();
        this.selections = new Set();
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

        this.onkeydown = async (e) => await this._handleKeydown(e);

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
            if (this.getAttribute('multiple') == null) {
                throw new Error('Multiple values are not allowed unless the select has the attribute `multiple`');
            }
        } else {
            val = [val];
        }

        this._clearSelections(false, false);
        for (const $opt of this.getOptions()) {
            if (val.toString().includes($opt.getAttribute('value'))) {
                this._addSelection($opt, false, false);
            }
        }

        this._setButtonText(this.selections);
        this._updateFormValue();
    }

    get value() {
        let selVals = [];
        this.selections.forEach($sel => selVals.push($sel.value ?? $sel.getAttribute('value')));
        if (this.hasAttribute('multiple')) {
            return selVals;
        }

        switch (selVals.length) {
            case 0:
                return '';
            case 1:
                return selVals[0];
        }
    }

    /**
     * 
     * @param {string} text
     * @param {string} value
     * @param {function(HTMLOptionElement, HTMLOptionElement): boolean} fnInsertBeforeTrigger A callback to determine where to insert the new option. Once this callback returns `true`, it will be inserted before.
     * @returns {HTMLOptionElement} The inserted option element
     */
    addOption(text, value, fnInsertBeforeTrigger = null) {
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

        if (fnInsertBeforeTrigger == null) {
            $contInsert.append($opt);
            return $opt;
        }

        for (const $el of $contInsert.children) {
            if (fnInsertBeforeTrigger($el, $opt)) {
                $contInsert.insertBefore($opt, $el);
                return $opt;
            }
        }

        $contInsert.append($opt);
        return $opt;
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
            case 'placeholder':
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
        // This guards against double connections of the same element.
        if (this.$options.children.length > 0) {
            return;
        }

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
                if ($opt.hasAttribute('selected')) {
                    this._addSelection($opt);
                }
            }

            if (this.$options.children.length === 0) {
                this.setAttribute('empty', '');
            } else {
                this.removeAttribute('empty');
            }
        }

        if (this.selections.size === 0 && !this.hasAttribute('multiple')) {
            this.select(0);
        } else {
            this._setButtonText(this.selections);
        }

        if (this.hasAttribute('open')) {
            this.open = true;
        }
    }

    /**
     * The native callback function for resetting the input a part of a form.
     */
    formResetCallback() {
        this._clearSelections();
    }

    /**
     * Returns all option elements.
     * @returns {Array<HTMLElement>}
     */
    getOptions() {
        return Array.from(this.hasAttribute('slotted')
            ? this.$options.children[0].assignedNodes()
            : this.$options.children);
    }

    /**
     * Hides the provided options in the option list.
     * Hides all options if `null` passed. 
     * @param {Array<string>} [values=null] A list of option values to hide.
     * @returns {Self}
     */
    hideOptions(values = null) {
        for (let $el of this.getOptions()) {
            if (values == null || values.includes($el.value)) {
                $el.style.display = 'none';
                this._removeSelection($el, false, false);
            } else {
                $el.style.display = '';
            }
        }

        this._setButtonText(this.selections);
        this._updateFormValue();

        return this;
    }

    /**
     * Selects the next option.
     */
    nextOption(visualOnly = false) {
        this._moveOption(visualOnly, 1);
    }

    prevOption(visualOnly = false) {
        this._moveOption(visualOnly, -1);
    }

    removeOption(value) {
        for (const $opt of this.getOptions()) {
            if ($opt.getAttribute('value') === value) {
                this._removeSelection($opt);
                $opt.remove();
                return;
            }
        }

        throw new Error('No option found with the provided value: ' + value);
    }

    /**
     * Replaces the option with the provided value.
     * @param {string} valueOld The value of the option to replace
     * @param {?string} text The new innerHTML of the option
     * @param {?string} valueNew The new value of the option
     * @returns {void}
     */
    replaceOption(valueOld, text = null, valueNew = null) {
        let $replace = this.getOptions()
            .filter($opt => $opt.getAttribute('value') === valueOld)[0];

        if ($replace == null) {
            throw new Error('No option found with the provided value: ' + valueOld);
        }

        if (valueNew != null) {
            $replace.setAttribute('value', valueNew);
        }
        if (text != null) {
            $replace.innerHTML = text;
        }

        if (this.selections.has($replace)) {
            this._setButtonText(this.selections);
            this._updateFormValue();
        }
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

        this._clearSelections();
        for (const val of newOptions) {
            this.addOption(displayMapping[val] ?? val, val);
        }

        if (!this.hasAttribute('multiple')) {
            this.select(0);
        }

        if (newOptions.length === 0) {
            this.setAttribute('empty', '');
        } else {
            this.removeAttribute('empty');
        }
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
    showOptions(values = null) {
        for (let $el of this.getOptions()) {
            if (values == null || values.includes($el.value)) {
                $el.style.display = '';
            }
        }

        return this;
    }

    /** 
     * @param {number} optionIndex
     * @returns void
     */
    select(optionIndex) {
        let options = this.getOptions();
        if (options.length === 0 && optionIndex === 0) {
            this._setButtonText(new Set());
            this._updateFormValue();
            return;
        }
        const $option = options[optionIndex];
        if ($option == null) {
            throw new Error(`No option with the given index ${optionIndex}!`);
        }

        this._addSelection($option);
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
            }

            let $firstVisible = null;
            let options = this.getOptions();
            for (const $option of options) {
                if (this.onfilterelement(filterVal, $option)) {
                    if ($firstVisible == null) {
                        $firstVisible = $option;
                    }
                    $option.style.display = '';
                } else {
                    $option.style.display = 'none';
                }
            }
        }, 250);
    }

    /**
     * @param {string} filterVal
     * @param {HtmlElement} $option
     * @returns {boolean} `true` if the options should be visible
     */
    _onFilterelementDefault(filterVal, $option) {
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
            if (this.selections.has($target)) {
                this._removeSelection($target);
            } else {
                this._addSelection($target);
            }

        } else {
            this.open = false;
            this._addSelection($target);
        }

        this.dispatchEvent(new CustomEvent('change'));
    }

    _clearSelections(updateButtonText=true, updateFormValue=true) {
        if (!this.hasAttribute('multiple')) {
            this.select(0);
            return;
        }

        if (this.selections.size === 0) {
            return;
        }

        this.selections.forEach($opt => $opt.removeAttribute('selected'));
        this.selections.clear();

        if (updateButtonText) {
            this._setButtonText(this.selections);
        }
        if (updateFormValue) {
            this._updateFormValue();
        }
    }

    /**
     * 
     * @param {} 
     * @returns {void}
     */
    _addSelection($option, updateButtonText=true, updateFormValue=true) {
        if (this.selections.has($option)) {
            return;
        }

        if (!this.hasAttribute('multiple')) {
            this.selections.forEach($opt => $opt.removeAttribute('selected'));
            this.selections.clear();
        }
        this.selections.add($option);
        $option.setAttribute('selected', '');
        if (updateButtonText) {
            this._setButtonText(this.selections);
        }
        if (updateFormValue) {
            this._updateFormValue();
        }
    }
    
    _removeSelection($option, updateButtonText=true, updateFormValue=true) {
        if (!this.selections.has($option)) {
            return;
        }

        this.selections.delete($option)
        $option.removeAttribute('selected');
        if (updateButtonText) {
            this._setButtonText(this.selections);
        }
        if (updateFormValue) {
            this._updateFormValue();
        }
    }

    /**
     * This callback handles all shortcuts.
     * @param {KeyboardEvent} e
     */
    async _handleKeydown(e) {
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
                    let $option = this.$highlight ?? this.getOptions()[0];

                    let filterVal = this.$filter.value;
                    let attrCreate = this.getAttribute('create');
                    if (attrCreate != null && filterVal !== '' && this.$highlight == null) {
                        $option = this.addOption(filterVal, filterVal, ($el, $new) => $new.innerText.localeCompare($el.innerText) < 0);
                        const createCallback = this.createCallback ?? window[this.getAttribute('create-callback')];
                        if (createCallback) {
                            $option = await createCallback.bind(this)($option, filterVal);
                        }
                        if ($option) {
                            let evt = new CustomEvent('create', { detail: { text: filterVal } });
                            this.dispatchEvent(evt);
                        }
                    }

                    // The user can intercept the option and set it to null.
                    // In this case, we want to skip.
                    if ($option == null) {
                        return;
                    }

                    if (this.hasAttribute('multiple')) {
                        if (this.selections.has($option)) {
                            this._removeSelection($option);
                        } else {
                            this._addSelection($option);
                        }
                    } else {
                        this.open = false;
                        this._addSelection($option);
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
        let selectionsToDel = new Set(this.selections);
        let isEmpty = true;
        for (let $opt of this.$options.children[0].assignedNodes()) {
            selectionsToDel.delete($opt);
            $opt.onclick = (e) => this._handleClickOption.bind(this)(e);
            isEmpty = false;
        }

        if (isEmpty) {
            this.setAttribute('empty', '');
        } else {
            this.removeAttribute('empty');
        }

        if (selectionsToDel.size > 0) {
            selectionsToDel.forEach($opt => this._removeSelection($opt, false, false));

            if (this.selections.size > 0) {
                this._setButtonText(this.selections);
                this._updateFormValue();
            }
        }

        if (this.selections.size === 0 && !this.hasAttribute('multiple')) {
            this.select(0);
        }
    }

    /**
     * This callback is responsible for hiding the popover
     * @returns {void}
     */
    _hidePopover() {
        this._highlight();
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
            this.$highlight = null;
            return;
        }
        this.$highlight = $option;
        this.$highlight.setAttribute('highlighted', '');
    }

    /**
     * Selects the next option.
     */
    _moveOption(visualOnly, dir) {
        if (!visualOnly && this.getAttribute('multiple')) {
            return;
        }

        let options = this.getOptions();
        if (options.length === 0) {
            return;
        }

        let i = 0;
        if (this.$highlight != null) {
            i = dir + Array.prototype.indexOf.call(
                options,
                this.$highlight
            );
        } else if (dir < 0) {
            i = options.length-1;
        }
        let $elem = options[i];

        let firstSearch = true;
        while (options.length > 1) {
            let $next = options[i]
            if ($next == null) {
                i = dir > 0
                    ? 0
                    : options.length-1;
                continue;
            }
            i += dir;

            if (firstSearch) {
                firstSearch = false;
            } else if ($elem.isSameNode($next)) {
                return;
            }

            if ($next.style.display === 'none') {
                continue;
            }

            if (visualOnly) {
                this._highlight($next);
                
            } else {
                this._addSelection($next);
            }
            break;
        }
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

        let btnWidth = this.$contButton.getBoundingClientRect().width;
        this.$options.style.width = `var(--he-select-popover-width, ${btnWidth}px)`;

        this.$popover.style.visibility = 'hidden';
        this.$popover.showPopover();
        this.$popover.style.visibility = '';

        setTimeout(() => {
            this.$filter.focus();
        }, 20);
    }

    /**
     * @param {Set<HtmlElement>} options
     */
    _setButtonText(options) {
        if (this.hasAttribute('slotted')) {
            this.querySelectorAll('[slot="button"]')
                .forEach($el => $el.remove());

            for (const $option of options.values()) {
                let $opt = $option.cloneNode();
                $opt.innerHTML = $option.innerHTML;
                $opt.slot = 'button';
                this.append($opt);
            }
        } else {
            let html = options.values()
                .reduce((xs, $x) => `${xs}<span>${$x.innerHTML}</span>`, '');

            let placeholder = this.getAttribute('placeholder');
            if (html === '' && placeholder != null) {
                html = '<span class="placeholder">' + placeholder + '</span>';
            }
            this.$button.innerHTML = html;
        }
    }

    _updateFormValue() {
        if (this.selections.size === 0) {
            this.internals.setFormValue(null);
            return;
        }

        if (!this.disabled) {
            this.internals.setFormValue(this.value);
        }
    }
}

if (!customElements.get('he-select')) {
    customElements.define("he-select", HeliumSelect);
}
