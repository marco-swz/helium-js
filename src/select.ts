import { styles } from './select_styles.ts';
import { LitElement, html, nothing } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

import { HeliumPopover } from "./popover.js";
import { HeliumInput } from "./input.js";
import { heCallOnOutsideClick, heSpaceBelow, RelativePosition } from './utils.ts';

@customElement('he-select')
export class HeliumSelect extends HTMLElement {
    static get styles() {
        return [
            styles
        ];
    }
    static formAssociated = true;
    static observedAttributes = [
        'open',
        'filter',
        'disabled',
        'placeholder',
        'readonly',
    ];

    _refPopoverContent: Ref<HTMLDivElement> = createRef();
    _refFilter: Ref<HeliumInput> = createRef();
    _refButton: Ref<HTMLElement> = createRef();
    _refContButton: Ref<HTMLDivElement> = createRef();
    _refPopover: Ref<HeliumPopover> = createRef();
    _refOptions: Ref<HTMLElement> = createRef();

    _$highlight: HTMLOptionElement | null = null;

    @queryAssignedElements({ slot: '' })
    _slottedElements!: Array<HTMLElement>

    _selections: Set<HTMLElement>;
    _internals: ElementInternals;
    /** @type {?function(HTMLOptionElement, string) -> Promise<?HTMLOptionElement>} */
    createCallback;
    /** @type {function(string, HtmlElement): boolean} */
    onfilterelement = this._onFilterelementDefault;
    /** @type {number | TimerHandler} */
    _filterTimeout = 0;
    /** @type flag to know, if the connectedCallback has already been called */
    _isInit: boolean = false;
    /** @type The click handler to detect outside clicks. This should be cleaned up when closing */
    _handleClickDocument?: (this: Document, ev: PointerEvent) => any;

    /**
     * Disables or enables the select.
     */
    @property({ type: Boolean, reflect: true })
    disabled = false;
    /**
     * Gets or sets the filter attribute.
     * The filter allows searching the options of the select.
     */
    @property({ type: String, reflect: true })
    filter: 'inline' | 'popover' | null = 'popover';
    /** 
     * Gets or sets the name of the element for form submissions.
     * @type {string} 
     */
    @property({ type: String, reflect: true })
    name: String | null = null;
    /** 
     * Gets or sets the `open` state of the element.
     * If `open` is set, the options are shown to the user.
     */
    @property({ type: Boolean, reflect: true })
    open = false;
    /**
     * Gets or sets the placeholder.
     * This is used as hint, if the input is empty.
     */
    @property({ type: String, reflect: true })
    placeholder: String | null = null;

    /**
     * Disables or enables the select.
     */
    @property({ type: Boolean, reflect: true })
    readonly = false;
    @property({ type: Boolean, reflect: true })
    empty = false;
    @property({ type: Boolean, reflect: true })
    multiple = false;
    @property({ type: String, reflect: true })
    position: RelativePosition | null = null;

    render() {
        const filter = html`
            <he-input
                id="filter"
                @input=${() => this._handleChangeFilter.bind(this)()}
                ${ref(this._refFilter)}
                ${this.filter === 'inline' ? html`style="display: none"` : nothing}
            ></he-input>
        `;
        return html`
            <div id="cont-button"
                ${ref(this._refContButton)}
            >
                <button id="inp"
                    ${ref(this._refButton)}
                    @click=${() => this.open = true}
                ></button>
                ${this.filter === 'inline' ? filter : nothing}
            </div>
            <he-popover
                id="popover"
                dismiss="manual"
                anchor="#cont-button"
                ${ref(this._refPopover)}
            >
                <div id="popover-content"
                    ${ref(this._refPopoverContent)}
                >
                    ${this.filter === 'popover' ? filter : nothing}
                    <div id="cont-options"
                        ${ref(this._refOptions)}
                    >
                        <slot @slotchange=${() => this._handleSlotchange.bind(this)()}></slot>
                    </div>
                </div>
            </he-popover>
        `
    }

    constructor() {
        super();
        this._selections = new Set();
        this._internals = this.attachInternals();
        this.onkeydown = async (e) => await this._handleKeydown(e);
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

        this._setButtonText(this._selections);
        this._updateFormValue();
    }

    get value() {
        let selVals = [];
        this._selections.forEach($sel => selVals.push($sel.value ?? $sel.getAttribute('value')));
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
     * @param text
     * @param value
     * @param fnInsertBeforeTrigger A callback to determine where to insert the new option. Once this callback returns `true`, it will be inserted before.
     * @returns The inserted option element
     */
    addOption(
        text: string,
        value: string,
        fnInsertBeforeTrigger?: (arg0: HTMLOptionElement, arg1: HTMLOptionElement
        ) => boolean): HTMLOptionElement {
        let $option = this._renderOption(text, value);
        return this._addOption($option, fnInsertBeforeTrigger);
    }

    /**
     * Callback for attribute changes of the web component.
     * @param name The attribute name
     * @param _oldValue The previous attribute value
     * @param newValue The new attribute value
     */
    attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
        switch (name) {
            case 'open':
                if (newValue != null) {
                    this._showPopover();
                } else {
                    this._hidePopover();
                }
                break;
            case 'disabled':
                if (newValue != null) {
                    this._internals.setFormValue(null);
                } else {
                    this._internals.setFormValue(this.value);
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
     */
    checkValidity(): boolean {
        return true;
    }

    /**
     * This callback function is triggered once the `he-select` is attached to the document.
     */
    connectedCallback() {
        // This guards against double connections of the same element.
        if (this._isInit) {
            return;
        }
        this._isInit = true;

        $slot.addEventListener('slotchange', (e) => this._handleSlotchange(e));

        if (this._selections.size === 0 && !this.hasAttribute('multiple')) {
            this.select(0);
        } else {
            this._setButtonText(this._selections);
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
            ? this._refOptions.children[0].assignedNodes()
            : this._refOptions.children);
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

        this._setButtonText(this._selections);
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

        if (this._selections.has($replace)) {
            this._setButtonText(this._selections);
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
            this._refOptions.innerHTML = '';
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
     */
    toggle(): HeliumSelect {
        this._refPopover.togglePopover();
        return this;
    }

    /**
     * This callback is called when the filter value changes
     * @returns {void}
     */
    _handleChangeFilter() {
        window.clearTimeout(this._filterTimeout);

        this._filterTimeout = setTimeout(() => {
            let filterVal = this._refFilter.value;
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
            if (this._selections.has($target)) {
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

    _clearSelections(updateButtonText = true, updateFormValue = true) {
        if (!this.hasAttribute('multiple')) {
            this.select(0);
            return;
        }

        if (this._selections.size === 0) {
            return;
        }

        this._selections.forEach($opt => $opt.removeAttribute('selected'));
        this._selections.clear();

        if (updateButtonText) {
            this._setButtonText(this._selections);
        }
        if (updateFormValue) {
            this._updateFormValue();
        }
    }

    _addOption(
        $option: HTMLOptionElement,
        fnInsertBeforeTrigger?: (arg0: HTMLOptionElement, arg1: HTMLOptionElement) => boolean,
    ): HTMLOptionElement | null {
        let $contInsert: HTMLElement | undefined = this;
        if (this.hasAttribute('slotted')) {
            $option.slot = 'option';
            //$opt.onclick = (e) => this._handleClickOption.bind(this)(e);
        } else {
            $contInsert = this._refOptions.value;
            $option.onclick = (e) => this._handleClickOption.bind(this)(e);
        }

        if ($contInsert == null) {
            return null;
        }

        if (fnInsertBeforeTrigger == null) {
            $contInsert.append($option);
            return $option;
        }

        for (const $el of $contInsert.children) {
            if (fnInsertBeforeTrigger($el as HTMLOptionElement, $option)) {
                $contInsert.insertBefore($option, $el);
                return $option;
            }
        }

        $contInsert.append($option);
        return $option;
    }


    _addSelection($option: HTMLOptionElement, updateButtonText = true, updateFormValue = true): void {
        if (this._selections.has($option)) {
            return;
        }

        if (!this.hasAttribute('multiple')) {
            this._selections.forEach($opt => $opt.removeAttribute('selected'));
            this._selections.clear();
        }
        this._selections.add($option);
        $option.setAttribute('selected', '');
        if (updateButtonText) {
            this._setButtonText(this._selections);
        }
        if (updateFormValue) {
            this._updateFormValue();
        }
    }

    _removeSelection($option: HTMLOptionElement, updateButtonText = true, updateFormValue = true) {
        if (!this._selections.has($option)) {
            return;
        }

        this._selections.delete($option)
        $option.removeAttribute('selected');
        if (updateButtonText) {
            this._setButtonText(this._selections);
        }
        if (updateFormValue) {
            this._updateFormValue();
        }
    }

    _renderOption(text: string, value?: string) {
        let $opt = document.createElement('option');
        $opt.value = value ?? text;
        $opt.innerHTML = text;
        return $opt;
    }

    /**
     * This callback handles all shortcuts.
     */
    async _handleKeydown(e: KeyboardEvent) {
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
                    const filterVal = this._refFilter.value?.value ?? '';
                    const $$options = this.getOptions();
                    let $option = this._$highlight ?? $$options.find((o: any) => o.innerHTML === filterVal);

                    const attrCreate = this.getAttribute('create');
                    let $createOption = $option;
                    if ($option == null && attrCreate != null && filterVal !== '' && this._$highlight == null) {
                        $option = this._renderOption(filterVal, filterVal);
                        const createCallback = this.createCallback ?? window[this.getAttribute('create-callback')];

                        if (createCallback) {
                            $createOption = await createCallback.bind(this)($option, filterVal);
                        } else {
                            $createOption = $option;
                        }
                        if ($createOption) {
                            const evt = new CustomEvent('create', { detail: { text: filterVal } });
                            this.dispatchEvent(evt);
                        }
                    }

                    // The user can intercept the option and set it to null.
                    // In this case, it should not be created.
                    if ($createOption == null) {
                        return;
                    } else {
                        this._addOption($createOption, ($el, $new) => $new.innerText.localeCompare($el.innerText) < 0);
                    }

                    $option = $createOption;
                    if ($option == null) {
                        $option = $$options[0];
                    }

                    if (this.hasAttribute('multiple')) {
                        if (this._selections.has($option)) {
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
        let selectionsToDel = new Set(this._selections);
        let isEmpty = true;
        for (let $opt of this._slottedElements) {
            selectionsToDel.delete($opt);
            $opt.onclick = (e) => this._handleClickOption.bind(this)(e);
            isEmpty = false;
        }

        if (isEmpty) {
            this.empty = true;
        } else {
            this.empty = false;
        }

        if (selectionsToDel.size > 0) {
            selectionsToDel.forEach($opt => this._removeSelection($opt, false, false));

            if (this._selections.size > 0) {
                this._setButtonText(this._selections);
                this._updateFormValue();
            }
        }

        if (this._selections.size === 0 && !this.multiple) {
            this.select(0);
        }
    }

    /**
     * This callback is responsible for hiding the popover
     */
    _hidePopover(): void {
        this._highlight();
        if (this._refFilter.value) {
            this._refFilter.value.value = '';
        }
        this._refPopover.value?.hidePopover();
        // @ts-ignore
        document.removeEventListener('click', this._handleClickDocument);
    }

    _highlight($option?: HTMLOptionElement) {
        if (this._$highlight) {
            this._$highlight.removeAttribute('highlighted');
        }
        if ($option == null) {
            this._$highlight = null;
            return;
        }
        this._$highlight = $option;
        this._$highlight.setAttribute('highlighted', '');
    }

    /**
     * Selects the next option.
     */
    _moveOption(visualOnly: boolean, dir: -1 | 1) {
        if (!visualOnly && this.getAttribute('multiple')) {
            return;
        }

        let options = this.getOptions();
        if (options.length === 0) {
            return;
        }

        let i = 0;
        if (this._$highlight != null) {
            i = dir + Array.prototype.indexOf.call(
                options,
                this._$highlight
            );
        } else if (dir < 0) {
            i = options.length - 1;
        }
        let $elem = options[i];

        let firstSearch = true;
        while (options.length > 1) {
            let $next = options[i]
            if ($next == null) {
                i = dir > 0
                    ? 0
                    : options.length - 1;
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
     */
    _showPopover(): void {
        const $popover = this._refPopover.value;
        const $button = this._refButton.value;
        const $filter = this._refFilter.value;
        const $popoverContent = this._refPopoverContent.value;
        const $contButton = this._refContButton.value;
        const $options = this._refOptions.value;
        if ($popover == null 
            || $button == null 
            || $filter == null 
            || $popoverContent == null
            || $contButton == null
            || $options == null
        ) {
            return
        }

        if (this.getAttribute('filter') === 'inline') {
            $button.style.display = 'none';
            $filter.style.display = '';
        }

        let positionDefault: RelativePosition = 'bottom-left';
        if (heSpaceBelow(this) < $popover.offsetHeight + 20) {
            positionDefault = 'top-left';
        }
        this._handleClickDocument = heCallOnOutsideClick([$popoverContent, $contButton], () => {
            this.open = false;
        });

        $popover.position = this.position ?? positionDefault;
        $filter.value = '';
        this.showOptions();

        let btnWidth = $contButton.getBoundingClientRect().width;
        $options.style.width = `var(--he-select-popover-width, ${btnWidth}px)`;

        $popover.style.visibility = 'hidden';
        $popover.showPopover();
        $popover.style.visibility = '';

        setTimeout(() => {
            $filter.focus();
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
            this._refButton.innerHTML = html;
        }
    }

    _updateFormValue() {
        if (this._selections.size === 0) {
            this._internals.setFormValue(null);
            return;
        }

        if (!this.disabled) {
            this._internals.setFormValue(this.value);
        }
    }
}
