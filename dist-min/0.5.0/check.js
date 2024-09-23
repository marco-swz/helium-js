import{s as e}from"./utils-SpbzPs7e.js";class t extends HTMLElement{static formAssociated=!0;static observedAttributes=["name","indeterminate"];mark;internals;constructor(){super();let t=this.attachShadow({mode:"open"}),s=new CSSStyleSheet;s.replaceSync(e`
        :host {
            display: inline-block;
            width: fit-content;
        }

        .container {
            display: block;
            position: relative;
            padding-left: 25px;
            margin-bottom: 12px;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 25px;
            width: 25px;
            background-color: #eee;
            border-radius: var(--he-check-radius, 3px);
            transform: scale(var(--he-check-scale, 0.7)) translateY(-5px);
        }

        :host(:hover) .checkmark {
            background-color: var(--he-check-clr-hover, lightgrey);
        }

        :host(:state(checked)) .checkmark {
            background-color: var(--he-check-clr-checked, grey);
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        :host(:state(checked)) .checkmark:after {
            display: block;
        }

        :host(:state(checked):state(indeterminate)) .checkmark:after {
            display: block;
            -webkit-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            transform: rotate(0deg);
            height: 0px;
            top: 11px;
            width: 7px;
            left: 7px;
        }

        .checkmark:after {
            left: 8px;
            top: 2px;
            width: 5px;
            height: 12px;
            border: solid white;
            border-width: 0 4px 4px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        } 
        `);let n=document.createElement("div");n.classList.add("container"),n.innerHTML=this.innerHTML,this.innerHTML="",this.mark=document.createElement("div"),this.mark.classList.add("checkmark"),n.append(this.mark),t.append(n),t.adoptedStyleSheets=[s]}connectedCallback(){this.internals=this.attachInternals(),this.addEventListener("click",(()=>this.toggle()))}set checked(e){e?(this.setAttribute("checked",!0),this.internals.states.add("checked"),this.internals.setFormValue("on","checked")):(this.removeAttribute("checked"),this.internals.states.delete("checked"),this.internals.setFormValue(null))}get checked(){return this.internals.states.has("checked")}set name(e){this.setAttribute("name",e)}get name(){return this.getAttribute("name")}set indeterminate(e){e?this.internals.states.add("indeterminate"):this.internals.states.delete("indeterminate")}get indeterminate(){return this.internals.states.has("indeterminate")}attributeChangedCallback(e,t,s){if("indeterminate"===e)this.indeterminate=null!=s&&"false"!==s}toggle(){if(this.checked=!this.checked,this.onchange){const e=new InputEvent("click");this.onchange(e)}}}document.addEventListener("DOMContentLoaded",(function(){customElements.define("he-check",t)}));export{t as HeliumCheck};
