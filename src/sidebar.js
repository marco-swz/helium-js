// @ts-ignore
import sheet from "./sidebar.css" with { type: "css" };
import { HeliumTree } from './tree.js';

export class HeliumSidebar extends HTMLElement {
    static observedAttributes = [
        'open',
    ];
    /** @type {HTMLElement} */
    $sidebar;
    /** @type {HTMLDivElement} */
    $contPagetree;
    /** @type {HTMLDivElement} */
    $contAction;
    /** @type {HTMLDivElement} */
    $contSidebar;
    /** @type {HTMLDivElement} */
    $resizer;
    /** @type {HeliumTree} */
    $pagetree;
    /** @type {Array.<string>}
     * The list of pagetree nodes, which where closed before the last search.
     * This is used to restore the pagetree to the state before the search.
     */
    pagetreeClosed = [];
    /** @type {Time} Temorary storage for active search timeout */
    _searchTimeout = null;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.$contSidebar = document.createElement('aside');
        this.$contSidebar.id = 'cont-sidebar';
        const width = localStorage.getItem('he-sidebar_width') ?? '300px';
        this.$contSidebar.style.width = width;
        let $main = document.querySelector('main');
        if ($main != null) {
            $main.style.marginLeft = width;
        }

        this.$sidebar = document.createElement('div');
        this.$sidebar.id = 'sidebar';
        this.$contSidebar.append(this.$sidebar);

        this.$resizer = document.createElement('div');
        this.$resizer.id = 'resizer';
        let callback = this._handleResizeKeydown.bind(this);
        this.$resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.addEventListener("mousemove", callback, false);

            let handler = () => {
                document.removeEventListener("mousemove", callback, false);
                localStorage.setItem('he-sidebar_width', this.$contSidebar.style.width);
                document.removeEventListener('mouseup', handler);
            };

            document.addEventListener('mouseup', handler);
        }, false);
        this.$contSidebar.append(this.$resizer);

        let $opener = document.createElement('div');
        $opener.id = 'opener';
        $opener.onclick = () => this.show();
        this.$contSidebar.append($opener);

        let $header = document.createElement('div');
        $header.id = 'header';
        this.$sidebar.append($header);

        let $tabs = document.createElement('div');
        $tabs.id = 'tabs';
        $header.append($tabs);

        let $btnPages = document.createElement('div');
        $btnPages.id = 'btn-pages';
        $btnPages.innerHTML = '<span>Seiten</span>';
        $btnPages.onclick = () => this.showPages();
        $tabs.append($btnPages);

        let $btnAction = document.createElement('div');
        $btnAction.id = 'btn-action';
        $btnAction.innerHTML = '<span>Aktionen</span>';
        $btnAction.onclick = () => this.showAction();
        $tabs.append($btnAction);

        let $btnHide = document.createElement('div');
        $btnHide.id = 'btn-hide';
        $btnHide.onclick = () => this.hide();
        $header.append($btnHide);

        this.$contPagetree = document.createElement('div');
        this.$contPagetree.id = 'cont-pagetree';
        this.$sidebar.append(this.$contPagetree);

        this.$contAction = document.createElement('div');
        this.$contAction.id = 'cont-action';
        this.$sidebar.append(this.$contAction);

        let $btnLogout = document.createElement('a');
        $btnLogout.id = 'btn-logout';
        $btnLogout.innerHTML = 'Abmelden';
        $btnLogout.href = '/logout';
        this.$contAction.append($btnLogout);

        let $btnReloadRights = document.createElement('a');
        $btnReloadRights.id = 'btn-reload-rights';
        $btnReloadRights.innerHTML = 'Benutzerrechte aktualisieren';
        $btnReloadRights.href = '/reacl';
        this.$contAction.append($btnReloadRights);

        let $btnClassicMenu = document.createElement('div');
        $btnClassicMenu.id = 'btn-classic-menu';
        $btnClassicMenu.innerHTML = 'Klassisches Menü verwenden';
        $btnClassicMenu.onclick = () => this._handleClickClassicMenu.bind(this)();
        this.$contAction.append($btnClassicMenu);

        let $contPageSearch = document.createElement('div');
        $contPageSearch.id = 'cont-page-search';
        this.$contPagetree.append($contPageSearch);

        let $btnPageSearch = document.createElement('div');
        $btnPageSearch.id = 'btn-page-search';
        $contPageSearch.append($btnPageSearch);

        let $inpSearch = document.createElement('input');
        $inpSearch.id = 'inp-search';
        $inpSearch.type = 'search';
        $inpSearch.oninput = () => this._handleInputSearch.bind(this)($inpSearch);
        $btnPageSearch.onclick = () => this._filterPages.bind(this)($inpSearch);
        $contPageSearch.append($inpSearch);

        shadow.append(this.$contSidebar);
        shadow.adoptedStyleSheets = [sheet];

        this.setAttribute('tab', localStorage.getItem('he-sidebar_tab') ?? 'pages');

        const open = localStorage.getItem('he-sidebar_open') === 'true' ?? true;
        if (open) {
            this.setAttribute('open', '');
            this._show(false);
        } else {
            this.removeAttribute('open');
            this._hide(false);
        }
    }

    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'open':
                if (newValue) {
                    this._show();
                } else {
                    this._hide();
                }
                break;
            default:
                break;
        }
    }

    connectedCallback() {
        let $sidenav = document.querySelector('#mySidenav');
        if ($sidenav != null) {
            $sidenav.style.display = 'none';
        }
        let $contPages = this.querySelector('.pages');
        if ($contPages == null) {
            throw new Error('Missing element with class `.pages`');
        }

        this.$pagetree = document.createElement('he-tree');
        this.$pagetree.id = 'pagetree';
        this.$pagetree.innerHTML = $contPages.innerHTML;
        this.$contPagetree.append(this.$pagetree);
    }

    hide() {
        this.removeAttribute('open');
        this._hide();
    }

    show() {
        this.setAttribute('open', '');
        this._show();

    }

    toggle() {
        if (this.getAttribute('open') != null) {
            this.hide();
        } else {
            this.show();
        }
    }

    _hide(animate = true) {
        localStorage.setItem('he-sidebar_open', false);
        let $main = document.querySelector('main');
        const left = `-${this.$contSidebar.style.width}`;
        if (animate) {
            if ($main != null) {
                $main.animate(
                    [
                        { marginLeft: 0 },
                    ],
                    { duration: 100, fill: 'forwards', easing: 'ease-in-out' }
                );
            }
            this.$contSidebar.animate(
                [
                    { left: left },
                ],
                { duration: 100, fill: 'forwards', easing: 'ease-in-out' }
            );
        } else {
            this.$contSidebar.style.left = left;
            if ($main != null) {
                $main.style.marginLeft = 0;
            }
        }
    }

    _show(animate = true) {
        localStorage.setItem('he-sidebar_open', true);
        let $main = document.querySelector('main');
        if (animate) {
            if ($main != null) {
                $main.animate(
                    [
                        { marginLeft: this.$contSidebar.style.width },
                    ],
                    { duration: 100, fill: 'forwards', easing: 'ease-in-out' }
                );
            }
            this.$contSidebar.animate(
                [
                    { left: 0 },
                ],
                { duration: 100, fill: 'forwards', easing: 'ease-in-out' }
            );
        } else {
            this.$contSidebar.style.left = 0;
            let $main = document.querySelector('main');
            if ($main != null) {
                $main.style.marginLeft = this.$contSidebar.style.width;
            }
        }
    }

    showPages() {
        this.setAttribute('tab', 'pages');
        localStorage.setItem('he-sidebar_tab', 'pages');
    }

    showAction() {
        this.setAttribute('tab', 'action');
        localStorage.setItem('he-sidebar_tab', 'action');
    }

    /**
     * @param {HeliumInput} $inpSearch 
     */
    _filterPages($inpSearch) {
        let searchText = $inpSearch.value;
        if (searchText === '') {
            this.$pagetree.filter(null);
            this.$pagetree.setClosed(this.pagetreeClosed);
            return;
        } else {
            this.pagetreeClosed = this.$pagetree.getClosed();
        }

        this.$pagetree.filter(searchText);
    }

    /**
     * @param {HeliumInput} $inpSearch 
     */
    _handleInputSearch($inpSearch) {
        window.clearTimeout(this._searchTimeout);

        this._searchTimeout = setTimeout(() => {
            this._filterPages($inpSearch);
        }, 250);
    }

    _handleClickClassicMenu() {
        let url = window.location.href;
        if (url.indexOf('?') > -1) {
            url += '&newMenu=0'
        } else {
            url += '?newMenu=0'
        }
        window.location.href = url;
    }

    _handleResizeKeydown(evt) {
        const width = evt.x
        if (width < 270) {
            return;
        }
        this.$contSidebar.style.width = `${width}px`;
        let $main = document.querySelector('main');
        if ($main != null) {
            $main.style.marginLeft = `${width}px`;
        }
    }
}

if (!customElements.get('he-sidebar')) {
    customElements.define("he-sidebar", HeliumSidebar);
}
