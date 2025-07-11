const sheet = new CSSStyleSheet();sheet.replaceSync(":host {\n    --he-backgroundColor-checked: #f38321;\n    --he-backgroundColor-unchecked: #cccccc;\n    --he-box-shadowColor: #a3ba9e;\n    --he-sliderColor: white;\n    --he-slider-translation: 26px;\n    --he-width: 60px;\n    --he-height: 34px;\n    --he-slider-width: 26px;\n    --he-slider-height: 26px;\n}\n\n\n/* The switch - the box around the slider */\n\n.switch {\n    position: relative;\n    display: inline-block;\n    width: var(--he-width);\n    height: var(--he-height);\n}\n\n\n/* Hide default HTML checkbox */\n\n.switch input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n}\n\n\n/* The slider */\n\n.slider {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: var(--he-backgroundColor-unchecked);\n    -webkit-transition: .4s;\n    transition: .4s;\n}\n\n.slider:before {\n    position: absolute;\n    content: \"\";\n    height: var(--he-slider-height);\n    width: var(--he-slider-width);\n    left: 4px;\n    bottom: 4px;\n    background-color: var(--he-sliderColor);\n    -webkit-transition: .4s;\n    transition: .4s;\n}\n\n:host([checked]) .slider {\n    background-color: var(--he-backgroundColor-checked);\n}\n\n:host(:focus) .slider {\n    box-shadow: 0 0 1px var(--he-box-shadowColor);\n}\n\n:host([checked]) .slider:before {\n    -webkit-transform: translateX(var(--he-slider-translation));\n    -ms-transform: translateX(var(--he-slider-translation));\n    transform: translateX(var(--he-slider-translation));\n}\n\n\n/* Rounded sliders */\n\n.slider.round {\n    border-radius: 34px;\n}\n\n.slider.round:before {\n    border-radius: 50%;\n}");

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
