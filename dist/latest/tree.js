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
    
    /**
     * 
     * @param {HTMLElement} $elem
     * @param {null|string|Array<string>} parentId
     * @param {boolean} [asRootNode=false]
     * @returns {void}
     */
    addNode($elem, parentId, asRootNode=false) {
        $elem = this._renderLeaf($elem);
        if (asRootNode) {
            $elem = this._toRootNode($elem);
        }

        if (!Array.isArray(parentId)) {
            parentId = [parentId];
        }

        for (const id of parentId) {
            this.$contItems.querySelectorAll(`.cont-elem[node-id="${id}"]`)
                .forEach($el => this._setParent($elem.cloneNode(true), $el));
        }
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

            const $parent = this.$contItems.querySelector(`[node-id="${selParent}"]`);
            if ($parent == null) {
                throw new Error('No parent found with id: ' + selParent);
            }

            this._setParent($elem, $parent);
        }
    }

    /**
     * @param {string} filterText
     * @param {boolean} [includeRoots=false]
     * @returns {Self}
     */
    filter(filterText, includeRoots=false) {
        if (filterText != null) {
            filterText = filterText.toLowerCase();
        }
        for(const $elem of this.$contItems.children) {
            this._filterRecursive($elem, filterText, false, includeRoots);
        }

        return this;
    }

    /**
     * @returns Array.<string>
     */
    getOpen() {
        return Array.from(this.$contItems.querySelectorAll('[type=root]:not([closed])'))
            .map($el => $el.getAttribute('node-id'));
    }

    /**
     * @returns Array.<string>
     */
    getClosed() {
        return Array.from(this.$contItems.querySelectorAll('[type=root][closed]'))
            .map($el => $el.getAttribute('node-id'));
    }

    /**
     * @param {null|string|Array<string>} selector
     * @returns {Self}
     */
    setClosed(id=null) {
        this.setClosed(id, true);
        return this;
    }


    /**
     * @param {null|string|Array<string>} id
     * @returns {Self}
     */
    setOpen(id=null) {
        this._setClosed(id, false);
        return this;
    }
    
    setParent(nodeId, parentId) {
        let elems = this.$contItems.querySelectorAll(`[node-id="${nodeId}"]`);

        if (parentId == null) {
            elems.forEach($el => this.$contItems.append($el));
            return;
        }

        let parents = this.$contItems.querySelectorAll(`[node-id="${parentId}"]`);
        parents.forEach($par => {
            elems.forEach($el => {
                this._setParent($el, $par);
            });
        });
    }

    /**
     * Converts the selected leaf items to a root items
     * @param {string|Array<string>} id
     * @returns {Self}
     */
    toRootNode(id) {
        let items = this._queryIds(id);
        for (const $item of items) {
            this._toRootNode($item);
        }

        return this;
    }

    _filterRecursive($item, filterText, showParent, includeRoots, exact) {
        let showSelf = filterText == null;
        const isRoot = $item.getAttribute('type') === 'root';

        let itemText = $item.hasAttribute('filter-text')
            ? $item.getAttribute('filter-text')
            : $item.children[0].innerHTML;

        itemText = itemText.toLowerCase();

        let isMatch = false;
        if (!isRoot || (isRoot && includeRoots)) {
            isMatch = exact 
                ? itemText === filterText
                : itemText.includes(filterText);
        }
        showSelf ||= isMatch;

        let showChild = false;
        if (isRoot) {
            let $contChildren = $item.children[1];
            for(const $elem of $contChildren.children) {
                let ret = this._filterRecursive($elem, filterText, showSelf || showParent, includeRoots);
                showChild = showChild || ret;
            }
        }

        if (showChild) {
            $item.style.display = '';
            $item.removeAttribute('closed');

        } else if (showSelf) {
            $item.style.display = '';
            $item.setAttribute('closed', '');

        } else if (showParent) {
            $item.style.display = '';

        } else {
            $item.style.display = 'none';
            $item.setAttribute('closed', '');
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
        let nodeId = $elem.getAttribute('node-id') ?? $elem.id;
        $cont.setAttribute('node-id', nodeId);
        $elem.slot = nodeId;
        $cont.classList.add('cont-elem');
        $elem.classList.add('list-elem');
        $cont.setAttribute('type', 'leaf');
        const useSlot = $elem.hasAttribute('slotted') || this.hasAttribute('slotted');
        if (useSlot) {
            let $slot = document.createElement('slot');
            $slot.name = nodeId;
            $cont.append($slot);
        } else {
            $cont.append($elem);
        }
        return $cont;
    }

    /**
     * @param {?string} [selector=null]
     * @param {boolean} [closed=true]
     */
    _setClosed(ids=null, closed=true) {
        if (ids == null) {
            for (let $el of this.$contItems.querySelectorAll('[type=root]')) {
                if (closed) {
                    $el.setAttribute('closed', '');
                } else {
                    $el.removeAttribute('closed');
                }
            }
            return;
        }

        for (let $el of this._queryIds(ids)) {
            if (closed) {
                $el.setAttribute('closed', '');
            } else {
                $el.removeAttribute('closed');
            }
        }
    };


    /**
     * 
     * @param {HTMLDivElement} $elem
     * @returns {HTMLDivElement}
     */
    _toRootNode($elem) {
        if ($elem.getAttribute('type') === 'root') {
            return $elem;
        }

        $elem.setAttribute('type', 'root');
        let $contChildren = document.createElement('div');
        $contChildren.classList.add('cont-children');
        $elem.append($contChildren);

        if (this.getAttribute('fold') === 'click') {
            $elem.children[0].addEventListener('click', () => this._clickRootCallback.bind(this)($elem));
        }

        return $elem;
    }

    _setParent($elem, $parent) {
        this._toRootNode($parent);
        $parent.children[1].append($elem);
    }

    _showChildren($elem) {
        $elem.removeAttribute('closed');
    }

    /**
     * 
     * @param {Array<string>} ids
     * @returns {Array<HTMLElement>}
     */
    _queryIds(ids) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        let elements = [];
        for (let id of ids) {
            this.$contItems.querySelectorAll(`.cont-elem[node-id="${id}"]`).forEach($el => elements.push($el));
        }
        return elements;
    }
}

if (!customElements.get('he-tree')) {
    customElements.define("he-tree", HeliumTree);
}

export { HeliumTree };
