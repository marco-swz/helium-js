const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    display: block;\n    overflow: auto;\n    height: 100%;\n}\n\n.cont-children {\n    padding-left: 20px;\n    position: relative;\n    overflow: hidden;\n    display: block;\n\n    &::before {\n        content: '';\n        width: 0;\n        height: 100%;\n        position: absolute;\n        border: 1px solid lightgrey;\n        top: 0;\n        left: 11px;\n    }\n\n    &:hover {\n        &::before {\n            transition: border-color 0.2s;\n            border-color: black;\n        }\n    }\n}\n\n.list-elem {\n    padding: 8px 10px;\n    cursor: pointer;\n    display: inline-block;\n    width: 100%;\n    width: -moz-available;          /* WebKit-based browsers will ignore this. */\n    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */\n    width: fill-available;\n    color: black;\n    text-decoration: none;\n    border-radius: 5px;\n    \n    &:hover {\n        background-color: whitesmoke;\n    }\n}\n\ndiv[type=\"root\"] {\n    font-weight: 500;\n\n    & > .list-elem::before {\n        transition: transform 0.1s;\n        font-family: \"Font Awesome 5 Pro\";\n        content: \"\\f105\";\n        color: grey;\n        padding-right: 5px;\n        display: inline-block;\n        transform: rotate(90deg) translate(3px, 3px);\n    }\n}\n\ndiv[type=\"leaf\"] {\n    font-weight: 400;\n}\n\ndiv[closed] {\n    & > .cont-children {\n        display: none;\n    }\n\n    & > .list-elem::before {\n        transition: transform 0.1s;\n        transform: rotate(0deg) translate(0, 0);\n    }\n}\n");

class HeliumTree extends HTMLElement {
    static observedAttributes = [
    ];
    /** @type {HTMLDivElement} */
    $contItems;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.$contItems = document.createElement('div');
        this.$contItems.id = 'cont-items';
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
        let items = [];
        for (let $elem of Array.from(this.children)) {
            let $item = this._renderLeaf($elem);
            this.$contItems.append($item);
            items.push($item);
        }

        for (let $elem of items) {
            const selParent = $elem.getAttribute('parent');
            if (selParent == null) {
                this.$contItems.append($elem);
                continue;
            }

            const $parent = this.$contItems.querySelector('#' + selParent);
            if ($parent == null) {
                throw new Error('No parent found with selector #' + selParent);
            }

            if ($parent.getAttribute('type') !== 'root') {
                $parent.setAttribute('type', 'root');
                let $contChildren = document.createElement('div');
                $contChildren.classList.add('cont-children');
                $contChildren.append($elem);
                $parent.append($contChildren);
                $parent.children[0].addEventListener('click', () => this._clickRootCallback.bind(this)($parent));
            } else {
                $parent.children[1].append($elem);
            }
        }
    }

    filter(filterText) {
        for(const $elem of this.$contItems.children) {
            this._filterRecursive($elem, filterText, false);
        }
    }

    _filterRecursive($item, filterText, showParent) {
        let showSelf = filterText == null;

        showSelf ||= $item.children[0].innerHTML.toLowerCase()
            .includes(filterText.toLowerCase());

        let showChild = false;

        const isRoot = $item.getAttribute('type') === 'root';
        if (isRoot) {
            let $contChildren = $item.children[1];
            for(const $elem of $contChildren.children) {
                let ret = this._filterRecursive($elem, filterText, showSelf || showParent);
                showChild = showChild || ret;
            }
        }

        if (showChild) {
            $item.style.display = '';
            $item.removeAttribute('closed');

        } else if (showSelf) {
            $item.style.display = '';
            $item.setAttribute('closed', 'true');

        } else if (showParent) {
            $item.style.display = '';

        } else {
            $item.style.display = 'none';
            $item.setAttribute('closed', 'true');
        }

        return showSelf || showChild;
    }

    _clickRootCallback($elem) {
        this._toggleChildren($elem);
    }

    _toggleChildren($elem) {
        if ($elem.getAttribute('closed')) {
            this._showChildren($elem);
        } else {
            this._hideChildren($elem);
        }
    }

    _hideChildren($elem) {
        $elem.setAttribute('closed', 'true');
    }

    _showChildren($elem) {
        $elem.removeAttribute('closed');
    }

    /**
     * @param {HTMLElement} $elem 
     */
    _renderLeaf($elem) {
        let $cont = document.createElement('div');
        const parent = $elem.getAttribute('parent');
        if (parent != null) {
            $cont.setAttribute('parent', parent);
        }
        $cont.id = $elem.id;
        $cont.classList.add('cont-elem');
        $elem.id = '';
        $elem.classList.add('list-elem');
        $cont.setAttribute('type', 'leaf');
        $cont.append($elem);
        return $cont;
    }

}
if (!customElements.get('he-tree')) {
    customElements.define("he-tree", HeliumTree);
}

export { HeliumTree };
