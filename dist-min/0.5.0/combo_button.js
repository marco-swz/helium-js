import{h as t,a as e,b as o,c as r}from"./utils-0yxUIyxA.js";const n=new CSSStyleSheet;n.replaceSync(":host {\r\n    --he-combo-button-border-radius: 3px;\r\n    --he-combo-button-border-width: 0.1rem;\r\n    --he-combo-button-border-color: lightgrey;\r\n    --he-combo-button-clr-bg: white;\r\n    --he-combo-button-clr: black;\r\n    --he-combo-button-sep-width: 0.05rem;\r\n    --he-combo-button-sep-color: lightgrey;\r\n    --he-combo-button-height: 35px;\r\n    --he-combo-button-popover-border-color: 240 5.9% 90%;\r\n\r\n    display: inline-block;\r\n    height: var(--he-combo-button-height);\r\n}\r\n\r\n#popover {\r\n    inset: unset;\r\n    outline: none;\r\n    border: 1px solid hsl(var(--he-combo-button-popover-border-color));\r\n    border-radius: var(--he-select-border-radius, 3px);\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n    width: min-content;\r\n\r\n    & #slot-menu {\r\n        display: flex;\r\n        flex-direction: column;\r\n\r\n        &::slotted(he-button) {\r\n            --he-button-width: 100%;\r\n        }\r\n    }\r\n}\r\n\r\n#cont-buttons {\r\n    display: flex;\r\n    border-radius: var(--he-combo-button-border-radius);\r\n    border-style: solid;\r\n    border-width: var(--he-combo-button-border-width);\r\n    width: fit-content;\r\n    height: calc(var(--he-combo-button-height) - 2px);\r\n    border-color: var(--he-combo-button-border-color);\r\n    overflow: hidden;\r\n\r\n    & button {\r\n        border-radius: 0;\r\n        outline: none;\r\n        border: none;\r\n        background-color: var(--he-combo-button-clr-bg);\r\n        color: var(--he-combo-button-clr);\r\n        border-left-color: var(--he-combo-button-sep-color);\r\n        border-left-width: var(--he-combo-button-sep-width);\r\n        border-left-style: solid;\r\n        cursor: pointer;\r\n        font-size: 10px;\r\n        padding: 5px;\r\n\r\n        &:hover {\r\n            background-color: hsl(240 4.8% 95.9%);\r\n        }\r\n    }\r\n}\r\n");class s extends HTMLElement{static observedAttributes=["text","open","disabled"];$popover;internals;$contButtons;ignoreAttributes=!1;constructor(){super(),this.internals=this.attachInternals();let t=this.attachShadow({mode:"open"});t.adoptedStyleSheets=[n],this.$popover=document.createElement("div"),this.$popover.id="popover",this.$popover.popover="",t.append(this.$popover);const e=document.createElement("slot");e.id="slot-menu",e.name="menu",this.$popover.append(e),this.$contButtons=document.createElement("div"),this.$contButtons.id="cont-buttons",t.append(this.$contButtons);const o=document.createElement("slot");o.innerHTML=this.getAttribute("text"),o.id="slot-button",o.name="button",this.$contButtons.append(o);const r=document.createElement("button");r.innerHTML="▼",r.id="btn-menu",r.setAttribute("popovertarget","popover"),this.$contButtons.append(r)}set disabled(t){t?this.setAttribute("disabled",""):this.removeAttribute("disabled")}get disabled(){return null!==this.getAttribute("disabled")}set open(t){t?this.setAttribute("open",""):this.removeAttribute("open")}get open(){return null!==this.getAttribute(open)}attributeChangedCallback(t,e,o){if(!this.ignoreAttributes)switch(t){case"text":o&&(this.shadowRoot.querySelector("#btn-primary").innerHTML=o);break;case"open":null!=o?this.$popover.showPopover():this.$popover.hidePopover();break;case"disabled":null!=o?(this.$contButtons.querySelector("#btn-menu").disabled=!0,this.$contButtons.querySelectorAll("slot").forEach((t=>t.disabled=!0))):(this.$contButtons.querySelector("#btn-menu").disabled=!1,this.$contButtons.querySelectorAll("slot").forEach((t=>t.disabled=!1)))}}connectedCallback(){this.$popover.addEventListener("beforetoggle",(t=>this._beforetoggledPopoverCallback.bind(this)(t))),this.$popover.addEventListener("toggle",(t=>this._toggledPopoverCallback.bind(this)(t)))}_beforetoggledPopoverCallback(t){this.ignoreAttributes=!0,"open"===t.newState?(this.$popover.style.visibility="hidden",this.setAttribute("open",!0)):this.removeAttribute("open"),this.ignoreAttributes=!1}_toggledPopoverCallback(n){if("open"===n.newState){this.internals.states.add("open");let r="bottom-right";t(this)<this.$popover.offsetHeight+20&&(r="top-right");const n=this.getAttribute("position")??r;e(this.$popover,this.$contButtons,n,3),o(),this.$popover.style.visibility=""}else this.internals.states.delete("open"),r()}}customElements.get("he-combo-button")||customElements.define("he-combo-button",s);export{s as HeliumComboButton};