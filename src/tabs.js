import sheet from './tabs.css';

export class HeliumTabs extends HTMLElement {
    static observedAttributes = [
        "tab",
    ];
    /** @type {HTMLElement} */
    $navBar;
    /** @type {HTMLSlotElement} */
    $slotContent;
    /** @type {Number} The index of the currently selected tab */
    tabNrSelected;

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

        this.$navBar = shadow.querySelector('#he-tabs-nav');
        this.$slotContent = shadow.querySelector('slot[name=tab]');
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

    hideTab(tabNr) {
        let $nav = this._getTabNav(tabNr);
        $nav.style.display = 'none';
        if (this.tabNrSelected === tabNr) {
            this._selectFirstVisible();
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
        let firstVisible = null;

        for (const $elem of slot.assignedElements()) {
            if ($elem.slot === 'tab') {
                let isHidden = $elem.hasAttribute('hidden');

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
                if (isHidden) {
                    $label.style.display = 'none';
                } else if (firstVisible == null) {
                    firstVisible = tabNr;
                }

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
                self.$navBar.append($label);

                tabNr++;
            }
        }

        if (firstVisible == null) {
            return;
        }

        self.showTab(self.getAttribute('tab') ?? firstVisible);
    }

    /**
     * Shows the tab with the provided index.
     * @param {Number} tabNr The index of the tab
     */
    showTab(tabNr) {
        const id = '#he-tabs-check' + tabNr;
        /** @type {HTMLInputElement} */
        let check = this.$navBar.querySelector(id);
        if (check !== null) {
            check.click();
        }
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
        const contentOld = this.children.item(this.tabNrSelected);
        contentOld.style.display = 'none';

        const contentNew = this.children.item(tabNrNew);
        contentNew.style.display = '';

        this.tabNrSelected = tabNrNew;
        this.dispatchEvent(new CustomEvent('change'));
    }

    unhideTab(tabNr) {
        let $nav = this._getTabNav(tabNr);
        $nav.style.display = '';
        let $tab = this._getTabContent(tabNr);
        $tab.removeAttribute('hidden');
    }

    /**
     * 
     * @param {number} tabNr
     * @returns {HTMLLabelElement}
     * @throws {Error} If the tab number does not exist
     */
    _getTabContent(tabNr) {
        return this.$slotContent.assignedElements()[tabNr];
    }

    _getTabNav(tabNr) {
        const id = '#he-tabs-check' + tabNr;
        /** @type {HTMLInputElement} */
        let $check = this.$navBar.querySelector(id);
        if ($check == null) {
            throw new Error(`Invalid tab number: ${tabNr}`);
        }
        return $check.parentElement;
    }

    _getTabs() {
        return this.$slotContent.assignedElements();
    }

    _selectFirstVisible() {
        for (let [i, $tab] of this._getTabs().entries()) {
            if (!$tab.hasAttribute('hidden')) {
                this.showTab(i);
                return;
            }
        }
        throw new Error('No tabs visible');
    }

}

document.addEventListener("DOMContentLoaded", function() {
    customElements.define("he-tabs", HeliumTabs);
});
