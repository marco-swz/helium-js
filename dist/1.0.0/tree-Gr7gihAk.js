import { _ as __decorate, i, r, b } from './lit-element-CVcEPTag.js';
import { t } from './custom-element-DX8pDbbK.js';
import { e, n } from './ref-CgVzTi_x.js';

var styles = ":host {\n    display: block;\n    overflow: auto;\n    height: 100%;\n}\n\n.cont-children {\n    padding-left: 20px;\n    position: relative;\n    overflow: hidden;\n    display: block;\n\n    &::before {\n        content: '';\n        width: 0;\n        height: 100%;\n        position: absolute;\n        border: 1px solid lightgrey;\n        top: 0;\n        left: 11px;\n    }\n\n    &:hover {\n        &::before {\n            transition: border-color 0.2s;\n            border-color: grey;\n        }\n    }\n}\n\n.node-content {\n    padding: 8px 10px;\n    display: inline-block;\n    width: 100%;\n    width: -moz-available;          /* WebKit-based browsers will ignore this. */\n    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */\n    width: fill-available;\n    color: black;\n    text-decoration: none;\n    border-radius: 5px;\n    text-wrap: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    \n    &:hover {\n        background-color: whitesmoke;\n    }\n}\n\n.node[selected] {\n    .node-content {\n        background-color: whitesmoke;\n    }\n}\n\ndiv[type=\"root\"] {\n    font-weight: 500;\n    display: flex;\n    flex-direction: column;\n\n    & > .node-content {\n        text-transform: uppercase;\n        cursor: pointer;\n        \n        &::before {\n            transition: transform 0.1s;\n            font-family: \"Font Awesome 5 Pro\";\n            content: \"\\f105\";\n            color: grey;\n            padding-right: 5px;\n            display: inline-block;\n            transform: rotate(90deg) translate(3px, 3px);\n        }\n    }\n}\n\ndiv[type=\"leaf\"] {\n    font-weight: 400;\n    display: flex;\n    flex-direction: column;\n}\n\ndiv[closed] {\n    & > .cont-children {\n        display: none;\n    }\n\n    & > .node-content::before {\n        transition: transform 0.1s;\n        transform: rotate(0deg) translate(0, 0);\n    }\n}\n";

/**
 *
 * @tag he-tree
 */
let HeliumTree = class HeliumTree extends i {
    static get styles() {
        return [
            r(styles),
        ];
    }
    constructor() {
        super();
        this._refContNodes = e();
    }
    render() {
        return b `
            <div id="cont-nodes"
                ${n(this._refContNodes)}
            >
                <slot
                    @slotchange=${this._handleSlotChangeDefault.bind(this)}
                ></slot>
            </div>
        `;
    }
    /**
     *
     */
    addNode($elem, parentId, asRootNode = false) {
        if (parentId) {
            $elem.setAttribute('tree-parent', parentId);
        }
        if (asRootNode) {
            $elem.setAttribute('tree-type', 'root');
        }
        this.append($elem);
        return this;
    }
    /**
     *
     */
    replaceNode(nodeId, $newElem) {
        let $$nodes = this._queryIds(nodeId);
        for (let $node of $$nodes) {
            const $new = $newElem.cloneNode(true);
            if ($node.hasAttribute('tree-parent')) {
                $new.setAttribute('tree-parent', $node.getAttribute('tree-parent') ?? '');
            }
            if ($node.hasAttribute('tree-type')) {
                $new.setAttribute('tree-type', $node.getAttribute('tree-type') ?? '');
            }
            if ($node.hasAttribute('slot')) {
                $new.setAttribute('slot', $node.getAttribute('slot') ?? '');
            }
            $node.replaceWith($new);
        }
        return this;
    }
    clearNodes() {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return;
        }
        for (let $node of Array.from($contNodes.children)) {
            // let $inner = this._nodeToInner($node);
            // $inner.remove();
            $node.remove();
        }
    }
    /**
     *
     */
    filter(filterText, includeRoots = false) {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return this;
        }
        if (filterText != null) {
            filterText = filterText.toLowerCase();
        }
        for (const $node of $contNodes.children) {
            this._filterRecursive($node, filterText, false, includeRoots);
        }
        return this;
    }
    /**
     * @returns Array.<string>
     */
    getOpen() {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return;
        }
        return Array.from($contNodes.querySelectorAll('[tree-type=root]:not([closed])'))
            .map($el => $el.getAttribute('node-id'));
    }
    /**
     * @returns Array.<string>
     */
    getClosed() {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return;
        }
        return Array.from($contNodes.querySelectorAll('[tree-type=root][closed]'))
            .map($el => $el.getAttribute('node-id'));
    }
    /**
     *
     */
    hasChildren(nodeId) {
        let $node = this._queryIds(nodeId)[0];
        return $node.querySelector('.cont-children').children.length > 0;
    }
    /**
     *
     * @param {'before'|'after'|'inside'} location
     * @param {string} nodeId
     * @returns {Self}
     */
    moveNode(location, nodeId, referenceId) {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return this;
        }
        // TODO(marco): Finish implementation
        switch (location) {
            case 'inside':
                return this.setParent(nodeId, referenceId);
        }
        let $$nodes = this._queryIds(nodeId);
        if ($$nodes[0] == null) {
            throw new Error(`Node with ID ${nodeId} not found!`);
        }
        return this;
        /*
        let refElems = $contNodes.querySelectorAll(`[node-id="${referenceId}"]`);
        refElems.forEach($par => {
            elems.forEach($el => {
                this._setParent($el, $par);
            })
        })
        */
    }
    /**
     *
     */
    removeNode(nodeId) {
        let $$nodes = this._queryIds(nodeId);
        if ($$nodes[0] == null) {
            throw new Error(`Node with ID ${nodeId} not found!`);
        }
        // let $inner = this._nodeToInner($$nodes[0]);
        for (let $node of $$nodes) {
            $node.remove();
        }
        return $$nodes[0];
        // return $inner;
    }
    /**
     *
     */
    setClosed(id) {
        this._setClosed(id, true);
        return this;
    }
    /**
     *
     */
    setOpen(id) {
        this._setClosed(id, false);
        return this;
    }
    setParent(nodeId, parentId = null) {
        const $$nodes = this._queryIds(nodeId);
        $$nodes.forEach($el => {
            if (parentId == null) {
                $el.removeAttribute('parent');
            }
            else {
                $el.setAttribute('parent', parentId);
            }
        });
        return this;
    }
    /**
     * Converts the selected leaf nodes to a root nodes
     */
    toRootNode(nodeId) {
        const $$nodes = this._queryIds(nodeId);
        for (const $node of $$nodes) {
            $node.setAttribute('tree-type', 'root');
        }
        return this;
    }
    /**
     *
     */
    _createLeafWrapper($node) {
        if ($node.hasAttribute('tree-parent')) {
            b `parent="${$node.getAttribute('tree-parent')}"`;
        }
        if ($node.hasAttribute('filter-text')) {
            b `filter-text="${$node.getAttribute('filter-text')}"`;
        }
        const slotName = 'slot' + Math.floor(Math.random() * (9999999 - 1000000 + 9999999) + 1000000).toString();
        $node.setAttribute('slot', slotName);
        $node.setAttribute('tree-type', 'leaf');
        const $wrapper = document.createElement('div');
        const $slot = document.createElement('slot');
        $slot.name = slotName;
        $slot.addEventListener('slotchange', this._handleSlotChange.bind(this));
        $wrapper.append($slot);
        return $wrapper;
    }
    _filterRecursive($node, filterText, showParent, includeRoots, exact = false) {
        let showSelf = filterText == null;
        const isRoot = $node.getAttribute('type') === 'root';
        let nodeText = $node.hasAttribute('filter-text')
            ? $node.getAttribute('filter-text')
            : $node.children[0].innerHTML;
        nodeText = nodeText?.toLowerCase() ?? '';
        let isMatch = false;
        if (!isRoot || (isRoot && includeRoots)) {
            isMatch = exact
                ? nodeText === filterText
                : nodeText.includes(filterText);
        }
        showSelf ||= isMatch;
        let showChild = false;
        if (isRoot) {
            let $contChildren = $node.children[1];
            for (const $elem of $contChildren.children) {
                let ret = this._filterRecursive($elem, filterText, showSelf || showParent, includeRoots);
                showChild = showChild || ret;
            }
        }
        if (showChild) {
            $node.style.display = '';
            $node.removeAttribute('closed');
        }
        else if (showSelf) {
            $node.style.display = '';
            $node.setAttribute('closed', '');
        }
        else if (showParent) {
            $node.style.display = '';
        }
        else {
            $node.style.display = 'none';
            $node.setAttribute('closed', '');
        }
        return showSelf || showChild;
    }
    _handleClickFold($node) {
        this._toggleChildren($node);
    }
    _handleSlotChange(evt) {
        const $slot = evt.currentTarget;
        const assigned = $slot.assignedElements();
        if (assigned.length === 0) {
            $slot.parentElement?.remove();
            return;
        }
        const observer = new MutationObserver((mutations, _observer) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    const attr = mutation.attributeName;
                    if (attr == null) {
                        continue;
                    }
                    const $node = mutation.target;
                    const value = $node.getAttribute(attr);
                    switch (attr) {
                        case 'tree-parent':
                            this._setParent($node, value);
                            break;
                        case 'tree-type':
                            if (value === 'root') {
                                this._leafToRoot($node);
                            }
                            else if (value === 'leaf') {
                                this._rootToLeaf($node);
                            }
                            else {
                                throw new Error(`Invalid tree type: ${value}`);
                            }
                        case 'tree-closed':
                            this._setClosed();
                    }
                }
            }
        });
        if (assigned.length > 1) {
            throw new Error('Only one element per slot allowed');
        }
        observer.observe(assigned[0], { attributes: true, subtree: false, childList: false });
    }
    _handleSlotChangeDefault(evt) {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return;
        }
        const $slot = evt.currentTarget;
        for (const $elem of $slot.assignedElements()) {
            const $newSlot = this._createLeafWrapper($elem);
            $contNodes.append($newSlot);
        }
    }
    _hideChildren($node) {
        $node.setAttribute('closed', 'true');
    }
    /**
     *
     */
    _setClosed(nodeId = null, closed = true) {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return;
        }
        if (nodeId == null) {
            for (let $node of $contNodes.querySelectorAll('[tree-type=root]')) {
                let $content = $node;
                if (closed) {
                    $node.setAttribute('closed', '');
                    $content.setAttribute('closed', '');
                }
                else {
                    $node.removeAttribute('closed');
                    $content.removeAttribute('closed');
                }
            }
            return;
        }
        for (const $node of this._queryIds(nodeId)) {
            const $content = $node;
            if (closed) {
                $node.setAttribute('closed', '');
                $content.setAttribute('closed', '');
            }
            else {
                $node.removeAttribute('closed');
                $content.removeAttribute('closed');
            }
        }
    }
    ;
    /**
     *
     */
    _setParent($wrapper, parentId) {
        // TODO(marco): Figure out, how to handle one-to-many node to wrapper mappings.
        // Multiple slots? How to use wrapper functions like this one?
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return;
        }
        if (parentId == null) {
            $contNodes.append($wrapper);
            return;
        }
        const $$parentNodes = this._queryIds(parentId);
        for (const $parentNode of $$parentNodes) {
            if ($parentNode.getAttribute('tree-type') === 'leaf') {
                this._leafToRoot($parentNode);
            }
            const $parentWrapper = this._getNodeWrapper($parentNode);
            $parentWrapper.children[1].append($wrapper.cloneNode(true));
        }
    }
    _showChildren($node) {
        $node.removeAttribute('closed');
    }
    _getNodeWrapper($node) {
        const $wrapper = $node.assignedSlot?.parentElement;
        if ($wrapper == null) {
            // TODO: Properly detect unwrapped elements
            throw new Error('Node element was not wrapped');
        }
        return $wrapper;
    }
    _toggleChildren($node) {
        if ($node.getAttribute('closed')) {
            this._showChildren($node);
        }
        else {
            this._hideChildren($node);
        }
    }
    /**
     *
     */
    _leafToRoot($node) {
        $node.setAttribute('type', 'root');
        const $wrapper = this._getNodeWrapper($node);
        const $contChildren = document.createElement('div');
        $contChildren.classList.add('cont-children');
        $wrapper.append($contChildren);
        // $node.children[0].addEventListener('click', () => this._handleClickFold.bind(this)($node));
        return $node;
    }
    _rootToLeaf($node) {
        $node.setAttribute('type', 'leaf');
        const $wrapper = this._getNodeWrapper($node);
        $wrapper.children[1].remove();
        $node.children[0].addEventListener('click', () => this._handleClickFold.bind(this)($node));
        return $node;
    }
    /**
     *
     */
    _queryIds(ids) {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return [];
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        let $$nodes = [];
        for (let id of ids) {
            $contNodes.querySelectorAll(`[tree-id="${id}"]`)
                .forEach($node => $$nodes.push($node));
        }
        return $$nodes;
    }
};
HeliumTree = __decorate([
    t('he-tree')
], HeliumTree);

export { HeliumTree };
