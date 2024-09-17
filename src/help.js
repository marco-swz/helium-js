class HeliumHelp extends HTMLElement {
    static observedAttributes = [
        'title,'
    ];

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(scss`
            #he-help-btn {
                display: inline-block;
                width: 1.2rem;
                height: 1.2rem;
                text-align: center;
                vertical-align: middle;
                font-weight: 900;
                border-radius: 50%;
                cursor: help;
            }
        `);

        let button = document.createElement('div');
        button.id = 'he-help-btn';
        button.innerHTML = '?';
        let content = document.createElement('content');
        content.id = 'he-help-content';
        let slot = document.createElement('slot');
        slot.name = 'text';

        shadow.adoptedStyleSheets = [sheet];
        content.append(slot);
        shadow.append(button);
        shadow.append(content);

        button.addEventListener('click', e => this.clickBtnCallback(e, this));
        shadow.addEventListener('slotchange', e => this.slotChangeCallback(e, this));
    }

    connectedCallback() {
    }

    /**
     * Callback for slot changes.
     * Rebuilds the tabs and shows the correct content.
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    slotChangeCallback(event, self) {
        const slot = event.target;
    }

    /**
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    clickBtnCallback(e, self) {
        console.log('click');
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
    }
}


document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-help", HeliumHelp);
});
