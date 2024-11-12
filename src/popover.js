import sheet from "./popover.css";
import { heSpaceBelow, hePositionRelative, heEnableBodyScroll, heDisableBodyScroll } from "./utils.js";

export class HeliumPopover extends HTMLElement {
    static observedAttributes = [
        'attach',
        'position',
        'open,',
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
    $ignoreAttributes = false;

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
            this.$popover.showPopover();
        } else {
            this.$popover.hidePopover();
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
        if (this.ignoreAttributes) {
            return;
        }

        switch (name) {
            case 'open':
                if (newValue == null || newValue === 'false') {
                    this.$popover.hide();
                } else {
                    this.$popover.show();
                }

                break;
            case 'attach': 
                $attach = document.querySelector(newValue);
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
        this.$popover.addEventListener("beforetoggle", (e) => this._beforetoggledPopoverCallback.bind(this)(e));
        this.$popover.addEventListener("toggle", (e) => this._toggledPopoverCallback.bind(this)(e));
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
        this.$popover.togglePopover();
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

            console.log(this.$anchor);
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
            this.internals.states.delete('open');
            heEnableBodyScroll();
        }
    }
}

if (!customElements.get('he-popover')) {
    customElements.define("he-popover", HeliumPopover);
}
