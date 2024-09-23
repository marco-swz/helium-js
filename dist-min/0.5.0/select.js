class e extends HTMLElement{static formAssociated=!0;static observedAttributes=["open","search"];popover;filter;options;internals;_filterTimeout=0;_disableAttrCallback=!1;constructor(){super();let e=this.attachShadow({mode:"open"});this.internals=this.attachInternals();let t=new CSSStyleSheet;t.replaceSync(scss`
            :host {
                height: fit-content;
                width: fit-content;
            }

            #inp {
                position: relative;
                background-color: var(--he-select-clr-bg, whitesmoke);
                border: 1px solid lightgrey;
                width: 100%;
                padding: 0.3rem 0.4rem;
                font-size: var(--he-select-fs, 14px);
                border-radius: 3px;
                outline: none;
                text-align: left;
                padding-right: 25px;
                text-wrap: nowrap;
            }

            #inp:hover, #inp:focus {
                cursor: pointer;
                border-color: var(--he-select-clr-border-hover, grey);
            }

            #inp::after {
                content: "";
                position: absolute;
                width: 4px;
                height: 4px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 2px solid transparent;
                border-bottom-color: var(--he-select-clr-arrow, black);
                border-right-color: var(--he-select-clr-arrow, black);
                transform: rotate(45deg) translateY(-2.5px);
            }

            #popover {
                inset: unset;
                outline: none;
                border: 1px solid grey;
                border-radius: var(--he-select-border-radius, 3px);
            }

            #cont-options {
                display: flex;
                flex-direction: column;
                background-color: var(--he-select-clr-bg, white);
                max-height: 300px;
                overflow: auto;
                overscroll-behavior: contain;
            }

            #cont-options option {
                padding: 5px 4px;
                border-radius: 3px;
            }

            #cont-options option[selected] {
                background-color: var(--he-select-clr-bg-hover, whitesmoke);
            }

            #cont-options option:hover:not(:disabled) {
                background-color: var(--he-select-clr-bg-hover, whitesmoke);
                cursor: pointer;
            }

            #filter {
                --he-input-border-radius: 2px;
                width: 100%;
            }
        `),this.input=document.createElement("button"),this.input.id="inp",this.input.setAttribute("popovertarget","popover"),this.filter=document.createElement("he-input"),this.filter.id="filter",this.filter.style.display="none",this.filter.onkeyup=()=>this.changedFilterCallback.bind(this)(),this.popover=document.createElement("div"),this.popover.id="popover",this.popover.popover="",this.popover.append(this.filter),this.popover.addEventListener("beforetoggle",(e=>this.beforetoggledPopoverCallback.bind(this)(e))),this.popover.addEventListener("toggle",(e=>this.toggledPopoverCallback.bind(this)(e))),e.append(this.popover),e.append(this.input),e.adoptedStyleSheets=[t]}connectedCallback(){if(null==this.id||""===this.id)throw new Error("This elements needs an ID!");this.popover.setAttribute("attach","#"+this.id),this.options=document.createElement("div"),this.options.id="cont-options",this.options.slot="content";for(const e of this.querySelectorAll("option"))e.onclick=e=>this.clickedOptionCallback.bind(this)(e),this.options.append(e);this.input.innerHTML="‎",this.popover.append(this.options),this.select(0)}changedFilterCallback(){window.clearTimeout(this._filterTimeout),this._filterTimeout=setTimeout((()=>{const e=this.filter.value.toLowerCase();for(const t of this.options.children)0===e.length||""!==t.value&&t.innerText.toLowerCase().includes(e)?t.style.display="":t.style.display="none"}),500)}beforetoggledPopoverCallback(e){this._disableAttrCallback=!0,"open"===e.newState?(this.setAttribute("open",""),this.popover.style.visibility="hidden"):(heEnableBodyScroll(),this.removeAttribute("open")),this._disableAttrCallback=!1}toggledPopoverCallback(e){if("open"===e.newState){let e="bottom-right";heSpaceBelow(this)<this.popover.offsetHeight+20&&(e="top-right");const t=this.getAttribute("position")??e;hePositionRelative(this.popover,this.input,t,6),this.popover.style.width=this.input.offsetWidth-7+"px",heDisableBodyScroll(),this.popover.style.visibility="",this.filter.focus()}else{this.filter.value="";for(const e of this.options.children)e.style.display=""}}select(e){const t=this.options.children[e];console.assert(null!=t,"No option with the given index!"),this._select(t)}_select(e){this.input.innerHTML=e.innerHTML,this.value=e.value,null!=this.selection&&this.selection.removeAttribute("selected"),this.selection=e,this.selection.setAttribute("selected",""),this.internals.setFormValue(this.value)}open(){this.popover.showPopover()}close(){this.popover.hidePopover()}toggle(){this.popover.togglePopover()}clickedOptionCallback(e){this.popover.hidePopover();const t=e.currentTarget;this._select(t)}attributeChangedCallback(e,t,o){if(!this._disableAttrCallback)switch(e){case"open":null==o||"false"===o?this.popover.hidePopover():this.popover.showPopover();break;case"filter":this.filter.style.display=null==o||"false"===o?"none":""}}}document.addEventListener("DOMContentLoaded",(function(){customElements.define("he-select",e)}));export{e as HeliumSelect};
