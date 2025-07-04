const sheet = new CSSStyleSheet();sheet.replaceSync("#cont-items {\n    display: flex;\n    gap: 10px;\n}\n\n");

/**
 */
class HeliumBreadcrumb extends HTMLElement {
    static observedAttributes = [
    ];
    /** @type {HTMLSlotElement} */
    $contItems;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        this.$contItems = document.createElement('div');
        this.$contItems.id = "cont-items";

        shadow.append(this.$contItems);
        shadow.adoptedStyleSheets = [sheet];
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
    }

    connectedCallback() {
        for (const $item of this.children) {
            const $nextElem = $item.nextElementSibling;
            if ($nextElem == null) {
                break;
            }
            const $divider = document.createElement('div');
            $divider.classList.add('divider');
            $divider.innerHTML = '>';
            $item.after($divider);
        }
    }
}

if (!customElements.get('he-breadcrumb')) {
    customElements.define("he-breadcrumb", HeliumBreadcrumb);
}

export { HeliumBreadcrumb };
