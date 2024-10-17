const t=new CSSStyleSheet;t.replaceSync(":host {\r\n    position: fixed;\r\n    top: unset;\r\n    right: unset;\r\n    left: 50%;\r\n    bottom: 10px;\r\n    transform: translateX(-50%);\r\n    width: 300px;\r\n    font-size: 16px;\r\n    font-weight: 500;\r\n    z-index: 500;\r\n    background-color: white;\r\n}\r\n\r\n:host([position=bottom-right]) {\r\n    top: unset;\r\n    left: unset;\r\n    bottom: 10px;\r\n    right: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=bottom-left]) {\r\n    top: unset;\r\n    right: unset;\r\n    bottom: 10px;\r\n    left: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top-left]) {\r\n    bottom: unset;\r\n    right: unset;\r\n    top: 10px;\r\n    left: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top-right]) {\r\n    bottom: unset;\r\n    left: unset;\r\n    top: 10px;\r\n    right: 10px;\r\n    transform: unset;\r\n}\r\n\r\n:host([position=top]) {\r\n    bottom: unset;\r\n    right: unset;\r\n    top: 10px;\r\n    left: 50%;\r\n    transform: translateX(-50%);\r\n}\r\n\r\n#contToasts {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n}\r\n\r\n#toast {\r\n    border: 1px solid grey;\r\n    border-radius: var(--he-toast-radius, 3px);\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n    border-left: 5px solid steelblue;\r\n}\r\n\r\n#toast[type=warn] {\r\n    border-left-color: var(--he-toast-clr-warn, orange);\r\n}\r\n\r\n#toast[type=error] {\r\n    border-left-color: var(--he-toast-clr-error, indianred);\r\n}\r\n\r\n#toast[type=success] {\r\n    border-left-color: var(--he-toast-clr-success, seagreen);\r\n}\r\n\r\n#bar {\r\n    width: 100%;\r\n    height: 3px;\r\n    background-color: lightgrey;\r\n    margin-right: auto;\r\n}\r\n\r\n#contMain {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n#contText {\r\n    padding: 1rem 2rem;\r\n    font-size: inherit;\r\n}\r\n\r\n#btnClose {\r\n    border-radius: 50%;\r\n    font-size: 20px;\r\n    font-weight: 500;\r\n    margin-right: 10px;\r\n    border-radius: 50%;\r\n    width: 35px;\r\n    height: 35px;\r\n    text-align: center;\r\n    vertical-align: middle;\r\n    cursor: pointer;\r\n}\r\n\r\n#btnClose:hover {\r\n    background-color: whitesmoke;\r\n}\r\n");class n extends HTMLElement{static observedAttributes=["position"];$contToasts;constructor(){super();let n=this.attachShadow({mode:"open"});this.internals=this.attachInternals(),this.$contToasts=document.createElement("div"),this.$contToasts.id="contToasts",n.append(this.$contToasts),n.adoptedStyleSheets=[t]}attributeChangedCallback(t,n,e){}connectedCallback(){}hideToast(t){t.animate([{opacity:"1"},{opacity:"0"}],{duration:200}).onfinish=()=>t.remove()}_showToast(t,n){const e=this._renderToast(t,n);(this.getAttribute("position")??"").includes("top")?this.$contToasts.prepend(e):this.$contToasts.append(e)}_renderToast(t,n){const e=this.getAttribute("timeout-ms")??5e3,r=document.createElement("div");r.id="toast",r.setAttribute("type",n);const o=document.createElement("div");o.id="bar",o.style.width="0%";o.animate([{width:"100%"},{width:"0%"}],{duration:Number(e)}).onfinish=()=>this.hideToast(r),r.append(o);const s=document.createElement("div");s.id="contMain",r.append(s);const i=document.createElement("div");i.id="contText",i.innerHTML=t,s.append(i);const a=document.createElement("div");return a.id="btnClose",a.onclick=()=>this.hideToast(r),a.innerHTML="x",s.append(a),r}static showToast(t,n){let e=document.querySelector("#he-toast-temp");null===e&&(e=document.createElement("he-toast"),e.id="he-toast-temp",e.setAttribute("timeout-ms",5e3),e.setAttribute("position","top-right"),document.body.append(e)),e._showToast(t,n)}}customElements.get("he-toast")||(window.HeliumToast=n,customElements.define("he-toast",n),document.addEventListener("he-toast",(function(t){n.showToast(t.detail.value)})),document.addEventListener("he-toast-error",(function(t){n.showToast(t.detail.value,"error")})),document.addEventListener("he-toast-warn",(function(t){n.showToast(t.detail.value,"warn")})),document.addEventListener("he-toast-success",(function(t){n.showToast(t.detail.value,"success")})));export{n as HeliumToast};
