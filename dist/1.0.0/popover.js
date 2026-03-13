import { _ as __decorate, i, r, b } from './lit-element-C9ed7Kq3.js';
import { t } from './custom-element-DX8pDbbK.js';
import { n } from './property-BCLoIpyb.js';
import { e, n as n$1 } from './ref-C9xuETNn.js';

var styles = "#popover {\n    --he-popover-borderColor: hsl(240 5.9% 90%);\n    --he-popover-borderRadius: 3px;\n\n    padding: 0;\n    inset: unset;\n    outline: none;\n    border: 1px solid var(--he-popover-borderColor);\n    border-radius: var(--he-popover-borderRadius);\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n}\n";

//export function preventDefaultForScrollKeys(e: KeyboardEvent) {
//    // left: 37, up: 38, right: 39, down: 40,
//    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
//    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
//    if (keys[e.keyCode]) {
//        e.preventDefault();
//        return false;
//    }
//}
/**
 * Returns the amount of pixels between the element and
 * the bottom of the screen.
 */
function heSpaceBelow(element) {
    const elementRect = element.getBoundingClientRect();
    const spaceBelow = window.innerHeight - elementRect.bottom;
    return spaceBelow;
}
/**
 * Positions the `$element` relative to the `$target`.
 */
function hePositionRelative($elem, $target, position, offset = 0) {
    const rect = $target.getBoundingClientRect();
    switch (position) {
        case 'bottom':
        case 'bottom-center':
            $elem.style.left = (rect.left + rect.width / 2 - $elem.offsetWidth / 2) + 'px';
            $elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'top':
        case 'top-center':
            $elem.style.left = (rect.left + rect.width / 2 - $elem.offsetWidth / 2) + 'px';
            $elem.style.top = rect.top - $elem.offsetHeight - offset + 'px';
            break;
        case 'bottom-right':
            $elem.style.left = (rect.left + rect.width - $elem.offsetWidth) + 'px';
            $elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'bottom-left':
            $elem.style.left = rect.left + 'px';
            $elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'top-right':
            $elem.style.top = '';
            $elem.style.left = (rect.left + rect.width - $elem.offsetWidth) + 'px';
            $elem.style.top = rect.top - $elem.offsetHeight - offset + 'px';
            break;
        case 'top-right':
            $elem.style.top = '';
            $elem.style.left = rect.left + 'px';
            $elem.style.top = rect.top - $elem.offsetHeight - offset + 'px';
            break;
        case 'offscreen':
            $elem.style.left = '-10000px';
            break;
        default:
            throw new Error('Invalid position');
    }
}
function heEnableBodyScroll() {
    document.body.style.position = 'static';
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'auto';
}

/**
 * This popover element is used to show content in the forground, overlaying the content below.
 * It is positioned relative to another HTML element, which servers as anchor.
 *
 * @cssprop [--he-popover-borderColor=hsl(240 5.9% 90%)] - The border color of the popover
 * @cssprop [--he-popover-borderRadius=3px] - The border radius of the popover
 *
 * @tag he-popover
 */
let HeliumPopover = class HeliumPopover extends i {
    static get styles() {
        return [
            r(styles),
        ];
    }
    constructor() {
        super();
        this._refPopover = e();
        this._$attach = null;
        this._$anchor = null;
        this._anchorElement = null;
        /**
         * The anchor element of the popover.
         * The `position` is used relative to this reference.
         */
        this.anchor = null;
        /**
         * The dismiss action for the popover.
         */
        this.dismiss = null;
        /**
         * The position of the popover when opened relative to its anchor.
         */
        this.position = null;
        /**
         * The `open` state of the element.
         * If `open` is set, the options are shown to the user.
         */
        this.open = false;
        this.targetAction = null;
        this.target = null;
    }
    render() {
        return b `
            <div id="popover" popover
                ${n$1(this._refPopover)}
                @beforetoggle=${(e) => this._handleBeforeToggledPopover.bind(this)(e)}
                @toggle=${(e) => this._handleToggledPopover.bind(this)(e)}
                .dismiss=${this.dismiss ?? 'auto'}
                .trigger=${this.targetAction ?? 'click'}
            >
                <slot></slot>
            </div>
        `;
    }
    /**
     * Callback for attribute changes of the web component.
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'open':
                if (newValue != null) {
                    this._refPopover.value?.showPopover();
                }
                else {
                    if (this._refPopover.value?.matches(':popover-open')) {
                        this._refPopover.value?.hidePopover();
                    }
                }
                break;
            case 'attach':
                const $attach = document.querySelector(newValue);
                if ($attach == null) {
                    throw new Error('Attachment element not found!');
                }
                this._attachToElement($attach);
                break;
            case 'anchor':
                if (newValue == null) {
                    this._$anchor = null;
                    break;
                }
                const $anchor = document.querySelector(newValue);
                if ($anchor == null) {
                    throw new Error(`Anchor element "${newValue}" not found!`);
                }
                this._$anchor = $anchor;
                break;
        }
    }
    /**
     * Returns the width and height of the popover.
     * Also works if the popover is hidden.
     */
    getSize() {
        const $popover = this._refPopover.value;
        if ($popover == null) {
            throw new Error('Popover not rendered');
        }
        if (this.open) {
            let rect = $popover.getBoundingClientRect();
            return [rect.width, rect.height];
        }
        const pos = this.position;
        this.position = 'offscreen';
        this.open = true;
        const rect = $popover.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        this.open = false;
        this.position = pos;
        return [width, height];
    }
    hidePopover() {
        this.open = false;
        return this;
    }
    show() {
        return this.showPopover();
    }
    showPopover() {
        this.open = true;
        return this;
    }
    toggle() {
        this.togglePopover();
        return this;
    }
    togglePopover() {
        this.open = !this.open;
        return this.open;
    }
    _attachToElement($elem) {
        this._$attach = $elem;
    }
    _handleBeforeToggledPopover(e) {
        const $popover = this._refPopover.value;
        if ($popover != null && e.newState === "open") {
            $popover.style.visibility = 'hidden';
        }
    }
    _handleToggledPopover(e) {
        const $popover = this._refPopover.value;
        if ($popover == null) {
            return;
        }
        if (e.newState === "open") {
            if (this._$anchor) {
                let positionDefault = 'bottom-left';
                if (heSpaceBelow(this) < $popover.offsetHeight + 20) {
                    positionDefault = 'top-left';
                }
                const position = this.position ?? positionDefault;
                hePositionRelative($popover, this._$anchor, position, 3);
            }
            $popover.style.visibility = '';
        }
        else {
            heEnableBodyScroll();
            this.open = false;
        }
    }
};
__decorate([
    n({ reflect: true, type: String })
], HeliumPopover.prototype, "anchor", void 0);
__decorate([
    n({ reflect: true, type: String })
], HeliumPopover.prototype, "dismiss", void 0);
__decorate([
    n({ reflect: true, type: String })
], HeliumPopover.prototype, "position", void 0);
__decorate([
    n({ reflect: true, type: Boolean })
], HeliumPopover.prototype, "open", void 0);
__decorate([
    n({ reflect: true, type: String })
], HeliumPopover.prototype, "targetAction", void 0);
__decorate([
    n({ reflect: true, type: String })
], HeliumPopover.prototype, "target", void 0);
HeliumPopover = __decorate([
    t('he-popover')
], HeliumPopover);

export { HeliumPopover };
