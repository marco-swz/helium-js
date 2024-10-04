const t=new CSSStyleSheet;t.replaceSync(':host {\r\n    --he-button-cursor-loading: default;\r\n    --he-button-cursor-hover: pointer;\r\n    --he-button-cursor-disabled: not-allowed;\r\n    --he-button-clr-bg: white;\r\n    --he-button-border-width: 0.1rem;\r\n    --he-button-border-color: rgba(0, 0, 0, 0.2235294118);\r\n\r\n    display: inline-block;\r\n    text-wrap: nowrap;\r\n    border-radius: 2px;\r\n    color: black;\r\n    height: 35px;\r\n    vertical-align: middle;\r\n    text-align: center;\r\n    border-width: var(--he-button-border-width);\r\n    border-style: solid;;\r\n    border-color: var(--he-button-border-color);\r\n    font-size: 14px;\r\n    background-color: var(--he-button-clr-bg);\r\n    outline-style: none;\r\n    box-shadow: none !important;\r\n    width: auto;\r\n    position: relative;\r\n}\r\n\r\n#he-button {\r\n    border-radius: inherit;\r\n    color: inherit;\r\n    padding: inherit;\r\n    vertical-align: inherit;\r\n    text-align: inherit;\r\n    font-size: inherit;\r\n    background-color: inherit;\r\n    outline-style: inherit;\r\n    box-shadow: inherit;\r\n    text-shadow: inherit;\r\n    cursor: inherit;\r\n\r\n    height: 100%;\r\n    width: 100%;\r\n    border: none;\r\n    padding: 0px 10px;\r\n}\r\n\r\n:host([disabled]) {\r\n    background-color: #d9d9d9;\r\n    color: #666666;\r\n    cursor: var(--he-button-cursor-disabled);\r\n    text-shadow: none;\r\n}\r\n\r\n:host(:not([loading]):not([disabled]):hover), \r\n:host(:not([loading]):not([disabled]):active), \r\n:host(:not([loading]):not([disabled]):focus) {\r\n    cursor: var(--he-button-cursor-hover);\r\n    text-shadow: 0px 0px 0.3px var(--he-button-clr-border-hover);\r\n    border-color: var(--he-button-clr-border-hover, grey);\r\n    color: var(--he-button-clr-border-hover, black);\r\n}\r\n\r\n:host(:not([loading]):not([disabled]):hover) {\r\n    background-color: color-mix(in srgb,var(--he-button-clr-bg),black 2%)\r\n}\r\n\r\n:host([loading]) {\r\n    background-color: #d9d9d9;\r\n    color: #6666668c;\r\n    cursor: var(--he-button-cursor-loading);\r\n    text-shadow: none;\r\n}\r\n\r\n:host([loading])::after {\r\n    content: "";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-top-color: var(--he-button-clr-spinner, black);\r\n    border-radius: 50%;\r\n    animation: button-loading-spinner 1s ease infinite;\r\n}\r\n\r\n:host([ok])::after {\r\n    content: "";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-bottom-color: var(--he-button-clr-spinner, black);\r\n    border-right-color: var(--he-button-clr-spinner, black);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n@keyframes button-loading-spinner {\r\n    from {\r\n        transform: rotate(0turn);\r\n    }\r\n\r\n    to {\r\n        transform: rotate(1turn);\r\n    }\r\n}\r\n\r\n');class r extends HTMLElement{static observedAttributes=["popovertarget","popovertargetaction","form","formtarget","formenctype","formmethod","formnovalidate","show-dialog","close-dialog","submit","he-input-invalid"];$button;listenerClick=null;internals;constructor(){super();let r=this.attachShadow({mode:"open"});this.$button=document.createElement("button"),this.$button.id="he-button",r.append(this.$button),r.adoptedStyleSheets=[t],this.internals=this.attachInternals()}set disabled(t){t?(this.setAttribute("disabled",!0),this.internals.states.add("disabled")):(this.removeAttribute("disabled"),this.internals.states.delete("disabled"))}get disabled(){return null!=this.getAttribute("disabled")}set loading(t){t?(this.setAttribute("loading",!0),this.internals.states.add("loading")):(this.removeAttribute("loading"),this.internals.states.delete("loading"))}get loading(){return null!=this.getAttribute("loading")}attributeChangedCallback(t,r,n){switch(t){case"show-dialog":this.removeEventListener("click",this._showDialog),null!==n&&(this.listenerClick=this.addEventListener("click",this._showDialog));break;case"close-dialog":this.removeEventListener("click",this._hideDialog),null!==n&&(this.listenerClick=this.addEventListener("click",this._closeDialog()));break;case"submit":this.addEventListener("click",(()=>this._submitForm()));break;case"he-input-invalid":this.disabled=!!n;break;default:null===n||"false"===n?this.$button.removeAttribute(t):this.$button.setAttribute(t,n)}}connectedCallback(){this.$button.innerHTML=this.innerHTML,this.innerHTML=""}_closeDialog(){document.querySelectorAll(this.getAttribute("close-dialog")).forEach((t=>t.close()))}_submitForm(){const t=this.getAttribute("submit"),r=document.querySelector(t);console.assert(null==r,`No form found with ID ${t}`),console.assert("FORM"===r.nodeName,"The element is not a form!"),r.submit()}_showDialog(){document.querySelectorAll(this.getAttribute("show-dialog")).forEach((t=>t.showModal()))}}customElements.get("he-button")||customElements.define("he-button",r);export{r as HeliumButton};
