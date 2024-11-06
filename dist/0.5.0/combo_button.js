import { h as heSpaceBelow, a as hePositionRelative, b as heEnableBodyScroll } from './utils-BGzlNXdX.js';

const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\r\n    --he-combo-button-border-radius: 3px;\r\n    --he-combo-button-border-width: 0.1rem;\r\n    --he-combo-button-border-color: lightgrey;\r\n    --he-combo-button-clr-bg: white;\r\n    --he-combo-button-clr: black;\r\n    --he-combo-button-sep-width: 0.05rem;\r\n    --he-combo-button-sep-color: lightgrey;\r\n    --he-combo-button-height: 35px;\r\n    --he-combo-button-popover-border-color: 240 5.9% 90%;\r\n\r\n    display: inline-block;\r\n    height: var(--he-combo-button-height);\r\n}\r\n\r\n#popover {\r\n    inset: unset;\r\n    outline: none;\r\n    border: 1px solid hsl(var(--he-combo-button-popover-border-color));\r\n    border-radius: var(--he-select-border-radius, 3px);\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n    width: min-content;\r\n\r\n    & #slot-menu {\r\n        display: flex;\r\n        flex-direction: column;\r\n\r\n        &::slotted(he-button) {\r\n            --he-button-width: 100%;\r\n        }\r\n    }\r\n}\r\n\r\n#cont-buttons {\r\n    display: flex;\r\n    border-radius: var(--he-combo-button-border-radius);\r\n    border-style: solid;\r\n    border-width: var(--he-combo-button-border-width);\r\n    width: fit-content;\r\n    height: calc(var(--he-combo-button-height) - 2px);\r\n    border-color: var(--he-combo-button-border-color);\r\n    overflow: hidden;\r\n\r\n    & button {\r\n        border-radius: 0;\r\n        outline: none;\r\n        border: none;\r\n        background-color: var(--he-combo-button-clr-bg);\r\n        color: var(--he-combo-button-clr);\r\n        border-left-color: var(--he-combo-button-sep-color);\r\n        border-left-width: var(--he-combo-button-sep-width);\r\n        border-left-style: solid;\r\n        cursor: pointer;\r\n        font-size: 10px;\r\n        padding: 5px;\r\n\r\n        &:hover {\r\n            background-color: hsl(240 4.8% 95.9%);\r\n        }\r\n    }\r\n}\r\n");

class HeliumComboButton extends HTMLElement {
    static observedAttributes = [
        'text',
        'open',
        'disabled',
    ];
    /** @type {HTMLElement} */
    $popover;
    /** @type {ElementInternals} */
    internals;
    /** @type {HTMLDivElement} */
    $contButtons;
    /** @type {bool} */
    ignoreAttributes = false;


    constructor() {
        super();
        this.internals = this.attachInternals();
        let shadow = this.attachShadow({ mode: "open" });

        shadow.adoptedStyleSheets = [sheet];

        this.$popover = document.createElement('div');
        this.$popover.id = 'popover';
        this.$popover.popover = '';
        shadow.append(this.$popover);

        const $slotMenu = document.createElement('slot');
        $slotMenu.id = 'slot-menu';
        $slotMenu.name = 'menu';
        this.$popover.append($slotMenu);

        this.$contButtons = document.createElement('div');
        this.$contButtons.id = 'cont-buttons';
        shadow.append(this.$contButtons);

        const $slotButton = document.createElement('slot');
        $slotButton.innerHTML = this.getAttribute('text');
        $slotButton.id = 'slot-button';
        $slotButton.name = 'button';
        this.$contButtons.append($slotButton);

        const $btnMenu = document.createElement('button');
        $btnMenu.innerHTML = '▼';
        $btnMenu.id = 'btn-menu';
        $btnMenu.setAttribute('popovertarget', 'popover');
        this.$contButtons.append($btnMenu);
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get disabled() {
        return this.getAttribute('disabled') !== null;
    }

    set open(val) {
        if (val) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
    }

    get open() {
        return this.getAttribute(open) !== null;
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     * @returns void
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        if (this.ignoreAttributes) {
            return;
        }

        switch (name) {
            case 'text':
                if (newValue) {
                    this.shadowRoot.querySelector('#btn-primary').innerHTML = newValue;
                }
                break;
            case 'open':
                if (newValue != null) {
                    this.$popover.showPopover();
                } else {
                    this.$popover.hidePopover();
                }
                break;
            case 'disabled':
                if (newValue != null) {
                    this.$contButtons.querySelector('#btn-menu').disabled = true;
                    this.$contButtons.querySelectorAll('slot')
                        .forEach((elem) => elem.disabled = true );
                } else {
                    this.$contButtons.querySelector('#btn-menu').disabled = false;
                    this.$contButtons.querySelectorAll('slot')
                        .forEach((elem) => elem.disabled = false );
                }
                break;
        }
    }

    connectedCallback() {
        this.$popover.addEventListener("beforetoggle", (e) => this._beforetoggledPopoverCallback.bind(this)(e));
        this.$popover.addEventListener("toggle", (e) => this._toggledPopoverCallback.bind(this)(e));
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

    _toggledPopoverCallback(e) {
        if (e.newState === "open") {
            this.internals.states.add('open');

            let positionDefault = 'bottom-right';
            if (heSpaceBelow(this) < this.$popover.offsetHeight + 20) {
                positionDefault = 'top-right';
            }
            const position = this.getAttribute('position') ?? positionDefault;
            hePositionRelative(this.$popover, this.$contButtons, position, 3);
            this.$popover.style.visibility = '';
        } else {
            this.internals.states.delete('open');
            heEnableBodyScroll();
        }
    }
}

if (!customElements.get('he-combo-button')) {
    customElements.define('he-combo-button', HeliumComboButton);
}

export { HeliumComboButton };
