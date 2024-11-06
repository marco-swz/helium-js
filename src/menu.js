export class HeliumMenu extends HTMLElement {
    static observedAttributes = [
        'title,'
    ];

    /** @type {HTMLDivElement} */
    items;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
:host {
    position: relative;
    display: inline-block;
    --he-color-accent: #0082b4;
}

#he-menu-items {
    position: absolute;
    border: 1px solid lightgrey;
    min-width: 70px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    border-radius: 3px;
    z-index: 1;
    top: 20px;
    display: flex;
    flex-direction: column;
    padding: 0.2rem;
}

::slotted([slot=item]) {
    padding: 0.2rem 0.3rem !important;
    border-radius: 3px;
    cursor: pointer;
}

::slotted([slot=item]:hover) {
    background-color: whitesmoke;
}
        `);

        this.items = document.createElement('div');
        this.items.id = 'he-menu-items';
        this.items.style.display = 'none';

        let item = document.createElement('slot');
        item.name = 'item';


        this.button = document.createElement('slot');
        this.button.name = 'button';
        this.button.id = 'he-menu-button';

        this.items.append(item);
        shadow.append(this.items);
        shadow.append(this.button);

        shadow.adoptedStyleSheets = [sheet];
        shadow.addEventListener('slotchange', this.slotChangeCallback.bind(this));
    }

    connectedCallback() {
    }

    /**
     * Callback for slot changes.
     * Rebuilds the tabs and shows the correct content.
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    slotChangeCallback(event) {
        const slot = event.target;
        for (const elem of slot.assignedElements()) {
            if (elem.slot === 'button') {
                elem.addEventListener('click', e => {
                    if (this.fnClose == null) {
                        this.open.bind(this)()
                    }
                });
            }
        }
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
    }

    close() {
        this.items.style.display = 'none';
        window.removeEventListener('mousedown', this.fnClose);
        this.fnClose = null;
    }

    open() {
        if (this.fnClose != null) {
            return;
        }
        this.items.style.display = '';
        this.fnClose = this.close.bind(this);
        window.addEventListener('mousedown', this.fnClose);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-menu", HeliumMenu);
});
