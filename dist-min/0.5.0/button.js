import{s as t}from"./utils-DMShwPAW.js";class e extends HTMLElement{static observedAttributes=["value","name","form","popovertarget","popovertargetaction","disabled","form","formtarget","formenctype","formmethod","formnovalidate","loading","show-dialog","close-dialog","submit","input-invalid"];button;listenerClick=null;constructor(){super();let e=this.attachShadow({mode:"open"}),o=new CSSStyleSheet;o.replaceSync(t`
        :host {
            text-wrap: nowrap;
        }

        #he-button {
            border-radius: 2px;
            color: black;
            height: 35px;
            padding: 0px 10px;
            vertical-align: middle;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, 0.2235294118);
            font-size: 14px;
            background-color: var(--he-button-clr-bg, white);
            outline-style: none;
            box-shadow: none !important;
            width: auto;
            position: relative;
        }

        #he-button[disabled] {
            background-color: #d9d9d9;
            color: #666666;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button:hover:enabled:not([loading]), 
        #he-button:active:enabled:not([loading]), 
        #he-button:focus:enabled:not([loading]) {
            cursor: pointer;
            text-shadow: 0px 0px 0.3px var(--he-button-clr-border-hover);
            border-color: var(--he-button-clr-border-hover, grey);
            color: var(--he-button-clr-border-hover, black);
        }

        #he-button:hover:enabled:not([loading]){
            background-color: color-mix(in srgb,var(--he-button-clr-bg, white),black 2%)
        }

        #he-button[loading] {
            background-color: #d9d9d9;
            color: #6666668c;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button[loading]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-top-color: var(--he-button-clr-spinner, black);
            border-radius: 50%;
            animation: button-loading-spinner 1s ease infinite;
        }

        #he-button[ok]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-bottom-color: var(--he-button-clr-spinner, black);
            border-right-color: var(--he-button-clr-spinner, black);
            transform: rotate(45deg);
        }

        @keyframes button-loading-spinner {
            from {
                transform: rotate(0turn);
            }

            to {
                transform: rotate(1turn);
            }
        }
        `),this.button=document.createElement("button"),this.button.id="he-button",e.append(this.button),e.adoptedStyleSheets=[o]}connectedCallback(){this.button.innerHTML=this.innerHTML,this.innerHTML=""}attributeChangedCallback(t,e,o){switch(t){case"show-dialog":this.removeEventListener("click",this._showDialog),null!==o&&(this.listenerClick=this.addEventListener("click",this._showDialog));break;case"close-dialog":this.removeEventListener("click",this._hideDialog),null!==o&&(this.listenerClick=this.addEventListener("click",this._closeDialog()));break;case"submit":this.addEventListener("click",(()=>this._submitForm()));break;case"input-invalid":o?this.disable():this.enable();break;default:null===o||"false"===o?this.button.removeAttribute(t):this.button.setAttribute(t,o)}}loading(t){null==t||t?this.setAttribute("loading",!0):this.removeAttribute("loading")}disable(){this.setAttribute("disabled",!0)}enable(){this.removeAttribute("disabled")}_submitForm(){const t=this.getAttribute("submit"),e=document.querySelector(t);console.assert(null==e,`No form found with ID ${t}`),e.submit()}_showDialog(){document.querySelector(this.getAttribute("show-dialog")).showModal()}_closeDialog(){document.querySelector(this.getAttribute("close-dialog")).close()}}customElements.define("he-button",e);export{e as HeliumButton};
