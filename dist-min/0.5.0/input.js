const t=new CSSStyleSheet;t.replaceSync(':host {\r\n    display: inline-flex;\r\n    position: relative;\r\n    border-radius: 3px;\r\n    background-color: whitesmoke;\r\n    width: 100%;\r\n    height: 1.5rem;\r\n    font-size: 14px;\r\n    border: 0.07rem solid lightgrey;\r\n}\r\n\r\n:host(:hover), :host(:focus) {\r\n    border-color: var(--he-input-clr-border-hover, grey);\r\n}\r\n\r\n:host([invalid]) {\r\n    border-color: indianred;\r\n}\r\n\r\n:host([invalid]:hover) {\r\n    border-color: indianred;\r\n}\r\n\r\n:host([loading])::after {\r\n    content: "";\r\n    position: absolute;\r\n    width: 12px;\r\n    height: 12px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto 10px auto auto;\r\n    border: 3px solid darkgrey;\r\n    border-radius: 50%;\r\n    border-bottom-color: var(--he-input-clr-spinner, black);\r\n    animation: button-loading-spinner 1s ease infinite;\r\n}\r\n\r\n:host([ok])::after {\r\n    content: "";\r\n    position: absolute;\r\n    width: 10px;\r\n    height: 15px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto 10px auto auto;\r\n    border: 3px solid transparent;\r\n    border-bottom-color: var(--he-input-clr-ok, black);\r\n    border-right-color: var(--he-input-clr-ok, black);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n#inp-main {\r\n    outline: none;\r\n    background-color: inherit;\r\n    width: 100%;\r\n    font-size:inherit;\r\n    border-radius: inherit;\r\n    border: none;\r\n    padding: 0.3rem 0.4rem;\r\n    cursor: inherit;\r\n}\r\n\r\n:host([readonly]:hover), :host([readonly]:focus),\r\n:host([disabled]:hover), :host([disabled]:focus) {\r\n    border-color: var(--he-input-clr-border-hover, lightgrey);\r\n}\r\n\r\n:host([readonly]), :host([disabled]) {\r\n    cursor: default\r\n}\r\n\r\n@keyframes button-loading-spinner {\r\n    from {\r\n        transform: rotate(0turn);\r\n    }\r\n\r\n    to {\r\n        transform: rotate(1turn);\r\n    }\r\n}\r\n\r\n');class e extends HTMLElement{static formAssociated=!0;static observedAttributes=["pattern","required","report-validity","type","disabled","readonly","autocomplete","placeholder"];$input;internals;constructor(){super();let e=this.attachShadow({mode:"open"});this.$input=document.createElement("input"),this.$input.type="text",this.$input.autocomplete="off",this.$input.id="inp-main",e.append(this.$input),e.adoptedStyleSheets=[t],this.internals=this.attachInternals()}set disabled(t){t?(this.setAttribute("disabled",!0),this.internals.states.add("disabled"),this.internals.setFormValue(null)):(this.removeAttribute("disabled"),this.internals.states.delete("disabled"),this.internals.setFormValue(this.$input.value))}get disabled(){return null!=this.getAttribute("disabled")}set invalid(t){t?(this.setAttribute("invalid",!0),this.internals.states.add("invalid")):(this.removeAttribute("invalid"),this.internals.states.delete("invalid"))}get invalid(){return null!=this.getAttribute("invalid")}set name(t){t?this.setAttribute("name",t):this.removeAttribute("name")}get name(){return this.getAttribute("name")}set placeholder(t){t?this.setAttribute("placeholder",t):this.removeAttribute("placeholder")}get placeholder(){return this.getAttribute("placeholder")}set required(t){t?this.setAttribute("required",!0):this.removeAttribute("required")}get required(){return this.$input.required}set type(t){t?this.setAttribute("type",t):this.removeAttribute("type")}get type(){return this.getAttribute("type")}set value(t){this.$input.value=t,this.disabled||this.internals.setFormValue(t)}get value(){return""===this.$input.value?this.placeholder??"":this.$input.value}connectedCallback(){this.$input.onchange=()=>this.inputChangedCallback.bind(this)(),this.value=this.getAttribute("value"),this.value||(this.value=this.innerHTML)}attributeChangedCallback(t,e,r){switch(t){case"type":this.style.display="hidden"===r?"none":"";case"placeholder":""===this.value&&this.internals.setFormValue(r);default:null!=r?this.$input.setAttribute(t,r):this.$input.removeAttribute(t)}}checkValidity(){const t=this.$input.validity;t.valid?this.invalid=!1:this.invalid=!0;const e=this.getAttribute("report-invalid");if(e){console.assert(this.id&&""!==this.id,"The input cannot report its validity if it has no ID");const r="#"+this.id,i=document.querySelectorAll(e);for(const e of i){const i=e.getAttribute("he-input-invalid")??"";let n=new Set(i.split(" "));t.valid?n.delete(r):n.add(r),0!==n.size?e.setAttribute("he-input-invalid",Array.from(n).join(" ")):e.removeAttribute("he-input-invalid")}}return t.valid}focus(){this.$input.focus()}formResetCallback(){this.$input.value=""}inputChangedCallback(){!this.disabled&&this.checkValidity()&&this.internals.setFormValue(this.$input.value)}}customElements.get("he-input")||customElements.define("he-input",e);export{e as HeliumInput};
