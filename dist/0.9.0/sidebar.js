import './input.js';
import './tree.js';
import './button.js';
import './utils-BGzlNXdX.js';

const sheet = new CSSStyleSheet();sheet.replaceSync("#cont-sidebar {\n    position: fixed;\n    left: 0;\n    top: 0;\n    height: 100vh;\n    width: 300px;\n    display: flex;\n}\n\n#cont-pagetree {\n    display: none;\n    height: 100%;\n    padding: 20px;\n    padding-top: 0;\n}\n\n#pagetree {\n    overflow: auto;\n    margin-top: 10px;\n    height: 90%;\n}\n\n#sidebar {\n    border-right: 1px solid grey;\n    background-color: white;\n    width: 100%;\n}\n\n#header {\n    padding: 10px 20px;\n    display: flex;\n    gap: 10px;\n    border-bottom: 1px solid lightgrey;\n    margin-bottom: 20px;\n\n    & #btn-hide {\n        margin-left: auto;\n    }\n}\n\n\n#cont-user {\n    display: flex;\n    flex-direction: column;\n    padding: 20px;\n    padding-top: 0;\n    font-weight: 500;\n\n    & > * {\n        color: black;\n        padding: 8px 10px;\n        text-decoration: none;\n        border-radius: 4px;\n        cursor: pointer;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        text-wrap: nowrap;\n\n        &:hover {\n            transition: background-color 0.2s;\n            background-color: whitesmoke;\n        }\n    }\n}\n\n.main,\n.navCont {\n    margin-left: 300px;\n}\n\n#resizer {\n  z-index: 2;\n  cursor: col-resize;\n  height: 100%;\n  width: 4px;\n  margin-left: -2px;\n}\n\n#opener {\n    display: block;\n    position: fixed;\n    z-index: 100;\n    cursor: pointer;\n    height: 100%;\n    left: 0;\n    width: 10px;\n    background-color: lightgrey;\n}\n\n:host([open]) #opener {\n    display: none;\n}\n\n#tabs {\n    --bg-color: #e6e6e6;\n    display: flex;\n    gap: 5px;\n    padding: 5px;\n    font-size: 15px;\n    font-weight: 500;\n    background-color: var(--bg-color);\n    border-radius: 8px;\n    height: 30px;\n    color: grey;\n    width: fit-content;\n\n    & > div {\n        padding: 5px 10px;\n        cursor: pointer;\n        border-radius: 5px;\n        display: flex;\n        align-items: center;\n\n        &:hover {\n            transition: color 0.2s;\n            color: black;\n        }\n    }\n}\n\n#btn-user::before {\n    font-family: 'Font Awesome 5 Pro';\n    content: \"\\f007\";\n    padding-right: 6px;\n}\n\n#btn-pages::before {\n    font-family: 'Font Awesome 5 Pro';\n    content: \"\\f550\";\n    padding-right: 6px;\n}\n\n#btn-hide {\n    height: 40px;\n    aspect-ratio: 1;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n\n    &:hover {\n        transition: background-color 0.2s;\n        background-color: #e6e6e6;\n    }\n    \n    &::before {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f053\";\n        font-style: normal;\n    }\n}\n\n#btn-logout {\n    position: relative;\n\n    &::after {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f08b\";\n        font-style: normal;\n        position: absolute;\n        right: 10px;\n    }\n}\n\n#btn-reload-rights {\n    position: relative;\n\n    &::after {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f2f1\";\n        font-style: normal;\n        position: absolute;\n        right: 10px;\n    }\n}\n\n:host([tab=pages]) {\n    & #btn-pages {\n        transition:\n            color 0.2s,\n            background-color 0.2s;\n        background-color: white;\n        color: black;\n    }\n\n    & #cont-pagetree {\n        display: block;\n    }\n}\n\n:host([tab=user]) {\n    & #btn-user {\n        transition:\n            color 0.2s,\n            background-color 0.2s;\n        background-color: white;\n        color: black;\n    }\n\n    & #cont-user {\n        display: flex;\n    }\n}\n\n\n");

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

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        this.$contSidebar = document.createElement('aside');
        this.$contSidebar.id = 'cont-sidebar';
        const width = localStorage.getItem('he-sidebar_width') ?? '300px';
        this.$contSidebar.style.width = width;
        let $main = document.querySelector('main > .main');
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

            document.addEventListener('mouseup', () => {
                // TODO(marco): Fix event removal
                document.removeEventListener("mousemove", callback, false);
                let $main = document.querySelector('main > .main');
                if ($main != null) {
                    console.log($main);
                    $main.style.marginLeft = `${e.x}px`;
                }
                localStorage.setItem('he-sidebar_width', this.$contSidebar.style.width);
            });
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
        $btnLogout.innerHTML = 'Ausloggen';
        $btnLogout.href = '/logout';
        this.$contUser.append($btnLogout);

        let $btnReloadRights = document.createElement('a');
        $btnReloadRights.id = 'btn-reload-rights';
        $btnReloadRights.innerHTML = 'Benutzerrechte aktualisieren';
        $btnReloadRights.href = '/reacl';
        this.$contUser.append($btnReloadRights);

        let $inpSearch = document.createElement('he-input');
        $inpSearch.id = 'inp-search';
        $inpSearch.value = localStorage.getItem('he-sidebar_page_filter') ?? '';
        $inpSearch.onchange = () => this._searchChangeCallback.bind(this)($inpSearch);
        this.$contPagetree.append($inpSearch);

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

    _hide(animate=true) {
        localStorage.setItem('he-sidebar_open', false);
        const left = `-${this.$contSidebar.style.width}`;
        if (animate) {
            this.$contSidebar.animate(
                [
                    { left: left },
                ],
                { duration: 100, fill: 'forwards', easing: 'ease-in-out' }
            );
        } else {
            this.$contSidebar.style.left = left;
        }
    }

    _show(animate=true) {
        localStorage.setItem('he-sidebar_open', true);
        if (animate) {
            this.$contSidebar.animate(
                [
                    { left: 0 },
                ],
                { duration: 100, fill: 'forwards', easing: 'ease-in-out' }
            );
        } else {
            this.$contSidebar.style.left = 0;
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
            searchText = null;
        }
        this.$pagetree.filter(searchText);
    }

    _resizeKeydownCallback(evt) {
        this.$contSidebar.style.width = `${evt.x}px`;
    }
}

if (!customElements.get('he-sidebar')) {
    customElements.define("he-sidebar", HeliumSidebar);
}

export { HeliumSidebar };
