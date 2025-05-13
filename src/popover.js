import sheet from "./popover.css";
import { heSpaceBelow, hePositionRelative, heEnableBodyScroll, heDisableBodyScroll } from "./utils.js";

export class HeliumPopover extends HTMLElement {
    static observedAttributes = [
        'attach',
        'position',
        'open',
        'trigger',
        'anchor',
        'dismiss',
    ];
    /** @type {HTMLDivElement} */
    $popover;
    /** @type {?HTMLElement} */
    $attach;
    /** @type {?HTMLElement} */
    $anchor;
    /** @type {ElementInternals} */
    internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$popover = document.createElement('div');
        this.$popover.id = 'popover';
        this.$popover.popover = '';
        //this.$popover.style.display = 'none';

        const $slot = document.createElement('slot');
        $slot.name = 'content';
        this.$popover.append($slot);

        shadow.append(this.$popover);
        shadow.adoptedStyleSheets = [sheet];

        this.internals = this.attachInternals();
    }

    /** 
     * Gets or sets the anchor element of the popover.
     * The `position` is used relative to this reference.
     * @type {string} 
     */
    set anchor(val) {
        if (val) {
            this.setAttribute('anchor', val);
        } else {
            this.removeAttribute('anchor');
        }
    }

    get anchor() {
        return this.getAttribute('anchor');
    }

    /** 
     * Gets or sets the dismiss action for the popover.
     * @type {'manual'|'auto'} 
     */
    set dismiss(val) {
        if (val) {
            this.setAttribute('dismiss', val);
        } else {
            this.removeAttribute('dismiss');
        }
    }

    get dismiss() {
        return this.getAttribute('dismiss');
    }

    /** 
     * Gets or sets the `open` state of the element.
     * If `open` is set, the options are shown to the user.
     * @type {HTMLElement} 
     */
    set anchorElement(val) {
        this.$anchor = val;
    }

    get anchorElement() {
        return this.$anchor;
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
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'open':
                if (newValue != null) {
                    this.$popover.showPopover();
                } else {
                    if (this.$popover.matches(':popover-open')) {
                        this.$popover.hidePopover();
                    }
                }
                break;
            case 'attach': 
                let $attach = document.querySelector(newValue);
                if ($attach == null) {
                    throw new Error('Attachment element not found!');
                }

                this._attachToElement($attach);
                break;
            case 'anchor': 
                const $anchor = document.querySelector(newValue);
                if ($anchor == null) {
                    throw new Error(`Anchor element "${newValue}" not found!`);
                }

                this.$anchor = $anchor;
                break;
            case 'dismiss':
                if (newValue) {
                    this.$popover.popover = newValue;
                } else {
                    this.$popover.popover = '';
                }
                break;
            default:
                break;
        }
    }

    connectedCallback() {
        this.$popover.addEventListener("beforetoggle", (e) => this._handleBeforeToggledPopover.bind(this)(e));
        this.$popover.addEventListener("toggle", (e) => this._handleToggledPopover.bind(this)(e));
    }

    /**
     * Returns the width and height of the popover.
     * Also works if the popover is hidden.
     * @returns {Array<number, number>}
     */
    getSize() {
        if (this.open) {
            let rect = this.$popover.getBoundingClientRect();
            return [rect.width, rect.height];
        }
        let pos = this.getAttribute('position');
        this.setAttribute('position', 'offscreen');
        this.open = true;
        let rect = this.$popover.getBoundingClientRect();
        let width = rect.width;
        let height = rect.height;
        this.open = false;
        this.setAttribute('position', pos);
        return [width, height];
    }

    hidePopover() {
        this.open = false;
    }

    showPopover() {
        this.open = true;
    }

    /**
     * 
     * @returns {Self}
     */
    toggle() {
        this.togglePopover();
        return this;
    }

    /**
     * 
     * @returns {Self}
     */
    togglePopover() {
        this.open = !this.open;
        return this;
    }

    /**
     * 
     * @param {HTMLElement} $elem
     */
    _attachToElement($elem) {
        const trigger = this.getAttribute('trigger') ?? 'click';
        $elem.addEventListener(trigger, (e) => this.triggeredCallback.bind(this)(e));
        this.$attach = $elem;
    }

    _handleBeforeToggledPopover(e) {
        if (e.newState === "open") {
            this.$popover.style.visibility = 'hidden';
        }
    }

    _handleToggledPopover(e) {
        if (e.newState === "open") {
            if (this.$anchor) {
                let positionDefault = 'bottom-left';
                if (heSpaceBelow(this) < this.$popover.offsetHeight + 20) {
                    positionDefault = 'top-left';
                }
                const position = this.getAttribute('position') ?? positionDefault;
                hePositionRelative(this.$popover, this.$anchor, position, 3);
                // Manually compensate for the margins with the number
                //const compensation = 7;
                //if (this.$popover.offsetWidth < this.$anchor.offsetWidth - compensation) {
                //    this.$popover.style.width = this.$anchor.offsetWidth - 7 + 'px';
                //}
            }

            heDisableBodyScroll();
            this.$popover.style.visibility = '';

        } else {
            heEnableBodyScroll();
            this.removeAttribute('open');
        }
    }
}

if (!customElements.get('he-popover')) {
    customElements.define("he-popover", HeliumPopover);
}
