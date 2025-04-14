import './tree.js';

const sheet = new CSSStyleSheet();sheet.replaceSync("a {\n    outline: none;\n}\n\n#cont-sidebar {\n    position: fixed;\n    left: 0;\n    top: 51px;\n    height: calc(100vh - 51px);\n    width: 300px;\n    display: flex;\n    z-index: 10;\n}\n\n#cont-pagetree {\n    display: none;\n    height: 100%;\n    padding: 20px;\n    padding-top: 0;\n}\n\n#pagetree {\n    overflow: auto;\n    margin-top: 10px;\n    height: 90%;\n}\n\n#sidebar {\n    border-right: 1px solid grey;\n    background-color: white;\n    width: 100%;\n}\n\n#header {\n    padding: 8px 20px;\n    display: flex;\n    gap: 10px;\n    border-bottom: 1px solid lightgrey;\n    margin-bottom: 20px;\n\n    & #btn-hide {\n        margin-left: auto;\n    }\n}\n\n#cont-user {\n    display: flex;\n    flex-direction: column;\n    padding: 20px;\n    padding-top: 0;\n    font-weight: 500;\n\n    & > * {\n        color: black;\n        padding: 8px 10px;\n        text-decoration: none;\n        border-radius: 4px;\n        cursor: pointer;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        text-wrap: nowrap;\n\n        &:hover {\n            transition: background-color 0.2s;\n            background-color: whitesmoke;\n        }\n    }\n}\n\n.main,\n.navCont {\n    margin-left: 300px;\n}\n\n#resizer {\n  z-index: 2;\n  cursor: col-resize;\n  height: 100%;\n  width: 4px;\n  margin-left: -2px;\n}\n\n#opener {\n    display: block;\n    position: fixed;\n    z-index: 100;\n    cursor: pointer;\n    height: 100%;\n    left: 0;\n    width: 10px;\n    background-color: lightgrey;\n}\n\n:host([open]) #opener {\n    display: none;\n}\n\n#tabs {\n    --bg-color: #e6e6e6;\n    display: flex;\n    gap: 5px;\n    padding: 4px;\n    font-size: 15px;\n    font-weight: 500;\n    background-color: var(--bg-color);\n    border-radius: 8px;\n    height: 28px;\n    color: grey;\n    width: fit-content;\n\n    & > div {\n        padding: 5px 10px;\n        cursor: pointer;\n        border-radius: 5px;\n        display: flex;\n        align-items: center;\n\n        &:hover {\n            transition: color 0.2s;\n            color: black;\n        }\n    }\n}\n\n#btn-user::before {\n    font-family: 'Font Awesome 5 Pro';\n    content: \"\\f007\";\n    padding-right: 6px;\n    font-weight: 800;\n}\n\n#btn-pages::before {\n    font-family: 'Font Awesome 5 Pro';\n    content: \"\\f550\";\n    padding-right: 6px;\n    font-weight: 800;\n}\n\n#btn-hide {\n    height: 36px;\n    aspect-ratio: 1;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n\n    &:hover {\n        transition: background-color 0.2s;\n        background-color: #e6e6e6;\n    }\n    \n    &::before {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f053\";\n        font-style: normal;\n    }\n}\n\n#btn-logout {\n\n    &::before {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f08b\";\n        font-style: normal;\n        padding-right: 10px;\n        font-weight: 800;\n    }\n}\n\n#btn-reload-rights {\n\n    &::before {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f2f1\";\n        font-style: normal;\n        padding-right: 10px;\n        font-weight: 800;\n    }\n}\n\n\n#cont-page-search {\n    display: flex;\n    border: 1px solid lightgrey;\n    border-radius: 4px;\n\n    &:hover {\n        transition: border-color 0.2s;\n        border-color: grey;\n    }\n}\n\n#inp-search {\n    width: 100%;\n    outline: none;\n    padding: 3px 7px;\n    padding-left: 0;\n    font-size: 15px;\n    background-color: whitesmoke;\n    border: 0;\n    border-top-right-radius: 4px;\n    border-bottom-right-radius: 4px;\n}\n\n#btn-page-search {\n    cursor: pointer;\n    background-color: whitesmoke;\n    border-radius: 0;\n    width: 35px;\n    height: 30px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border-top-left-radius: 4px;\n    border-bottom-left-radius: 4px;\n    border: 0;\n\n    &::before {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f002\";\n        font-style: normal;\n    }\n\n    &:hover {\n        transition:\n            font-weight 0.2s;\n        font-weight: 500;\n    }\n    \n}\n\n#pagetree a {\n    padding: 8px 10px;\n    cursor: pointer;\n    display: inline-block;\n    width: 100%;\n    width: -moz-available;          /* WebKit-based browsers will ignore this. */\n    width: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */\n    width: fill-available;\n    color: black;\n    text-decoration: none;\n    border-radius: 5px;\n    text-wrap: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    \n    &:hover {\n        background-color: whitesmoke;\n    }\n}\n\n[data-title] {\n    position: relative;\n}\n\n[data-title]:hover::after {\n  content: attr(data-title);\n  position: absolute;\n  bottom: -26px;\n  display: inline-block;\n  padding: 3px 6px;\n  border-radius: 2px;\n  background: #000;\n  color: #fff;\n  font-size: 12px;\n  font-family: sans-serif;\n  white-space: nowrap;\n}\n\n:host([tab=pages]) {\n    & #btn-pages {\n        transition:\n            color 0.2s,\n            background-color 0.2s;\n        background-color: white;\n        color: black;\n    }\n\n    & #cont-pagetree {\n        display: block;\n    }\n}\n\n:host([tab=user]) {\n    & #btn-user {\n        transition:\n            color 0.2s,\n            background-color 0.2s;\n        background-color: white;\n        color: black;\n    }\n\n    & #cont-user {\n        display: flex;\n    }\n}\n\n\n");

class HeliumSidebar extends HTMLElement {
    static observedAttributes = [
        'open',
    ];
    /** @type {HTMLElement} */
    $sidebar;
    /** @type {HTMLDivElement} */
    $contPagetree;
    /** @type {HTMLDivElement} */
    $contUser;
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
        let callback = this._resizeKeydownCallback.bind(this);
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

        let $btnUser = document.createElement('div');
        $btnUser.id = 'btn-user';
        $btnUser.innerHTML = '<span>Benutzer</span>';
        $btnUser.onclick = () => this.showUser();
        $tabs.append($btnUser);

        let $btnHide = document.createElement('div');
        $btnHide.id = 'btn-hide';
        $btnHide.onclick = () => this.hide();
        $header.append($btnHide);

        this.$contPagetree = document.createElement('div');
        this.$contPagetree.id = 'cont-pagetree';
        this.$sidebar.append(this.$contPagetree);

        this.$contUser = document.createElement('div');
        this.$contUser.id = 'cont-user';
        this.$sidebar.append(this.$contUser);

        let $btnLogout = document.createElement('a');
        $btnLogout.id = 'btn-logout';
        $btnLogout.innerHTML = 'Abmelden';
        $btnLogout.href = '/logout';
        this.$contUser.append($btnLogout);

        let $btnReloadRights = document.createElement('a');
        $btnReloadRights.id = 'btn-reload-rights';
        $btnReloadRights.innerHTML = 'Benutzerrechte aktualisieren';
        $btnReloadRights.href = '/reacl';
        this.$contUser.append($btnReloadRights);

        let $contPageSearch = document.createElement('div');
        $contPageSearch.id = 'cont-page-search';
        this.$contPagetree.append($contPageSearch);

        let $btnPageSearch = document.createElement('div');
        $btnPageSearch.id = 'btn-page-search';
        $contPageSearch.append($btnPageSearch);

        let $inpSearch = document.createElement('input');
        $inpSearch.id = 'inp-search';
        $inpSearch.type = 'search';
        $inpSearch.value = localStorage.getItem('he-sidebar_page_filter') ?? '';
        $inpSearch.onchange = () => this._searchChangeCallback.bind(this)($inpSearch);
        $btnPageSearch.onclick = () => this._searchChangeCallback.bind(this)($inpSearch);
        $contPageSearch.append($inpSearch);

        shadow.append(this.$contSidebar);
        shadow.adoptedStyleSheets = [sheet];

        this.setAttribute('tab', localStorage.getItem('he-sidebar_tab') ?? 'pages');

        const open = localStorage.getItem('he-sidebar_open') === 'true'?? true;
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

    _hide(animate=true) {
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

    _show(animate=true) {
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
            this.$contSidebar.style.left =  0;
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

    showUser() {
        this.setAttribute('tab', 'user');
        localStorage.setItem('he-sidebar_tab', 'user');
    }
    
    /**
     * @param {HeliumInput} $inpSearch 
     */
    _searchChangeCallback($inpSearch) {
        let searchText = $inpSearch.value;
        localStorage.setItem('he-sidebar_page_filter', searchText);
        if (searchText === '') {
            this.$pagetree.filter(null);
            this.$pagetree.setClosed(this.pagetreeClosed);
            return;
        } else {
            this.pagetreeClosed = this.$pagetree.getClosed();
        }

        this.$pagetree.filter(searchText);
    }

    _resizeKeydownCallback(evt) {
        const width = evt.x;
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

export { HeliumSidebar };
