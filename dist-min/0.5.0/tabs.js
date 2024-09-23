class e extends HTMLElement{static observedAttributes=["tab"];navBar;tabNrVisible;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
            #he-tabs-nav {
                display: flex;
            }

            #he-tabs-nav label {
                padding: 0.5rem 1rem;
                cursor: pointer;
                color: gray;
                border: 1px solid lightgray;
                border-bottom: 0;
                border-top-right-radius: 3px;
                border-top-left-radius: 3px;
                background-color: whitesmoke;
            }

            #he-tabs-nav label:has(:checked) {
                color: black;
                background-color: white;
                border-bottom: 1px solid white;
                margin-bottom: -1px;
            }

            #he-tabs-nav label:hover {
                background-color: #0082b40d;
            }
        `),e.adoptedStyleSheets=[t],e.innerHTML='\n            <nav id="he-tabs-nav">\n            </nav>\n            <div id="he-tabs-content">\n                <slot name="tab"/>\n            </div>\n        ',this.navBar=e.querySelector("#he-tabs-nav"),e.addEventListener("slotchange",(e=>this.slotChangeCallback(e,this)))}connectedCallback(){}attributeChangedCallback(e,t,a){if("tab"===e)this.showTab(Number(a))}slotChangeCallback(e,t){const a=e.target;t.navBar.innerHTML="";let n=0;for(const e of a.assignedElements()){const a=e.getAttribute("title")??`Tab ${n}`,l="he-tabs-check"+n;let o=document.createElement("label");o.for=l;let r=document.createElement("input");r.id=l,r.type="radio",r.name="he-tabs-idx",r.value=n,r.setAttribute("hidden","true"),r.onchange=e=>t.tabChangeCallback(e),n>0&&(e.style.display="none");let s=document.createElement("span");s.innerHTML=a,o.append(r),o.append(s),t.navBar.append(o),n++}t.showTab(t.getAttribute("tab")??0)}tabChangeCallback(e){const t=e.target,a=Number(t.value);this.children.item(this.tabNrVisible).style.display="none";this.children.item(a).style.display="",this.tabNrVisible=a}showTab(e){const t="#he-tabs-check"+e;let a=this.navBar.querySelector(t);null!==a&&a.click()}}document.addEventListener("DOMContentLoaded",(function(){customElements.define("he-tabs",e)}));export{e as HeliumTabs};
