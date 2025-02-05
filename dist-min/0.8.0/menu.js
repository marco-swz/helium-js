class e extends HTMLElement{static observedAttributes=["title,"];items;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
:host {
    position: relative;
    display: inline-block;
    --he-color-accent: #0082b4;
}

#he-menu-items {
    position: absolute;
    border: 1px solid lightgrey;
    min-width: 70px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    border-radius: 3px;
    z-index: 1;
    top: 20px;
    display: flex;
    flex-direction: column;
    padding: 0.2rem;
}

::slotted([slot=item]) {
    padding: 0.2rem 0.3rem !important;
    border-radius: 3px;
    cursor: pointer;
}

::slotted([slot=item]:hover) {
    background-color: whitesmoke;
}
        `),this.items=document.createElement("div"),this.items.id="he-menu-items",this.items.style.display="none";let s=document.createElement("slot");s.name="item",this.button=document.createElement("slot"),this.button.name="button",this.button.id="he-menu-button",this.items.append(s),e.append(this.items),e.append(this.button),e.adoptedStyleSheets=[t],e.addEventListener("slotchange",this.slotChangeCallback.bind(this))}connectedCallback(){}slotChangeCallback(e){const t=e.target;for(const e of t.assignedElements())"button"===e.slot&&e.addEventListener("click",(e=>{null==this.fnClose&&this.open.bind(this)()}))}attributeChangedCallback(e,t,s){}close(){this.items.style.display="none",window.removeEventListener("mousedown",this.fnClose),this.fnClose=null}open(){null==this.fnClose&&(this.items.style.display="",this.fnClose=this.close.bind(this),window.addEventListener("mousedown",this.fnClose))}}document.addEventListener("DOMContentLoaded",(function(){customElements.define("he-menu",e)}));export{e as HeliumMenu};
