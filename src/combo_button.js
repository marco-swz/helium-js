import { heSpaceBelow, hePositionRelative, heEnableBodyScroll, heDisableBodyScroll } from "./utils.js";
import sheet from './combo_button.css';

export class HeliumComboButton extends HTMLElement {
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
        $slotButton.id = 'slot-button'
        $slotButton.name = 'button';
        this.$contButtons.append($slotButton);

        const $btnMenu = document.createElement('button');
        $btnMenu.innerHTML = 'v';
        $btnMenu.id = 'btn-menu'
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
            heDisableBodyScroll();
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
