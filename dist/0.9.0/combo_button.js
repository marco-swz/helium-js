import { h as heSpaceBelow, a as hePositionRelative, b as heEnableBodyScroll } from './utils-BGzlNXdX.js';

const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    --he-combo-button-border-radius: 3px;\n    --he-combo-button-border-width: 0.1rem;\n    --he-combo-button-border-color: lightgrey;\n    --he-combo-button-clr-bg: white;\n    --he-combo-button-clr: black;\n    --he-combo-button-sep-width: 0.05rem;\n    --he-combo-button-sep-color: lightgrey;\n    --he-combo-button-height: 35px;\n    --he-combo-button-popover-border-color: hsl(240 5.9% 90%);\n\n    display: inline-block;\n    height: var(--he-combo-button-height);\n}\n\n#popover {\n    inset: unset;\n    outline: none;\n    border: 1px solid var(--he-combo-button-popover-border-color);\n    border-radius: var(--he-select-border-radius, 3px);\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n    width: min-content;\n\n    & #slot-menu {\n        display: flex;\n        flex-direction: column;\n\n        &::slotted(he-button) {\n            --he-button-width: 100%;\n        }\n    }\n}\n\n#cont-buttons {\n    display: flex;\n    border-radius: var(--he-combo-button-border-radius);\n    border-style: solid;\n    border-width: var(--he-combo-button-border-width);\n    width: fit-content;\n    height: calc(var(--he-combo-button-height) - 2px);\n    border-color: var(--he-combo-button-border-color);\n    overflow: hidden;\n\n    & button {\n        border-radius: 0;\n        outline: none;\n        border: none;\n        background-color: var(--he-combo-button-clr-bg);\n        color: var(--he-combo-button-clr);\n        border-left-color: var(--he-combo-button-sep-color);\n        border-left-width: var(--he-combo-button-sep-width);\n        border-left-style: solid;\n        cursor: pointer;\n        font-size: 10px;\n        padding: 0 10px;\n\n        &:hover {\n            transition:\n                background-color 0.2s;\n            background-color: hsl(240 4.8% 95.9%);\n        }\n    }\n}\n");

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
        $slotButton.addEventListener('click', () => this.open = false);
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
