import sheet from './tree.css';

/**
 * @typedef {HTMLDivElement} HTMLNode
 */

export class HeliumTree extends HTMLElement {
    static observedAttributes = [
    ];
    /** @type {HTMLDivElement} */
    $contNodes;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.$contNodes = document.createElement('div');
        this.$contNodes.id = 'cont-nodes';
        shadow.append(this.$contNodes);
        shadow.adoptedStyleSheets = [sheet];
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            default:
                break;
        }
    }
    
    /**
     * 
     * @param {HTMLElement} $node
     * @param {null|string|Array<string>} parentId
     * @param {boolean} [asRootNode=false]
     * @returns {void}
     */
    addNode($elem, parentId, asRootNode=false) {
        if (this._isSlotted($elem)) {
            this.append($elem);
        }
        let $node = this._nodeToLeaf($elem, true);
        if (asRootNode) {
            $node = this._nodeToRoot($node);
        }

        if (!Array.isArray(parentId)) {
            parentId = [parentId];
        }

        for (const pId of parentId) {
            if (pId == null) {
                this._setParent($node.cloneNode(true), null);
            }
        }

        this._queryIds(parentId)
            .forEach($parent => this._setParent($node.cloneNode(true), $parent));
    }

    connectedCallback() {
        let $$nodes = [];
        for (let $elem of Array.from(this.children)) {
            let $node = this._nodeToLeaf($elem, true);
            this.$contNodes.append($node);
            $$nodes.push($node)
        }

        for (let $node of $$nodes) {
            const selParent = $node.getAttribute('parent');
            if (selParent == null) {
                this.$contNodes.append($node);
                continue;
            }

            const $parent = this.$contNodes.querySelector(`[node-id="${selParent}"]`);
            if ($parent == null) {
                throw new Error('No parent found with id: ' + selParent);
            }

            this._setParent($node, $parent);
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
        for(const $node of this.$contNodes.children) {
            this._filterRecursive($node, filterText, false, includeRoots);
        }

        return this;
    }

    /**
     * @returns Array.<string>
     */
    getOpen() {
        return Array.from(this.$contNodes.querySelectorAll('[type=root]:not([closed])'))
            .map($el => $el.getAttribute('node-id'));
    }

    /**
     * @returns Array.<string>
     */
    getClosed() {
        return Array.from(this.$contNodes.querySelectorAll('[type=root][closed]'))
            .map($el => $el.getAttribute('node-id'));
    }

    /**
     * 
     * @param {'before'|'after'|'inside'} location
     * @param {string} 
     * @returns {Self}
     */
    moveNode(location, nodeId, referenceId) {
        // TODO(marco): Finish implementation
        switch (location) {
            case 'inside':
                return this.setParent(nodeId, referenceId);
        }

        let $$nodes = this._queryIds(nodeId);

        if ($$nodes[0] == null) {
            throw new Error(`Node with ID ${nodeId} not found!`);
        }

        let refElems = this.$contNodes.querySelectorAll(`[node-id="${parentId}"]`);
        refElems.forEach($par => {
            elems.forEach($el => {
                this._setParent($el, $par);
            })
        })
    }

    /**
     * 
     * @param {string} nodeId
     * @returns {HTMLElement}
     */
    removeNode(nodeId) {
        let $$nodes = this._queryIds(nodeId);

        if ($$nodes[0] == null) {
            throw new Error(`Node with ID ${nodeId} not found!`);
        }

       let $inner = this._nodeToInner($$nodes[0]);

        for (let $node of $$nodes) {
            $node.remove();
        }

        return $inner;
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
        let $$nodes = this._queryIds(nodeId);

        if (parentId == null) {
            $$nodes.forEach($el => this.$contNodes.append($el));
            return this;
        }

        let parents = this._queryIds(parentId);
        parents.forEach($par => {
            $$nodes.forEach($el => {
                this._setParent($el, $par);
            })
        })

        return this;
    }

    /**
     * Converts the selected leaf nodes to a root nodes
     * @param {string|Array<string>} id
     * @returns {Self}
     */
    toRootNode(id) {
        let $$nodes = this._queryIds(id);
        for (const $node of $$nodes) {
            this._nodeToRoot($node);
        }

        return this;
    }

    _filterRecursive($node, filterText, showParent, includeRoots, exact) {
        let showSelf = filterText == null;
        const isRoot = $node.getAttribute('type') === 'root';

        let nodeText = $node.hasAttribute('filter-text')
            ? $node.getAttribute('filter-text')
            : $node.children[0].innerHTML;

        nodeText = nodeText.toLowerCase();

        let isMatch = false;
        if (!isRoot || (isRoot && includeRoots)) {
            isMatch = exact 
                ? nodeText === filterText
                : nodeText.includes(filterText);
        }
        showSelf ||= isMatch;

        let showChild = false;
        if (isRoot) {
            let $contChildren = $node.children[1]
            for(const $elem of $contChildren.children) {
                let ret = this._filterRecursive($elem, filterText, showSelf || showParent, includeRoots);
                showChild = showChild || ret;
            }
        }

        if (showChild) {
            $node.style.display = '';
            $node.removeAttribute('closed');

        } else if (showSelf) {
            $node.style.display = '';
            $node.setAttribute('closed', '');

        } else if (showParent) {
            $node.style.display = '';

        } else {
            $node.style.display = 'none';
            $node.setAttribute('closed', '');
        }

        return showSelf || showChild;
    }

    _clickRootCallback($node) {
        this._toggleChildren($node);
    }

    _hideChildren($node) {
        $node.setAttribute('closed', 'true');
    }

    /**
     * @param {HTMLNode|HTMLElement} $node 
     * @param {boolean} [fromInner=false]
     * @return {HTMLNode}
     */
    _nodeToLeaf($node, fromInner=false) {
        if (!fromInner) {
            throw new Error('Not implemented'); // TODO(marco)
        }

        let $cont = document.createElement('div');
        const parentId = $node.getAttribute('parent');
        if (parentId != null) {
            $cont.setAttribute('parent', parentId);
        }
        if ($node.getAttribute('selected') != null) {
            $cont.setAttribute('selected', '');
        }

        let filterText = $node.getAttribute('filter-text');
        if (filterText != null) {
            $cont.setAttribute('filter-text', filterText);
        }
        if ($node.getAttribute('closed') != null) {
            $cont.setAttribute('closed', true);
        }
        let nodeId = $node.getAttribute('node-id') ?? $node.id;
        $cont.setAttribute('node-id', nodeId);
        $cont.classList.add('node');
        $node.classList.add('node-content');
        $cont.setAttribute('type', 'leaf');
        const useSlot = this._isSlotted($node);
        if (useSlot) {
            let slotName = 'slot' + Math.floor(Math.random() * (9999999 - 1000000 + 9999999) + 1000000).toString()
            let $slot = document.createElement('slot');
            $node.slot = slotName;
            $slot.name = slotName;
            $cont.append($slot);
        } else {
            $cont.append($node);
        }
        return $cont;
    }

    _showChildren($node) {
        $node.removeAttribute('closed');
    }

    /**
     * @param {?string} [selector=null]
     * @param {boolean} [closed=true]
     */
    _setClosed(ids=null, closed=true) {
        if (ids == null) {
            for (let $node of this.$contNodes.querySelectorAll('[type=root]')) {
                if (closed) {
                    $node.setAttribute('closed', '');
                } else {
                    $node.removeAttribute('closed');
                }
            }
            return;
        }

        for (let $node of this._queryIds(ids)) {
            if (closed) {
                $node.setAttribute('closed', '');
            } else {
                $node.removeAttribute('closed');
            }
        }
    };

    /**
     * 
     * @param {HTMLNode} $node
     * @param {?HTMLNode} $parent
     * @returns {void}
     */
    _setParent($node, $parent) {
        if ($parent == null) {
            this.$contNodes.append($node);
            return;
        }
        this._nodeToRoot($parent);
        $parent.children[1].append($node);
    }


    _toggleChildren($node) {
        if ($node.getAttribute('closed')) {
            this._showChildren($node);
        } else {
            this._hideChildren($node);
        }
    }

    /**
     * 
     * @param {HTMLNode} $node
     * @returns {HTMLNode}
     */
    _nodeToRoot($node) {
        if ($node.getAttribute('type') === 'root') {
            return $node;
        }

        $node.setAttribute('type', 'root');
        let $contChildren = document.createElement('div');
        $contChildren.classList.add('cont-children');
        $node.append($contChildren);

        if (this.getAttribute('fold') === 'click') {
            $node.children[0].addEventListener('click', () => this._clickRootCallback.bind(this)($node));
        }

        return $node;
    }


    /**
     * 
     * @param {HTMLNode} $node
     * @returns {HTMLElement}
     */
    _nodeToInner($node) {
        if (this._isSlotted($node)) {
            return $node.children[0].assignedElements()[0];
        }

        return $node.children[0];
    }

    /**
     * 
     * @param {HTMLNode} $node
     * @returns {boolean}
     */
    _isSlotted($node) {
        return $node.hasAttribute('slotted') || this.hasAttribute('slotted');
    }

    /**
     * 
     * @param {string|Array<string>} ids
     * @returns {Array<HTMLNode>}
     */
    _queryIds(ids) {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        let $$nodes = [];
        for (let id of ids) {
            this.$contNodes.querySelectorAll(`.node[node-id="${id}"]`)
                .forEach($node => $$nodes.push($node));
        }
        return $$nodes;
    }
}

if (!customElements.get('he-tree')) {
    customElements.define("he-tree", HeliumTree);
}
