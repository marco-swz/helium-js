export class HeliumSwitch extends HTMLElement {

    static get observedAttributes() {
        return ["checked"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        // Hier muss ich noch den Stylesheet aufrufen


    }

    attributeChangedCallback(name, oldValue, newValue) {
        // if an observerd attribute is to be added
        if (name == "checked") {
            const toggle = this.shadowRoot.querySelector(".switch");

            if (this.hasAttribute("checked")) {
                toggle.classList.add("checked");
            } else {
                toggle.classList.remove("checked")
            }
        }
    }
}

if (!customElements.get('he-switch')) {
    customElements.define("he-switch", HeliumSwitch);
}