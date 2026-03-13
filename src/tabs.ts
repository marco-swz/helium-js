import { styles } from './tabs_styles.ts';
import { LitElement, html } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';

@customElement('he-tabs')
export class HeliumTabs extends LitElement {
    static get styles() {
        return [
            styles
        ];
    }
    static observedAttributes = [
        "tab",
    ];

    @query('#he-tabs-nav')
    _$navBar!: HTMLElement
    @queryAssignedElements({ slot: 'tab' })
    _slottedElements!: Array<HTMLElement>

    @property({ type: Number, reflect: true }) 
    tab: number | null = null;

    constructor() {
        super();
    }

    render() {
        return html`
            <nav 
                id="he-tabs-nav"
            >
            </nav>
            <div id="he-tabs-content">
                <slot 
                    name="tab"
                    @slotchange=${this._handleSlotChange}
                ></slot>
            </div>
        `;
    }

    connectedCallback() {
    }

    /**
     * Callback for attribute changes of the web component.
     * @param name The attribute name
     * @param _oldValue The previous attribute value
     * @param newValue The new attribute value
     */
    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        switch (name) {
            case 'tab':
                this.showTab(Number(newValue));
                break;
        }
    }

    hideTab(tabNr: number) {
        let $nav = this._getTabNav(tabNr);
        $nav.style.display = 'none';
        if (this.tab === tabNr) {
            this._selectFirstVisible();
        }
    }

    /**
     * Callback for slot changes.
     * Rebuilds the tabs and shows the correct content.
     */
    _handleSlotChange(event: Event, self: HeliumTabs) {
        const slot = <HTMLSlotElement>event.target!;
        let tabNr = 0;
        let firstVisible = null;

        for (const $elem of slot.assignedElements()) {
            if ($elem.slot === 'tab') {
                let isHidden = $elem.hasAttribute('hidden');

                let $span: HTMLSpanElement = document.createElement('span');

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
                let $label: HTMLLabelElement = document.createElement('label');
                // @ts-ignore
                $label.for = checkId;
                if (isHidden) {
                    $label.style.display = 'none';
                } else if (firstVisible == null) {
                    firstVisible = tabNr;
                }

                let $check: HTMLInputElement = document.createElement('input');
                $check.id = checkId;
                $check.type = 'radio';
                $check.name = 'he-tabs-idx';
                $check.value = String(tabNr);
                $check.setAttribute('hidden', 'true');
                $check.onchange = e => self._handleChangeTab(e);

                if (tabNr > 0) {
                    // @ts-ignore
                    $elem.style.display = 'none';
                }

                $label.append($check);
                $label.append($span);
                self._$navBar.append($label);

                tabNr++;
            }
        }

        if (firstVisible == null) {
            return;
        }

        self.showTab(Number(self.getAttribute('tab') ?? firstVisible));
    }

    /**
     * Shows the tab with the provided index.
     * @param tabNr The index of the tab
     */
    showTab(tabNr: number): void {
        const id = '#he-tabs-check' + tabNr;
        let check = this._$navBar.querySelector<HTMLInputElement>(id);
        if (check !== null) {
            check.click();
        }
    }

    /**
     * Callback for changes of the tab bar.
     * Hides the old content and shows the new.
     */
    _handleChangeTab(e: Event): void {
        const check = e.target as HTMLInputElement;
        const tabNrNew = Number(check.value);
        const contentOld = this.children.item(this.tab ?? 0);
        if (contentOld) {
            // @ts-ignore
            contentOld.style.display = 'none';
        }

        const contentNew = this.children.item(tabNrNew);
        if (contentNew) {
            // @ts-ignore
            contentNew.style.display = '';
        }

        this.tab = tabNrNew;
        this.dispatchEvent(new CustomEvent('change'));
    }

    unhideTab(tabNr: number) {
        let $nav = this._getTabNav(tabNr);
        $nav.style.display = '';
        let $tab = this._getTabContent(tabNr);
        $tab.removeAttribute('hidden');
    }

    /**
     * @throws {Error} If the tab number does not exist
     */
    _getTabContent(tabNr: number): HTMLElement {
        return this._slottedElements[tabNr];
    }

    _getTabNav(tabNr: number): HTMLElement {
        const id = '#he-tabs-check' + tabNr;
        let $check = this._$navBar.querySelector<HTMLInputElement>(id);
        if ($check == null) {
            throw new Error(`Invalid tab number: ${tabNr}`);
        }
        return $check.parentElement!;
    }

    _selectFirstVisible() {
        for (let [i, $tab] of this._slottedElements.entries()) {
            if (!$tab.hasAttribute('hidden')) {
                this.showTab(i);
                return;
            }
        }
        throw new Error('No tabs visible');
    }
}
