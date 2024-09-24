import { h as heEnableBodyScroll, a as heSpaceBelow, b as hePositionRelative, c as heDisableBodyScroll } from './utils-B1ZZEmwz.js';

const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    height: fit-content;\r\n    width: fit-content;\r\n    font-size: 14px;\r\n    min-width: 60px;\r\n}\r\n\r\n#inp {\r\n    position: relative;\r\n    background-color: var(--he-select-clr-bg, whitesmoke);\r\n    border: 1px solid lightgrey;\r\n    width: inherit;\r\n    height: inherit;\r\n    min-width: inherit;\r\n    padding: 0.3rem 0.4rem;\r\n    border-radius: 3px;\r\n    outline: none;\r\n    text-align: left;\r\n    padding-right: 25px;\r\n    text-wrap: nowrap;\r\n}\r\n\r\n#inp:hover, #inp:focus {\r\n    cursor: pointer;\r\n    border-color: var(--he-select-clr-border-hover, grey);\r\n}\r\n\r\n#inp::after {\r\n    content: \"\";\r\n    position: absolute;\r\n    width: 4px;\r\n    height: 4px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto 10px auto auto;\r\n    border: 2px solid transparent;\r\n    border-bottom-color: var(--he-select-clr-arrow, black);\r\n    border-right-color: var(--he-select-clr-arrow, black);\r\n    transform: rotate(45deg) translateY(-2.5px);\r\n}\r\n\r\n#popover {\r\n    inset: unset;\r\n    outline: none;\r\n    border: 1px solid grey;\r\n    border-radius: var(--he-select-border-radius, 3px);\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n#cont-options {\r\n    display: flex;\r\n    flex-direction: column;\r\n    background-color: var(--he-select-clr-bg, white);\r\n    max-height: 300px;\r\n    overflow: auto;\r\n    overscroll-behavior: contain;\r\n}\r\n\r\n#cont-options option {\r\n    padding: 5px 4px;\r\n    border-radius: 3px;\r\n}\r\n\r\n#cont-options option[selected] {\r\n    background-color: var(--he-select-clr-bg-hover, whitesmoke);\r\n}\r\n\r\n#cont-options option:hover:not(:disabled) {\r\n    background-color: var(--he-select-clr-bg-hover, whitesmoke);\r\n    cursor: pointer;\r\n}\r\n\r\n#filter {\r\n    --he-input-border-radius: 2px;\r\n    width: 100%;\r\n}\r\n\r\n");

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
        this._disableAttrCallback = true;
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
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-select", HeliumSelect);
});

export { HeliumSelect };
