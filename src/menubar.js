import sheet from './menubar.css';

export class HeliumMenubar extends HTMLElement {
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
            default:
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
