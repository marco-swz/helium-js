// @ts-ignore
import styles from "./tree.css";
import { LitElement, TemplateResult, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeCSS } from 'lit-element';
import { createRef, ref, Ref } from "lit/directives/ref.js";

type NodeElement = HTMLDivElement;
type NodeWrapper = HTMLDivElement;

/**
 *
 * @tag he-tree
 */
@customElement('he-tree')
export class HeliumTree extends LitElement {
    static get styles() {
        return [
            unsafeCSS(styles),
        ];
    }

    _refContNodes: Ref<HTMLDivElement> = createRef();

    constructor() {
        super();
    }

    render(): TemplateResult<1> {
        return html`
            <div id="cont-nodes"
                ${ref(this._refContNodes)}
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
    addNode($elem: NodeElement, parentId: null | string, asRootNode = false): HeliumTree {
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
    replaceNode(nodeId: string, $newElem: NodeElement): HeliumTree {
        let $$nodes = this._queryIds(nodeId);
        for (let $node of $$nodes) {
            const $new = $newElem.cloneNode(true) as NodeElement;

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
    filter(filterText: string, includeRoots = false): HeliumTree {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return this;
        }

        if (filterText != null) {
            filterText = filterText.toLowerCase();
        }

        for (const $node of $contNodes.children) {
            this._filterRecursive($node as NodeElement, filterText, false, includeRoots);
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
    hasChildren(nodeId: string): boolean {
        let $node = this._queryIds(nodeId)[0];
        return $node.querySelector('.cont-children')!.children.length > 0;
    }

    /**
     * 
     * @param {'before'|'after'|'inside'} location
     * @param {string} nodeId
     * @returns {Self}
     */
    moveNode(location: 'before' | 'after' | 'inside', nodeId: string, referenceId: string): HeliumTree {
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
    removeNode(nodeId: string): NodeElement {
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
    setClosed(id?: string): HeliumTree {
        this._setClosed(id, true);
        return this;
    }

    /**
     *
     */
    setOpen(id?: string): HeliumTree {
        this._setClosed(id, false);
        return this;
    }

    setParent(nodeId: string, parentId: string | null = null): HeliumTree {
        const $$nodes = this._queryIds(nodeId);
        $$nodes.forEach($el => {
            if (parentId == null) {
                $el.removeAttribute('parent');
            } else {
                $el.setAttribute('parent', parentId)
            }
        })
        return this;
    }

    /**
     * Converts the selected leaf nodes to a root nodes
     */
    toRootNode(nodeId: string): HeliumTree {
        const $$nodes = this._queryIds(nodeId);
        for (const $node of $$nodes) {
            $node.setAttribute('tree-type', 'root');
        }

        return this;
    }

    /**
     *
     */
    private _createLeafWrapper($node: NodeElement): HTMLDivElement {
        let parentAttr: TemplateResult<1> | Symbol = nothing;
        if ($node.hasAttribute('tree-parent')) {
            parentAttr = html`parent="${$node.getAttribute('tree-parent')}"`;
        }

        let filterAttr: TemplateResult<1> | Symbol = nothing;
        if ($node.hasAttribute('filter-text')) {
            filterAttr = html`filter-text="${$node.getAttribute('filter-text')}"`;
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

    private _filterRecursive(
        $node: NodeElement,
        filterText: string,
        showParent: boolean,
        includeRoots: boolean,
        exact: boolean = false,
    ): boolean {
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
            let $contChildren = $node.children[1]
            for (const $elem of $contChildren.children) {
                let ret = this._filterRecursive($elem as NodeElement, filterText, showSelf || showParent, includeRoots);
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

    private _handleClickFold($node: NodeElement): void {
        this._toggleChildren($node);
    }

    private _handleSlotChange(evt: Event): void {
        const $slot = evt.currentTarget as HTMLSlotElement;
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
                    const $node = mutation.target as NodeElement;
                    const value = $node.getAttribute(attr);

                    switch (attr) {
                        case 'tree-parent':
                            this._setParent($node, value);
                            break;
                        case 'tree-type':
                            if (value === 'root') {
                                this._leafToRoot($node);
                            } else if (value === 'leaf') {
                                this._rootToLeaf($node);
                            } else {
                                throw new Error(`Invalid tree type: ${value}`);
                            }
                        case 'tree-closed':
                            this._setClosed()
                    }
                }
            }
        })

        if (assigned.length > 1) {
            throw new Error('Only one element per slot allowed');
        }

        observer.observe(assigned[0], { attributes: true, subtree: false, childList: false })
    }

    private _handleSlotChangeDefault(evt: Event): void {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return;
        }

        const $slot = evt.currentTarget as HTMLSlotElement;
        for (const $elem of $slot.assignedElements()) {
            const $newSlot = this._createLeafWrapper($elem as NodeElement);
            $contNodes.append($newSlot);
        }
    }

    private _hideChildren($node: NodeElement) {
        $node.setAttribute('closed', 'true');
    }

    /**
     *
     */
    private _setClosed(nodeId: string | null = null, closed: boolean = true): void {
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
                } else {
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
            } else {
                $node.removeAttribute('closed');
                $content.removeAttribute('closed');
            }
        }
    };

    /**
     * 
     */
    private _setParent($wrapper: NodeWrapper, parentId: string | null): void {
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

    private _showChildren($node: NodeElement) {
        $node.removeAttribute('closed');
    }


    private _getNodeWrapper($node: NodeElement): HTMLDivElement {
        const $wrapper = $node.assignedSlot?.parentElement;
        if ($wrapper == null) {
            // TODO: Properly detect unwrapped elements
            throw new Error('Node element was not wrapped');
        }

        return $wrapper as HTMLDivElement;
    }

    private _toggleChildren($node: NodeElement) {
        if ($node.getAttribute('closed')) {
            this._showChildren($node);
        } else {
            this._hideChildren($node);
        }
    }

    /**
     * 
     */
    private _leafToRoot($node: NodeElement): NodeElement {
        $node.setAttribute('type', 'root');
        const $wrapper = this._getNodeWrapper($node);
        const $contChildren = document.createElement('div');
        $contChildren.classList.add('cont-children');
        $wrapper.append($contChildren);

        // $node.children[0].addEventListener('click', () => this._handleClickFold.bind(this)($node));
        return $node;
    }

    private _rootToLeaf($node: NodeElement): NodeElement {
        $node.setAttribute('type', 'leaf');
        const $wrapper = this._getNodeWrapper($node);
        $wrapper.children[1].remove();

        $node.children[0].addEventListener('click', () => this._handleClickFold.bind(this)($node));
        return $node;
    }

    /**
     * 
     */
    private _queryIds(ids: string | Array<string>): Array<NodeElement> {
        const $contNodes = this._refContNodes.value;
        if ($contNodes == null) {
            return [];
        }

        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        let $$nodes: Array<NodeElement> = [];
        for (let id of ids) {
            $contNodes.querySelectorAll<NodeElement>(`[tree-id="${id}"]`)
                .forEach($node => $$nodes.push($node));
        }
        return $$nodes;
    }
}
