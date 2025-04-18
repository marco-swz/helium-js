const sheet = new CSSStyleSheet();sheet.replaceSync(" :host {\n     --he-tabs-backgroundColor: white;\n     --he-tabs-color: black;\n     --he-tabs-hover-backgroundColor: lightgrey;\n     --he-tabs-unselected-backgroundColor: whitesmoke;\n     --he-tabs-unselected-color: gray;\n\n     display: block;\n }\n\n :host([variant=pebble]) {\n    & #he-tabs-nav {\n        padding: 10px 0;\n        gap: 5px;\n    }\n\n    & #he-tabs-nav label {\n        color: hsl(240 3.8% 46.1%);\n    }\n\n    & #he-tabs-nav label:has(:checked) {\n        background-color: rgb(228 228 231);\n        border-radius: 4px;\n        color: black;\n    }\n }\n\n :host([variant=pebble-inverted]) {\n    & #he-tabs-nav {\n        padding: 4px;\n        gap: 5px;\n        background-color: #e6e6e6;\n        width: fit-content;\n        border-radius: 8px;\n    }\n\n    & #he-tabs-nav label {\n        color: hsl(240 3.8% 46.1%);\n        border-radius: 4px;\n        font-weight: 600;\n\n        &:hover {\n            transition: color 0.2s;\n            color: black;\n        }\n    }\n\n    & #he-tabs-nav label:has(:checked) {\n        transition:\n            background-color 0.2s,\n            color 0.2s;\n        background-color: white;\n        color: black;\n    }\n }\n\n#he-tabs-nav {\n    display: flex;\n}\n\n:host(:not([variant])) {\n    #he-tabs-nav label {\n        color: var(--he-tabs-unselected-color);\n        border-bottom: 3px solid transparent;\n    }\n\n    #he-tabs-nav label:has(:checked) {\n        transition:\n            border-bottom-color 0.2s,\n            color 0.2s;\n        color: var(--he-tabs-color);\n        border-bottom-color: steelblue;\n    }\n\n    #he-tabs-nav label:hover {\n        transition:\n            border-bottom-color 0.2s,\n            color 0.2s;\n        border-bottom: 3px solid var(--he-tabs-hover-backgroundColor);\n    }\n\n    #he-tabs-content {\n        border-top: 1px solid grey;\n    }\n}\n\n#he-tabs-nav label {\n    font-weight: 600;\n    user-select: none;\n    padding: 0.5rem 1rem;\n    cursor: pointer;\n    display: flex;\n    align-items: center;\n}\n");

class HeliumTabs extends HTMLElement {
    static observedAttributes = [
        "tab",
    ];
    /** @type {HTMLElement} */
    navBar;
    /** @type {Number} The index of the currently visible tab */
    tabNrVisible;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        shadow.adoptedStyleSheets = [sheet];
        shadow.innerHTML = `
            <nav id="he-tabs-nav">
            </nav>
            <div id="he-tabs-content">
                <slot name="tab"/>
            </div>
        `;

        this.navBar = shadow.querySelector('#he-tabs-nav');
        shadow.addEventListener('slotchange', e => this.slotChangeCallback(e, this));
    }

    connectedCallback() {
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'tab':
                this.showTab(Number(newValue));
                break;
        }
    }

    /**
     * Callback for slot changes.
     * Rebuilds the tabs and shows the correct content.
     * @param {Event} event 
     * @param {HeliumTabs} self 
     */
    slotChangeCallback(event, self) {
        /** @type {HTMLSlotElement} */
        const slot = event.target;
        let tabNr = 0;

        for (const $elem of slot.assignedElements()) {
            if ($elem.slot === 'tab') {
                /** @type {HTMLSpanElement} */
                let $span = document.createElement('span');

                let tabSlotName = $elem.getAttribute('title-slot');
                if (tabSlotName == null) {
                    const tabTitle = $elem.getAttribute('title-text') ?? `Tab ${tabNr}`;
                    $span.innerHTML = tabTitle;
                } else {
                    let $tabSlot = document.createElement('slot');
                    $tabSlot.name = tabSlotName;
                    $span.append($tabSlot);
                }

                const checkId = 'he-tabs-check' + tabNr;
                /** @type {HTMLLabelElement} */
                let $label = document.createElement('label');
                $label.for = checkId;

                /** @type {HTMLInputElement} */
                let $check = document.createElement('input');
                $check.id = checkId;
                $check.type = 'radio';
                $check.name = 'he-tabs-idx';
                $check.value = tabNr;
                $check.setAttribute('hidden', 'true');
                $check.onchange = e => self.tabChangeCallback(e);

                if (tabNr > 0) {
                    $elem.style.display = 'none';
                }

                $label.append($check);
                $label.append($span);
                self.navBar.append($label);

                tabNr++;
            }
        }

        self.showTab(self.getAttribute('tab') ?? 0);
    }

    /**
     * Callback for changes of the tab bar.
     * Hides the old content and shows the new.
     * @param {Event} e
     */
    tabChangeCallback(e) {
        /** @type {HTMLInputElement} */
        const check = e.target;
        const tabNrNew = Number(check.value);
        const contentOld = this.children.item(this.tabNrVisible);
        contentOld.style.display = 'none';

        const contentNew = this.children.item(tabNrNew);
        contentNew.style.display = '';

        this.tabNrVisible = tabNrNew;
    }

    /**
     * Shows the tab with the provided index.
     * @param {Number} tabNr The index of the tab
     */
    showTab(tabNr) {
        const id = '#he-tabs-check' + tabNr;
        /** @type {HTMLInputElement} */
        let check = this.navBar.querySelector(id);
        if (check !== null) {
            check.click();
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-tabs", HeliumTabs);
});

export { HeliumTabs };
