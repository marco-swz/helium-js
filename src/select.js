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

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-select", HeliumSelect);
});
