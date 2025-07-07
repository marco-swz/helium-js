const sheet = new CSSStyleSheet();sheet.replaceSync("/* The switch - the box around the slider */\r\n\r\n.switch {\r\n    position: relative;\r\n    display: inline-block;\r\n    width: 60px;\r\n    height: 34px;\r\n}\r\n\r\n\r\n/* Hide default HTML checkbox */\r\n\r\n.switch input {\r\n    opacity: 0;\r\n    width: 0;\r\n    height: 0;\r\n}\r\n\r\n\r\n/* The slider */\r\n\r\n.slider {\r\n    position: absolute;\r\n    cursor: pointer;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    background-color: #ccc;\r\n    -webkit-transition: .4s;\r\n    transition: .4s;\r\n}\r\n\r\n.slider:before {\r\n    position: absolute;\r\n    content: \"\";\r\n    height: 26px;\r\n    width: 26px;\r\n    left: 4px;\r\n    bottom: 4px;\r\n    background-color: white;\r\n    -webkit-transition: .4s;\r\n    transition: .4s;\r\n}\r\n\r\n:host([checked]) .slider {\r\n    background-color: #2196F3;\r\n}\r\n\r\n:host(:focus) .slider {\r\n    box-shadow: 0 0 1px #2196F3;\r\n}\r\n\r\n:host([checked]) .slider:before {\r\n    -webkit-transform: translateX(26px);\r\n    -ms-transform: translateX(26px);\r\n    transform: translateX(26px);\r\n}\r\n\r\n\r\n/* Rounded sliders */\r\n\r\n.slider.round {\r\n    border-radius: 34px;\r\n}\r\n\r\n.slider.round:before {\r\n    border-radius: 50%;\r\n}");

class HeliumSwitch extends HTMLElement {
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

export { HeliumSwitch };
