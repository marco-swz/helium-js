const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    display: block;\n    overflow: auto;\n    height: 100%;\n}\n\n.cont-children {\n    padding-left: 20px;\n    position: relative;\n    overflow: hidden;\n    display: block;\n\n    &::before {\n        content: '';\n        width: 0;\n        height: 100%;\n        position: absolute;\n        border: 1px solid lightgrey;\n        top: 0;\n        left: 11px;\n    }\n\n    &:hover {\n        &::before {\n            transition: border-color 0.2s;\n            border-color: grey;\n        }\n    }\n}\n\n.list-elem {\n    padding: 8px 10px;\n    display: inline-block;\n    width: 100%;\n    width: -moz-available;          /* WebKit-based browsers will ignore this. */\n    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */\n    width: fill-available;\n    color: black;\n    text-decoration: none;\n    border-radius: 5px;\n    text-wrap: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    \n    &:hover {\n        background-color: whitesmoke;\n    }\n}\n\n.cont-elem[selected] {\n    .list-elem {\n        background-color: whitesmoke;\n    }\n}\n\ndiv[type=\"root\"] {\n    font-weight: 500;\n    display: flex;\n    flex-direction: column;\n\n    & > .list-elem {\n        text-transform: uppercase;\n        cursor: pointer;\n        \n        &::before {\n            transition: transform 0.1s;\n            font-family: \"Font Awesome 5 Pro\";\n            content: \"\\f105\";\n            color: grey;\n            padding-right: 5px;\n            display: inline-block;\n            transform: rotate(90deg) translate(3px, 3px);\n        }\n    }\n}\n\ndiv[type=\"leaf\"] {\n    font-weight: 400;\n    display: flex;\n    flex-direction: column;\n}\n\ndiv[closed] {\n    & > .cont-children {\n        display: none;\n    }\n\n    & > .list-elem::before {\n        transition: transform 0.1s;\n        transform: rotate(0deg) translate(0, 0);\n    }\n}\n");

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
                if (!this.hasAttribute('no-autofold')) {
                    $parent.children[0].addEventListener('click', () => this._clickRootCallback.bind(this)($parent));
                }
            } else {
                $parent.children[1].append($elem);
            }
        }
    }

    /**
     * @param {string} filterText
     * @returns {Self}
     */
    filter(filterText) {
        if (filterText != null) {
            filterText = filterText.toLowerCase();
        }
        for(const $elem of this.$contItems.children) {
            this._filterRecursive($elem, filterText, false);
        }

        return this;
    }

    /**
     * @returns Array.<string>
     */
    getOpen() {
        return Array.from(this.$contItems.querySelectorAll('[type=root]:not([closed])'))
            .map($el => $el.id);
    }

    /**
     * @returns Array.<string>
     */
    getClosed() {
        return Array.from(this.$contItems.querySelectorAll('[type=root][closed]'))
            .map($el => $el.id);
    }

    /**
     * @param {?Array.<string>} ids
     */
    setClosed(ids=null) {
        if (ids == null) {
            for (let $el of this.$contItems.querySelectorAll('[type=root]')) {
                $el.setAttribute('closed', 'true');
                if ($el.hasAttribute('slotted') || this.hasAttribute('slotted')) {
                    $el.children[0].assignedElements()[0].setAttribute('closed', 'true');
                }
            }
            return;
        }

        for (let id of ids) {
            let $el = this.$contItems.querySelector('#' + id);
            if ($el == null) {
                throw new Error('No tree node with ID ' + id);
            }

            $el.setAttribute('closed', 'true');
            if ($el.hasAttribute('slotted') || this.hasAttribute('slotted')) {
                $el.children[0].assignedElements()[0].setAttribute('closed', 'true');
            }
        }
    }


    /**
     * @param {?Array.<string>} ids
     */
    setOpen(ids) {
        if (ids == null) {
            for (let $el of this.$contItems.querySelectorAll('[type=root]')) {
                $el.removeAttribute('closed');
                if ($el.hasAttribute('slotted') || this.hasAttribute('slotted')) {
                    $el.children[0].assignedElements()[0].removeAttribute('closed');
                }
            }
            return;
        }

        for (let id of ids) {
            let $el = this.$contItems.querySelector('#' + id);
            if ($el == null) {
                throw new Error('No tree node with ID ' + id);
            }

            if ($el.hasAttribute('slotted') || this.hasAttribute('slotted')) {
                $el.children[0].assignedElements()[0].removeAttribute('closed');
            }
            $el.removeAttribute('closed');
        }
    }

    _filterRecursive($item, filterText, showParent) {
        let showSelf = filterText == null;

        let textContent = $item.getAttribute('filter-text');
        let isMatch = false;
        if (textContent != null && textContent !== '') {
            isMatch = textContent.toLowerCase().includes(filterText);
        } else {
            isMatch = $item.children[0].innerHTML.toLowerCase().includes(filterText);
        }
        showSelf ||= isMatch;
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
     * @param {boolean} useSlot
     */
    _renderLeaf($elem) {
        let $cont = document.createElement('div');
        const parent = $elem.getAttribute('parent');
        if (parent != null) {
            $cont.setAttribute('parent', parent);
        }
        if ($elem.getAttribute('selected') != null) {
            $cont.setAttribute('selected', '');
        }

        let filterText = $elem.getAttribute('filter-text');
        if (filterText != null) {
            $cont.setAttribute('filter-text', filterText);
        }
        if ($elem.getAttribute('closed') != null) {
            $cont.setAttribute('closed', true);
        }
        $cont.id = $elem.id;
        $elem.slot = $elem.id;
        $cont.classList.add('cont-elem');
        $elem.id = '';
        $elem.classList.add('list-elem');
        $cont.setAttribute('type', 'leaf');
        const useSlot = $elem.hasAttribute('slotted') || this.hasAttribute('slotted');
        if (useSlot) {
            let $slot = document.createElement('slot');
            $slot.name = $cont.id;
            $cont.append($slot);
        } else {
            $cont.append($elem);
        }
        return $cont;
    }
}
if (!customElements.get('he-tree')) {
    customElements.define("he-tree", HeliumTree);
}

export { HeliumTree };
