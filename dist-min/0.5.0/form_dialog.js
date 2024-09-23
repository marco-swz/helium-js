import"./button.js";import"./dialog.js";import{s as scss}from"./utils-SpbzPs7e.js";class HeliumFormDialog extends HTMLElement{static observedAttributes=["open","he-title","close-icon","close-button"];dialog;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
            #he-form {
                display: grid;
                grid-template-columns: max-content 1fr;
                gap: 0.5rem;
                margin: 0.5rem;
                margin-bottom: 0.5rem;
            }

            #he-form input, #he-form select {
                font-size: 16px;
                padding: 3px 7px;
                outline: none;
                border: 1px solid grey;
                background-color: whitesmoke;
                border-radius: var(--he-form-dialog-radius-input, 2px);
            }

            #he-form input:focus, #he-form select:focus {
                border-color: var(--he-form-dialog-clr-focus, black);
            }

            #footer-diag-edit he-button:first-child {
                margin-right: 0.5rem;
            }

            #he-form .invalid-input {
                border: 1px solid red;
            }

            #he-form label {
                display: flex;
                align-items: center;
            }
        `),e.adoptedStyleSheets=[t],this.dialog=document.createElement("he-dialog"),this.form=document.createElement("form"),this.form.id="he-form",this.form.slot="body",this.dialog.append(this.form);let r=document.createElement("div");r.id="footer-diag-edit",r.slot="footer",this.dialog.append(r);let o=document.createElement("he-button");o.innerHTML="Speichern",o.id="btn-save",o.onclick=()=>this.submit.bind(this)(),r.append(o);let i=document.createElement("he-button");i.innerHTML="Schließen",i.onclick=()=>this.dialog.close(),r.append(i),e.append(this.dialog)}connectedCallback(){this.addEventListener("he-dialog-show",(function(){this.show()})),this.addEventListener("he-dialog-close",(function(){this.close()}))}getValues(e=!0){let t={};for(const e of this.body.querySelectorAll("input, select"))this._formInputBlurCallback({currentTarget:e})&&(t[e.name]=e.value);return t}submit(endpoint,fetchArgs,callbackBefore,callbackAfter){let values={};for(const e of this.form.querySelectorAll("input, select")){if(!this._formInputBlurCallback({currentTarget:e}))return;values[e.name]=e.value}endpoint=endpoint??this.getAttribute("endpoint")??this.getAttribute("action"),fetchArgs=fetchArgs??{},fetchArgs.method=fetchArgs.method??this.getAttribute("method")??"POST",fetchArgs.headers=fetchArgs.headers??this.getAttribute("headers"),fetchArgs.body=JSON.stringify(values),callbackBefore=callbackBefore??this.getAttribute("before-submit"),callbackBefore&&(fetchArgs=eval(callbackBefore+"(fetchArgs)")),callbackAfter=callbackAfter??this.getAttribute("after-submit"),this.dialog.querySelector("#btn-save").loading(),fetch(endpoint,fetchArgs).then((resp=>{this.dialog.querySelector("#btn-save").loading(!1),callbackAfter&&eval(callbackAfter+"(resp)");const event=new CustomEvent("he-form-dialog-submit",{detail:{source:this.id,data:resp}});this.dispatchEvent(event)}))}_validateInput(e){const t=e.pattern;if(e.required&&""===e.value)return!1;if(null==t)return!0;return new RegExp(t).test(e.value)}reset(){this.form.reset()}setValues(e){for(const[t,r]of Object.entries(e)){const e=this.form.querySelector(`[name="${t}"]`);e&&(e.value=r)}return this}renderRows(e){this.form.innerHTML="",e.forEach(((e,t)=>{let r=e.label;e.required&&(r+="*");let o=`edit-${t}`,i=document.createElement("label");if(i.for=o,i.innerHTML=r,this.form.append(i),e.options&&Object.keys(e.options).length>0){let t=document.createElement("select");t.id=o,t.name=e.name,e.required||t.append(document.createElement("option"));for(const[r,o]of Object.entries(e.options)){const e=document.createElement("option");e.value=r,e.innerHTML=o,t.append(e)}this.form.append(t)}else{let t=document.createElement("input");t.required=e.required,t.id=o,t.name=e.name,t.type="text",t.onblur=e=>this._formInputBlurCallback.bind(this)(e),e.pattern&&(t.pattern=e.pattern),null!=e.placeholder&&(t.placeholder=e.placeholder),this.form.append(t)}}))}_formInputBlurCallback(e){const t=e.currentTarget,r=this._validateInput(t);return r?t.classList.remove("invalid-input"):t.classList.add("invalid-input"),r}attributeChangedCallback(e,t,r){this.dialog.attributeChangedCallback(e,t,r)}show(e=!1){return e&&this.reset(),this.dialog.show(empty),this}showModal(){return this.dialog.showModal(),this}close(){return this.dialog.close(),this}}customElements.define("he-form-dialog",HeliumFormDialog);export{HeliumFormDialog};
