const t=new CSSStyleSheet;t.replaceSync(':host {\r\n    --he-button-cursor-loading: default;\r\n    --he-button-cursor-hover: pointer;\r\n    --he-button-cursor-disabled: not-allowed;\r\n    --he-button-clr-bg: white;\r\n    --he-button-border-width: 0.1rem;\r\n    --he-button-border-color: rgba(0, 0, 0, 0.2235294118);\r\n    --he-button-border-color-hover: rgba(0, 0, 0, 0.2235294118);\r\n    --he-button-clr-hover: black;\r\n    --he-button-font-size: 14px;\r\n    --he-button-height: 35px;\r\n    --he-button-width: auto;\r\n    --he-button-clr: black;\r\n    --he-clr-bg-primary: hsl(200, 50%, 50%);\r\n    --he-clr-primary: hsl(0, 0%, 100%);\r\n    --he-clr-bg-primary-hover: hsl(200, 50%, 60%);\r\n    --he-clr-primary-hover:var(--he-clr-primary);\r\n\r\n    display: inline-block;\r\n    text-wrap: nowrap;\r\n    border-radius: 2px;\r\n    outline-style: none;\r\n    box-shadow: none !important;\r\n}\r\n\r\n#he-button {\r\n    position: relative;\r\n    border-radius: inherit;\r\n    color: inherit;\r\n    padding: inherit;\r\n    vertical-align: middle;\r\n    text-align: center;\r\n    font-size: var(-he-button-font-size);\r\n    background-color: var(--he-button-clr-bg);\r\n    outline-style: inherit;\r\n    box-shadow: inherit;\r\n    text-shadow: inherit;\r\n    cursor: inherit;\r\n    color: var(--he-button-clr);\r\n    height: var(--he-button-height);\r\n    width: var(--he-button-width);\r\n    border-width: var(--he-button-border-width);\r\n    border-style: solid;\r\n    border-color: var(--he-button-border-color);\r\n    padding: 0px 10px;\r\n}\r\n\r\n:host([disabled]) #he-button {\r\n    background-color: #d9d9d9;\r\n    color: #666666;\r\n    cursor: var(--he-button-cursor-disabled);\r\n    text-shadow: none;\r\n}\r\n\r\n:host(:not([loading]):not([disabled]):hover) #he-button,\r\n:host(:not([loading]):not([disabled]):active) #he-button,\r\n:host(:not([loading]):not([disabled]):focus) #he-button {\r\n    cursor: var(--he-button-cursor-hover);\r\n    text-shadow: 0px 0px 0.3px var(--he-button-clr-border-hover);\r\n    border-color: var(--he-button-border-color-hover);\r\n    color: var(--he-button-clr-hover);\r\n}\r\n\r\n:host(:not([loading]):not([disabled]):hover) #he-button {\r\n    background-color: color-mix(in srgb, var(--he-button-clr-bg), black 2%)\r\n}\r\n\r\n:host([loading]) #he-button {\r\n    background-color: #d9d9d9;\r\n    color: #6666668c;\r\n    cursor: var(--he-button-cursor-loading);\r\n    text-shadow: none;\r\n}\r\n\r\n:host([loading]) #he-button::after {\r\n    content: "";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-top-color: var(--he-button-clr-spinner, black);\r\n    border-radius: 50%;\r\n    animation: button-loading-spinner 1s ease infinite;\r\n}\r\n\r\n:host([ok]) #he-button::after {\r\n    content: "";\r\n    position: absolute;\r\n    width: 16px;\r\n    height: 16px;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    margin: auto;\r\n    border: 4px solid transparent;\r\n    border-bottom-color: var(--he-button-clr-spinner, black);\r\n    border-right-color: var(--he-button-clr-spinner, black);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n:host([theme=primary]) #he-button {\r\n    border-color: transparent;\r\n    background-color: var(--he-clr-bg-primary);\r\n    color: var(--he-clr-primary);\r\n}\r\n\r\n:host([theme=primary]:not([loading]):not([disabled]):hover) #he-button,\r\n:host([theme=primary]:not([loading]):not([disabled]):active) #he-button,\r\n:host([theme=primary]:not([loading]):not([disabled]):focus) #he-button {\r\n    background-color: var(--he-clr-bg-primary-hover);\r\n    color: var(--he-clr-primary-hover);\r\n    border-color: transparent;\r\n}\r\n\r\n@keyframes button-loading-spinner {\r\n    from {\r\n        transform: rotate(0turn);\r\n    }\r\n\r\n    to {\r\n        transform: rotate(1turn);\r\n    }\r\n}\r\n');class r extends HTMLElement{static observedAttributes=["theme","popovertarget","popovertargetaction","form","formtarget","formenctype","formmethod","formnovalidate","show-dialog","close-dialog","submit","he-input-invalid","disabled"];$button;listenerClick=null;internals;constructor(){super();let r=this.attachShadow({mode:"open"});this.$button=document.createElement("button"),this.$button.id="he-button",r.append(this.$button),r.adoptedStyleSheets=[t],this.internals=this.attachInternals()}set disabled(t){t?this.setAttribute("disabled",!0):this.removeAttribute("disabled")}get disabled(){return null!=this.getAttribute("disabled")}set loading(t){t?(this.setAttribute("loading",!0),this.internals.states.add("loading")):(this.removeAttribute("loading"),this.internals.states.delete("loading"))}get loading(){return null!=this.getAttribute("loading")}set theme(t){t?this.setAttribute("theme",t):this.removeAttribute("theme")}get theme(){return this.getAttribute("theme")}attributeChangedCallback(t,r,e){switch(t){case"show-dialog":this.removeEventListener("click",this._showDialog),null!==e&&(this.listenerClick=this.addEventListener("click",this._showDialog));break;case"close-dialog":this.removeEventListener("click",this._hideDialog),null!==e&&(this.listenerClick=this.addEventListener("click",this._closeDialog()));break;case"submit":this.addEventListener("click",(()=>this._submitForm()));break;case"he-input-invalid":this.disabled=!!e;break;case"theme":break;case"disabled":e?(this.internals.states.add("disabled"),this.$button.setAttribute("disabled",!0)):(this.internals.states.delete("disabled"),this.$button.removeAttribute("disabled"));break;default:null===e||"false"===e?this.$button.removeAttribute(t):this.$button.setAttribute(t,e)}}connectedCallback(){this.$button.innerHTML=this.innerHTML,this.innerHTML=""}_closeDialog(){document.querySelectorAll(this.getAttribute("close-dialog")).forEach((t=>t.close()))}_submitForm(){const t=this.getAttribute("submit"),r=document.querySelector(t);console.assert(null==r,`No form found with ID ${t}`),console.assert("FORM"===r.nodeName,"The element is not a form!"),r.submit()}_showDialog(){document.querySelectorAll(this.getAttribute("show-dialog")).forEach((t=>t.showModal()))}}customElements.get("he-button")||customElements.define("he-button",r);export{r as HeliumButton};
