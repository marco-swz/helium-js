class HeliumPopover extends HTMLElement {
    static observedAttributes = [
        'attach',
        'position',
        'open,',
        'trigger',
    ];
    /** @type {HTMLDivElement} */
    popover;
    /** @type {?HTMLElement} */
    attach;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            :host {
                border: 1px solid black;
                position: fixed;
                margin-top: var(--he-popover-outer-gap, 0.2rem);
                margin-buttom: var(--he-popover-outer-gap, 0.2rem);
                box-shadow: 1px 1px 5px #808080c9;
                z-index: 10;
            }

        `);

        this.popover = document.createElement('div');
        this.popover.id = 'popover';
        this.popover.style.display = 'none';

        const slot = document.createElement('slot');
        slot.name = 'content';
        this.popover.append(slot);

        shadow.append(this.popover);
        shadow.adoptedStyleSheets = [sheet];
    }

    connectedCallback() {
        const attachElem = this.getAttribute('attach');
        if (attachElem == null) {
            throw new Error('Ho attachment element defined!');
        }

        this.attach = document.querySelector(attachElem);
        if (this.attach == null) {
            throw new Error('Attachment element not found!');
        }

        window.addEventListener('click', () => this.hide.bind(this)())
        this.addEventListener('click', (e) => e.stopPropagation())

        const trigger = this.getAttribute('trigger') ?? 'click';
        this.attach.addEventListener(trigger, (e) => this.triggeredCallback.bind(this)(e));
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
                if (newValue == null || newValue === 'false') {
                    this.popover.hide();
                } else {
                    this.popover.show();
                }

                break;
            default:
                break;
        }
    }

    hide() {
        this.removeAttribute('open');
        this.moveToTarget(this.attach, 'bottom-right');
        this.popover.style.display = 'none';
    }

    show() {
        this.moveToTarget(this.attach, 'bottom-right');
        this.popover.style.display = '';
        this.setAttribute('open', 'true');
    }

    /**
     * 
     * @param {InputEvent} e 
     * @returns void
     */
    triggeredCallback(e) {
        e.stopPropagation();
        const open = this.getAttribute('open')
        if (open == null || open === 'false') {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * @param {HTMLElement} elem 
     * @returns void
     */
    moveToTarget(elem, position) {
        const rect = elem.getBoundingClientRect();
        this.style.left = rect.left + 'px';
        this.style.top = rect.top + 'px';

        switch (position) {
            case 'bottom-right':
                this.style.left = rect.left + 'px';
                this.style.top = rect.bottom + 'px';
                break;
            default:
                throw new Error('Invalid position');
        }

    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-popover", HeliumPopover);
});
