import{s as e}from"./utils-SpbzPs7e.js";class t extends HTMLElement{static observedAttributes=["open","he-title","close-icon","close-button"];dialog;title;constructor(){super();let t=this.attachShadow({mode:"open"}),o=new CSSStyleSheet;o.replaceSync(e`
#he-diag-outer {
    outline: none;
    padding: 0;
    border-radius: 3px;
    border: 0;
}

#he-icon-close {
    font-weight: 900;
    width: 20px;
    text-align: center;
    cursor: pointer;
    padding: 0.15rem;
    border-radius: 50%;
    font-family: cursive;
}

#he-diag-inner {
    min-height: 100px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#he-diag-body {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
}

#he-diag-header {
    display: flex;
    justify-content: space-between;
    background-color: var(--he-dialog-clr-title, #0082b4);
    color: var(--he-dialog-clr-title-text, white);
    padding: 3px 10px;
}

#he-diag-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    gap: 5px;
}

#he-title {
    display: flex;
    font-weight: 500;
    align-items: center;
}

#he-diag-footer input[type=button] {
    border-radius: 3px;
    color: black;
    height: 35px;
    padding: 0px 10px;
    vertical-align: middle;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2235294118);
    font-size: 14px;
    background-color: white;
    outline-style: none;
    box-shadow: none !important;
    width: auto;
    visibility: collapse;

    &[disabled] {
        background-color: #d9d9d9;
        color: #666666;
        cursor: no-drop;
        text-shadow: none;
    }

    &:hover:enabled, &:active:enabled, &:focus:enabled {
        cursor: pointer;
        text-shadow: 0px 0px 0.3px #0082b4;
        border-color: var(--he-color-accent, #0082b4);
        color: var(--he-color-accent, #0082b4);
    }

    &:hover:enabled{
        background-color: #0082b40d;
    }
}
        `),t.adoptedStyleSheets=[o],t.innerHTML='\n            <dialog id="he-diag-outer">\n                <div id="he-diag-inner">\n                    <div id="he-diag-header">\n                        <div id="he-title"></div>\n                        <div id="he-icon-close">X</div>\n                    </div>\n                    <div id="he-diag-body">\n                        <slot name="body"></slot>\n                    </div>\n                    <div id="he-diag-footer">\n                        <slot name="footer"></slot>\n                    </div>\n                </div>\n            </dialog>\n        ',t.querySelector("#he-diag-body").append(...this.children),t.querySelector("#he-icon-close").onclick=()=>t.querySelector("#he-diag-outer").close(),this.dialog=t.querySelector("#he-diag-outer"),this.title=t.querySelector("#he-title")}connectedCallback(){this.addEventListener("he-dialog-show",(function(){this.show()})),this.addEventListener("he-dialog-close",(function(){this.close()}))}attributeChangedCallback(e,t,o){"open"===e&&("true"===o?this.dialog.showModal():this.dialog.close()),"he-title"===e&&(this.title.innerText=o),"lose-button"===e&&("true"===o?(this.shadowRoot.querySelector("#he-btn-close").style.visibility="visible",this.shadowRoot.querySelector("#he-diag-footer").style.visibility="visible"):(this.shadowRoot.querySelector("#he-btn-close").style.visibility="collapse",this.shadowRoot.querySelector("#he-diag-footer").style.visibility="collapse")),"close-icon"===e&&(this.shadowRoot.querySelector("#he-btn-close").style.visibility="true"===o?"visible":"collapse")}show(){return this.dialog.showModal(),this}showModal(){return this.dialog.showModal(),this}close(){return this.dialog.close(),this}setBody(e){return this.shadowRoot.querySelector("#he-diag-body slot[name=body]").innerHTML=e,this}}function o(e,t){let o=document.querySelector("#he-dialog-temp");if(null===o){switch(o=document.createElement("he-dialog"),o.id="he-dialog-temp",t){case"error":o.style.setProperty("--he-dialog-clr-title","indianred"),o.setAttribute("title","Fehler");break;case"warn":o.style.setProperty("--he-dialog-clr-title","orange"),o.setAttribute("title","Warnung");break;case"success":o.style.setProperty("--he-dialog-clr-title","seagreen"),o.setAttribute("title","Erfolg");break;default:o.style.removeProperty("--he-dialog-clr-title"),o.removeAttribute("title")}document.body.append(o)}e.detail&&e.detail.value&&o.setBody(e.detail.value),o.show()}customElements.define("he-dialog",t),document.addEventListener("he-dialog",(function(e){o(e)})),document.addEventListener("he-dialog-error",(function(e){o(e,"error")})),document.addEventListener("he-dialog-warn",(function(e){o(e,"warn")})),document.addEventListener("he-dialog-success",(function(e){o(e,"success")}));export{t as HeliumDialog};
