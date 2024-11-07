import"./button.js";import"./input.js";import"./dialog.js";import"./select.js";import"./utils-DoExkFin.js";const e=new CSSStyleSheet;e.replaceSync("\r\n#he-form {\r\n    display: grid;\r\n    grid-template-columns: max-content 1fr;\r\n    gap: 0.5rem;\r\n    padding: 0.5rem;\r\n    margin-bottom: 0.5rem;\r\n    width: var(--he-form-dialog-width, 300px);\r\n    max-height: var(--he-form-dialog-max-height, 500px);\r\n    overflow: auto;\r\n}\r\n\r\n#footer-diag-edit {\r\n    display: flex;\r\n    gap: 0.5rem;\r\n    padding-right: 0.4rem;\r\n    padding-bottom: 0.4rem;\r\n}\r\n\r\n#he-form he-select, #he-form he-input {\r\n    width: 100%;\r\n}\r\n\r\n#he-form label {\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n");class t extends Event{fetchArgs;constructor(e){super("he-form-dialog-submit",{detail:{fetchArgs:e}}),this.fetchArgs=e}}class n extends Event{response;constructor(e){super("he-form-dialog-response",{detail:{response:e}}),this.response=e}}class i extends HTMLElement{static observedAttributes=["open","title-text"];$dialog;$form;onsubmit;constructor(){super();let t=this.attachShadow({mode:"open"});t.adoptedStyleSheets=[e],this.$dialog=document.createElement("he-dialog"),this.$form=document.createElement("form"),this.$form.id="he-form",this.$form.slot="body",this.$dialog.append(this.$form);let n=document.createElement("div");n.id="footer-diag-edit",n.slot="footer",this.$dialog.append(n);let i=document.createElement("he-button");i.innerHTML="Speichern",i.id="btn-save",i.variant="primary",i.onclick=()=>this.submit.bind(this)(),n.append(i),t.append(this.$dialog)}connectedCallback(){this.addEventListener("he-dialog-show",(function(){this.show()})),this.addEventListener("he-dialog-close",(function(){this.close()}))}getValues(){let e={};for(const t of this.$form.querySelectorAll(".input"))e[t.name]=t.value;return e}submit(e,i){if(!this.checkValidity())return;const r=this.getValues();e=e??this.getAttribute("endpoint")??this.getAttribute("action"),(i=i??{}).method=i.method??this.getAttribute("method")??"POST",i.headers=i.headers??this.getAttribute("headers"),i.body=JSON.stringify(r);let o=new t(i);this.dispatchEvent(o),null!=this.onsubmit&&this.onsubmit(o),this.$dialog.querySelector("#btn-save").loading=!0,fetch(e,i).then((e=>{this.$dialog.querySelector("#btn-save").loading=!1;const t=new n(e);this.dispatchEvent(t),null!=this.onresponse&&this.onresponse(t)}))}reset(){this.$form.reset()}setValues(e){for(const[t,n]of Object.entries(e)){const e=this.$form.querySelector(`[name="${t}"]`);e&&(e.value=n)}return this}renderRows(e){this.$form.innerHTML="",e.forEach(((e,t)=>{let n=`edit-${t}`,i=e.label;if(e.required&&(i+="*"),!e.hidden){let e=document.createElement("label");e.for=n,e.innerHTML=i,this.$form.append(e)}if(e.options&&Object.keys(e.options).length>0){let t=document.createElement("he-select");if(t.id=n,t.name=e.name,t.classList.add("input"),!e.required){let e=document.createElement("option");t.append(e)}e.hidden&&(t.style.display="none");for(const[n,i]of Object.entries(e.options)){const e=document.createElement("option");e.value=n,e.innerHTML=i,t.append(e)}this.$form.append(t)}else{let t=document.createElement("he-input");t.required=e.required,t.id=n,t.name=e.name,t.type="text",t.classList.add("input"),e.pattern&&(t.pattern=e.pattern),null!=e.placeholder&&(t.placeholder=e.placeholder),e.hidden&&(t.type="hidden"),this.$form.append(t)}}))}checkValidity(e){e=null==e?this.$form.querySelectorAll(".input"):[e];let t=!0;for(const n of e)n.checkValidity()||(t=!1);return t}attributeChangedCallback(e,t,n){this.$dialog.attributeChangedCallback(e,t,n)}show(e=!1){return e&&this.reset(),this.$dialog.show(empty),this}showModal(){return this.$dialog.showModal(),this}close(){return this.$dialog.close(),this}}customElements.define("he-form-dialog",i);export{i as HeliumFormDialog,n as HeliumFormDialogResponseEvent,t as HeliumFormDialogSubmitEvent};
