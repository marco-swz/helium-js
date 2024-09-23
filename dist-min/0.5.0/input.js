class t extends HTMLElement{static formAssociated=!0;static observedAttributes=["pattern","required","report-validity","type"];input;internals;constructor(){super();let t=this.attachShadow({mode:"open"}),e=new CSSStyleSheet;e.replaceSync(scss`
            :host {
                display: inline-flex;
                position: relative;
            }

            :host[loading]::after {
                content: "";
                position: absolute;
                width: 12px;
                height: 12px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 3px solid darkgrey;
                border-radius: 50%;
                border-bottom-color: var(--he-input-clr-spinner, black);
                animation: button-loading-spinner 1s ease infinite;
            }

            :host[ok]::after {
                content: "";
                position: absolute;
                width: 10px;
                height: 15px;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto 10px auto auto;
                border: 3px solid transparent;
                border-bottom-color: var(--he-input-clr-ok, black);
                border-right-color: var(--he-input-clr-ok, black);
                transform: rotate(45deg);
            }

            #inp-main {
                outline: none;
                background-color: var(--he-input-clr-bg, whitesmoke);
                border: 1px solid lightgrey;
                width: var(--he-input-width, 100%);
                padding: 0.3rem 0.4rem;
                font-size: var(--he-input-fs, 14px);
                border-radius: var(--he-input-border-radius, 3px);
            }

            #inp-main:hover, #inp-main:focus {
                border-color: var(--he-input-clr-border-hover, grey);
            }

            #inp-main[valid=false] {
                border-color: var(--he-input-clr-border-invalid, indianred);
            }

            @keyframes button-loading-spinner {
                from {
                    transform: rotate(0turn);
                }

                to {
                    transform: rotate(1turn);
                }
            }
        `),this.input=document.createElement("input"),this.input.type="text",this.input.autocomplete=!1,this.input.id="inp-main",t.append(this.input),t.adoptedStyleSheets=[e]}connectedCallback(){this.internals=this.attachInternals(),this.input.onchange=()=>this.inputChangedCallback.bind(this)(),this.value=this.innerHTML}focus(){this.input.focus()}checkValidity(){const t=this.input.validity;t.valid?this.input.setAttribute("valid",!0):this.input.setAttribute("valid",!1);const e=this.getAttribute("report-invalid");if(e){console.assert(this.id&&""!==this.id,"The input cannot report its validity if it has no ID");const i="#"+this.id,n=document.querySelectorAll(e);for(const e of n){const n=e.getAttribute("input-invalid")??"";let r=new Set(n.split(" "));t.valid?r.delete(i):r.add(i),0!==r.size?e.setAttribute("input-invalid",Array.from(r).join(" ")):e.removeAttribute("input-invalid")}}return t.valid}formResetCallback(){this.input.value=""}set name(t){this.setAttribute("name",t)}get name(){return this.getAttribute("name")}set value(t){this.input.value=t,this.internals.setFormValue(t)}get value(){return this.input.value}attributeChangedCallback(t,e,i){"type"===t&&(this.style.display="hidden"===i?"none":""),i?this.input.setAttribute(t,i):this.input.removeAttribute(t)}inputChangedCallback(){this.checkValidity()&&this.internals.setFormValue(this.input.value)}}document.addEventListener("DOMContentLoaded",(function(){customElements.define("he-input",t)}));export{t as HeliumInput};
