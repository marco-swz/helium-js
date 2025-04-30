import sheet from './tabs.css';

export class HeliumTabs extends HTMLElement {
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
        this.dispatchEvent(new CustomEvent('change'));
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
