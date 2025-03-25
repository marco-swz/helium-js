const sheet = new CSSStyleSheet();sheet.replaceSync("\n#menubar {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 50px;\n    display: flex;\n    gap: 20px;\n    align-items: center;\n    background-color: white;\n    border-bottom: 1px solid grey;\n    padding: 0 15px;\n}\n\n#breadcrumb {\n    display: flex;\n    gap: 10px;\n\n    & * + *:before {\n      padding: 4px;\n      color: grey;\n      content: \"/\\00a0\";\n      position: absolute;\n      left: -12px;\n      top: 4px;\n      font-size: 16px;\n        \n    }\n\n    & > * {\n        position: relative;\n        padding: 5px 10px;\n        border-radius: 4px;\n        cursor: pointer;\n        font-size: 16;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n\n        &:hover {\n            transition: background-color 0.2s;\n            background-color: hsl(from white h s calc(l - 5));\n        }\n\n        &:last-child {\n            font-size: 20px;\n            font-weight: 500;\n        }\n    }\n}\n\n#btn-home {\n    &::before {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f015\";\n        font-style: normal;\n    }\n}\n\n#btn-menu {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    height: 40px;\n    aspect-ratio: 1;\n    border-radius: 50%;\n    cursor: pointer;\n\n    &:hover {\n        transition: background-color 0.2s;\n        background-color: hsl(from white h s calc(l - 5));\n    }\n\n    &::before {\n        font-family: 'Font Awesome 5 Pro';\n        content: \"\\f0c9\";\n        font-style: normal;\n        font-size: 20px;\n    }\n}\n\n#img-main {\n    margin-left: auto;\n    transform: scale(0.8);\n}\n");

class HeliumMenubar extends HTMLElement {
    static observedAttributes = [
        'open',
    ];
    /** @type {HTMLDivElement} */
    $menubar;
    /** @type {HTMLDivElement} */
    $breadcrumb;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });

        let $nav = document.querySelector('.navCont');
        if ($nav != null) {
            $nav.style.display = 'none';
        }

        let $main = document.querySelector('main');
        if ($main != null) {
            $main.style.marginTop = '50px';
        }

        this.$menubar = document.createElement('div');
        this.$menubar.id = 'menubar';

        let $btnMenu = document.createElement('div');
        $btnMenu.id = 'btn-menu';
        $btnMenu.onclick = () => this._handleClickMenu.bind(this)();
        this.$menubar.append($btnMenu);

        this.$breadcrumb = document.createElement('div');
        this.$breadcrumb.id ='breadcrumb';
        this.$menubar.append(this.$breadcrumb);

        let $img = document.createElement('img');
        $img.id = 'img-main';
        $img.alt = "Bild";
        $img.src = "https://marco.stage.digitalweb.at/images/v_Logo_CO_250.png";
        $img.loading = 'lazy';
        this.$menubar.append($img);

        shadow.append(this.$menubar);
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
        let $contBreadcrumb = this.querySelector('.breadcrumb');
        if ($contBreadcrumb) {
            this.$breadcrumb.innerHTML = $contBreadcrumb.innerHTML;
            $contBreadcrumb.remove();
        }
    }

    _handleClickMenu() {
        let $menu = document.querySelector('he-sidebar');
        if ($menu != null) {
            $menu.toggle();
        }
    }
}

if (!customElements.get('he-menubar')) {
    customElements.define("he-menubar", HeliumMenubar);
}

export { HeliumMenubar };
