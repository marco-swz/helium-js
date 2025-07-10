import sheet from './switch.css';

export class HeliumSwitch extends HTMLElement {
    static formAssociated = true;

    static get observedAttributes() {
        return ["checked"];
    }

    $internals;

    constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        shadow.adoptedStyleSheets = [sheet];

        let $switch = document.createElement("div");
        let $input = document.createElement("input");
        let $span = document.createElement("span");

        $input.setAttribute("type", "checkbox");

        $switch.append($input);
        $switch.append($span);

        $switch.classList.add("switch");
        $span.classList.add("slider");
        $span.classList.add("round");

        shadow.append($switch);

        this.$internals = this.attachInternals();
        this.addEventListener("click", () => this.handleClick());
    }

    handleClick() {
        if (this.hasAttribute("checked")) {
            this.removeAttribute("checked");
            this.$internals.states.delete('checked');
            this.$internals.setFormValue(null);
        } else {
            this.setAttribute("checked", "");
            this.$internals.states.add("checked");
            this.$internals.setFormValue('on', 'checked');
        }
    }

    get checked() {
        return this.$internals.states.has('checked');
    }

}

if (!customElements.get('he-switch')) {
    customElements.define("he-switch", HeliumSwitch);
}