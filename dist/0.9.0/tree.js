const sheet = new CSSStyleSheet();sheet.replaceSync("\n");

class HeliumTree extends HTMLElement {
    static observedAttributes = [
    ];

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        shadow.append(this.$slot);
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
        let items = [];
        for (let $elem of this.children) {
            $e = this._renderLeaf($elem);
            items.push($e);
        }

        for (let $item of this.children) {
            const selParent = $elem.getAttribute('parent');
            if (selParent == null) {
                this._renderLeaf($elem);
                continue;
            }

            const $parent = document.querySelector(selParent);
            if ($parent == null) {
                throw new Error('No parent found with selector ' + selParent);
            }

            if (!$parent.isRoot) {
                $parent.append($elem);
            }
        }
    }

    /**
     * @param {HTMLElement} $elem 
     */
    _renderRoot($elem) {
        let $cont = document.createElement('div');
        $cont.class = 'cont-root';
        $cont.append($elem);
        let $contChildren = document.createElement('div');
        $cont.class = 'cont-children';
        $cont.append($contChildren);
    }

    _renderLeaf() {
        let $cont = document.createElement('div');
        $cont.class = 'cont-leaf';
        $cont.append($elem);
    }

}
if (!customElements.get('he-tree')) {
    customElements.define("he-tree", HeliumTree);
}

export { HeliumTree };
