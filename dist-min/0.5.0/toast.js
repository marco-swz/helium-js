class t extends HTMLElement{static observedAttributes=["position"];$contToasts;constructor(){super();let t=this.attachShadow({mode:"open"});this.internals=this.attachInternals();let e=new CSSStyleSheet;e.replaceSync(scss`
            :host {
                position: fixed;
                top: unset;
                right: unset;
                left: 50%;
                bottom: 10px;
                transform: translateX(-50%);
                width: 300px;
            }

            :host([position=bottom-right]) {
                top: unset;
                left: unset;
                bottom: 10px;
                right: 10px;
                transform: unset;
            }

            :host([position=bottom-left]) {
                top: unset;
                right: unset;
                bottom: 10px;
                left: 10px;
                transform: unset;
            }

            :host([position=top-left]) {
                bottom: unset;
                right: unset;
                top: 10px;
                left: 10px;
                transform: unset;
            }

            :host([position=top-right]) {
                bottom: unset;
                left: unset;
                top: 10px;
                right: 10px;
                transform: unset;
            }

            :host([position=top]) {
                bottom: unset;
                right: unset;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
            }

            #contToasts {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            #toast {
                border: 1px solid grey;
                border-radius: var(--he-toast-radius-border, 3px);
                background-color: var(--he-toast-clr-bg, white);
                z-index: 10;
            }

            #bar {
                width: 100%;
                height: 5px;
                background-color: red;
                margin-left: auto;
                margin-right: auto;
            }

            #bar[type=warn] {
                background-color: var(--he-toast-bg-bar-warn, orange);
            }

            #bar[type=error] {
                background-color: var(--he-toast-bg-bar-error, indianred);
            }

            #bar[type=success] {
                background-color: var(--he-toast-bg-bar-success, seagreen);
            }

            #contMain {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #contText {
                padding: 1rem 2rem;
                font-size: 16px;
            }

            #btnClose {
                border-radius: 50%;
                font-size: 20px;
                font-weight: 500;
                margin-right: 10px;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                text-align: center;
                vertical-align: middle;
            }

            #btnClose:hover {
                background-color: whitesmoke;
            }
        `),this.$contToasts=document.createElement("div"),this.$contToasts.id="contToasts",t.append(this.$contToasts),t.adoptedStyleSheets=[e]}connectedCallback(){}_renderToast(t,e){const o=this.getAttribute("timeout-ms")??4e3,n=document.createElement("div");n.id="toast";const s=document.createElement("div");s.id="bar",s.style.width="0%",s.setAttribute("type",e);s.animate([{width:"100%"},{width:"0%"}],{duration:o}).onfinish=()=>this.hideToast(n),n.append(s);const a=document.createElement("div");a.id="contMain",n.append(a);const i=document.createElement("div");i.id="contText",i.innerHTML=t,a.append(i);const r=document.createElement("div");return r.id="btnClose",r.onclick=()=>this.hideToast(n),r.innerHTML="x",a.append(r),n}showToast(t,e){const o=this._renderToast(t,e);o.animate([{opacity:"0"},{opacity:"1"}],{duration:200});(this.getAttribute("position")??"").includes("top")?this.$contToasts.prepend(o):this.$contToasts.append(o)}hideToast(t){t.animate([{opacity:"1"},{opacity:"0"}],{duration:200}).onfinish=()=>t.remove()}attributeChangedCallback(t,e,o){}}function e(t,e){let o=document.querySelector("#he-toast-temp");null===o&&(o=document.createElement("he-toast"),o.id="he-toast-temp",o.setAttribute("position","top-right"),document.body.append(o)),o.showToast(t.detail.value,e)}document.addEventListener("DOMContentLoaded",(function(){customElements.define("he-toast",t),document.addEventListener("he-toast",(function(t){e(t)})),document.addEventListener("he-toast-error",(function(t){e(t,"error")})),document.addEventListener("he-toast-warn",(function(t){e(t,"warn")})),document.addEventListener("he-toast-success",(function(t){e(t,"success")}))}));export{t as HeliumToast};
