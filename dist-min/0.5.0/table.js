function scss(e){return e}class HeliumButton extends HTMLElement{static observedAttributes=["value","name","form","popovertarget","popovertargetaction","disabled","form","formtarget","formenctype","formmethod","formnovalidate","loading","show-dialog","close-dialog","submit","input-invalid"];button;listenerClick=null;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
        :host {
            text-wrap: nowrap;
        }

        #he-button {
            border-radius: 2px;
            color: black;
            height: 35px;
            padding: 0px 10px;
            vertical-align: middle;
            text-align: center;
            border: 1px solid rgba(0, 0, 0, 0.2235294118);
            font-size: 14px;
            background-color: var(--he-button-clr-bg, white);
            outline-style: none;
            box-shadow: none !important;
            width: auto;
            position: relative;
        }

        #he-button[disabled] {
            background-color: #d9d9d9;
            color: #666666;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button:hover:enabled:not([loading]), 
        #he-button:active:enabled:not([loading]), 
        #he-button:focus:enabled:not([loading]) {
            cursor: pointer;
            text-shadow: 0px 0px 0.3px var(--he-button-clr-border-hover);
            border-color: var(--he-button-clr-border-hover, grey);
            color: var(--he-button-clr-border-hover, black);
        }

        #he-button:hover:enabled:not([loading]){
            background-color: color-mix(in srgb,var(--he-button-clr-bg, white),black 2%)
        }

        #he-button[loading] {
            background-color: #d9d9d9;
            color: #6666668c;
            cursor: no-drop;
            text-shadow: none;
        }

        #he-button[loading]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-top-color: var(--he-button-clr-spinner, black);
            border-radius: 50%;
            animation: button-loading-spinner 1s ease infinite;
        }

        #he-button[ok]::after {
            content: "";
            position: absolute;
            width: 16px;
            height: 16px;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border: 4px solid transparent;
            border-bottom-color: var(--he-button-clr-spinner, black);
            border-right-color: var(--he-button-clr-spinner, black);
            transform: rotate(45deg);
        }

        @keyframes button-loading-spinner {
            from {
                transform: rotate(0turn);
            }

            to {
                transform: rotate(1turn);
            }
        }
        `),this.button=document.createElement("button"),this.button.id="he-button",e.append(this.button),e.adoptedStyleSheets=[t]}connectedCallback(){this.button.innerHTML=this.innerHTML,this.innerHTML=""}attributeChangedCallback(e,t,o){switch(e){case"show-dialog":this.removeEventListener("click",this._showDialog),null!==o&&(this.listenerClick=this.addEventListener("click",this._showDialog));break;case"close-dialog":this.removeEventListener("click",this._hideDialog),null!==o&&(this.listenerClick=this.addEventListener("click",this._closeDialog()));break;case"submit":this.addEventListener("click",(()=>this._submitForm()));break;case"input-invalid":o?this.disable():this.enable();break;default:null===o||"false"===o?this.button.removeAttribute(e):this.button.setAttribute(e,o)}}loading(e){null==e||e?this.setAttribute("loading",!0):this.removeAttribute("loading")}disable(){this.setAttribute("disabled",!0)}enable(){this.removeAttribute("disabled")}_submitForm(){const e=this.getAttribute("submit"),t=document.querySelector(e);console.assert(null==t,`No form found with ID ${e}`),t.submit()}_showDialog(){document.querySelector(this.getAttribute("show-dialog")).showModal()}_closeDialog(){document.querySelector(this.getAttribute("close-dialog")).close()}}customElements.define("he-button",HeliumButton);class HeliumDialog extends HTMLElement{static observedAttributes=["open","he-title","close-icon","close-button"];dialog;title;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
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
        `),e.adoptedStyleSheets=[t],e.innerHTML='\n            <dialog id="he-diag-outer">\n                <div id="he-diag-inner">\n                    <div id="he-diag-header">\n                        <div id="he-title"></div>\n                        <div id="he-icon-close">X</div>\n                    </div>\n                    <div id="he-diag-body">\n                        <slot name="body"></slot>\n                    </div>\n                    <div id="he-diag-footer">\n                        <slot name="footer"></slot>\n                    </div>\n                </div>\n            </dialog>\n        ',e.querySelector("#he-diag-body").append(...this.children),e.querySelector("#he-icon-close").onclick=()=>e.querySelector("#he-diag-outer").close(),this.dialog=e.querySelector("#he-diag-outer"),this.title=e.querySelector("#he-title")}connectedCallback(){this.addEventListener("he-dialog-show",(function(){this.show()})),this.addEventListener("he-dialog-close",(function(){this.close()}))}attributeChangedCallback(e,t,o){"open"===e&&("true"===o?this.dialog.showModal():this.dialog.close()),"he-title"===e&&(this.title.innerText=o),"lose-button"===e&&("true"===o?(this.shadowRoot.querySelector("#he-btn-close").style.visibility="visible",this.shadowRoot.querySelector("#he-diag-footer").style.visibility="visible"):(this.shadowRoot.querySelector("#he-btn-close").style.visibility="collapse",this.shadowRoot.querySelector("#he-diag-footer").style.visibility="collapse")),"close-icon"===e&&(this.shadowRoot.querySelector("#he-btn-close").style.visibility="true"===o?"visible":"collapse")}show(){return this.dialog.showModal(),this}showModal(){return this.dialog.showModal(),this}close(){return this.dialog.close(),this}setBody(e){return this.shadowRoot.querySelector("#he-diag-body slot[name=body]").innerHTML=e,this}}function showDialogTemp(e,t){let o=document.querySelector("#he-dialog-temp");if(null===o){switch(o=document.createElement("he-dialog"),o.id="he-dialog-temp",t){case"error":o.style.setProperty("--he-dialog-clr-title","indianred"),o.setAttribute("title","Fehler");break;case"warn":o.style.setProperty("--he-dialog-clr-title","orange"),o.setAttribute("title","Warnung");break;case"success":o.style.setProperty("--he-dialog-clr-title","seagreen"),o.setAttribute("title","Erfolg");break;default:o.style.removeProperty("--he-dialog-clr-title"),o.removeAttribute("title")}document.body.append(o)}e.detail&&e.detail.value&&o.setBody(e.detail.value),o.show()}customElements.define("he-dialog",HeliumDialog),document.addEventListener("he-dialog",(function(e){showDialogTemp(e)})),document.addEventListener("he-dialog-error",(function(e){showDialogTemp(e,"error")})),document.addEventListener("he-dialog-warn",(function(e){showDialogTemp(e,"warn")})),document.addEventListener("he-dialog-success",(function(e){showDialogTemp(e,"success")}));class HeliumFormDialog extends HTMLElement{static observedAttributes=["open","he-title","close-icon","close-button"];dialog;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
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
        `),e.adoptedStyleSheets=[t],this.dialog=document.createElement("he-dialog"),this.form=document.createElement("form"),this.form.id="he-form",this.form.slot="body",this.dialog.append(this.form);let o=document.createElement("div");o.id="footer-diag-edit",o.slot="footer",this.dialog.append(o);let i=document.createElement("he-button");i.innerHTML="Speichern",i.id="btn-save",i.onclick=()=>this.submit.bind(this)(),o.append(i);let r=document.createElement("he-button");r.innerHTML="Schließen",r.onclick=()=>this.dialog.close(),o.append(r),e.append(this.dialog)}connectedCallback(){this.addEventListener("he-dialog-show",(function(){this.show()})),this.addEventListener("he-dialog-close",(function(){this.close()}))}getValues(e=!0){let t={};for(const e of this.body.querySelectorAll("input, select"))this._formInputBlurCallback({currentTarget:e})&&(t[e.name]=e.value);return t}submit(endpoint,fetchArgs,callbackBefore,callbackAfter){let values={};for(const e of this.form.querySelectorAll("input, select")){if(!this._formInputBlurCallback({currentTarget:e}))return;values[e.name]=e.value}endpoint=endpoint??this.getAttribute("endpoint")??this.getAttribute("action"),fetchArgs=fetchArgs??{},fetchArgs.method=fetchArgs.method??this.getAttribute("method")??"POST",fetchArgs.headers=fetchArgs.headers??this.getAttribute("headers"),fetchArgs.body=JSON.stringify(values),callbackBefore=callbackBefore??this.getAttribute("before-submit"),callbackBefore&&(fetchArgs=eval(callbackBefore+"(fetchArgs)")),callbackAfter=callbackAfter??this.getAttribute("after-submit"),this.dialog.querySelector("#btn-save").loading(),fetch(endpoint,fetchArgs).then((resp=>{this.dialog.querySelector("#btn-save").loading(!1),callbackAfter&&eval(callbackAfter+"(resp)");const event=new CustomEvent("he-form-dialog-submit",{detail:{source:this.id,data:resp}});this.dispatchEvent(event)}))}_validateInput(e){const t=e.pattern;if(e.required&&""===e.value)return!1;if(null==t)return!0;return new RegExp(t).test(e.value)}reset(){this.form.reset()}setValues(e){for(const[t,o]of Object.entries(e)){const e=this.form.querySelector(`[name="${t}"]`);e&&(e.value=o)}return this}renderRows(e){this.form.innerHTML="",e.forEach(((e,t)=>{let o=e.label;e.required&&(o+="*");let i=`edit-${t}`,r=document.createElement("label");if(r.for=i,r.innerHTML=o,this.form.append(r),e.options&&Object.keys(e.options).length>0){let t=document.createElement("select");t.id=i,t.name=e.name,e.required||t.append(document.createElement("option"));for(const[o,i]of Object.entries(e.options)){const e=document.createElement("option");e.value=o,e.innerHTML=i,t.append(e)}this.form.append(t)}else{let t=document.createElement("input");t.required=e.required,t.id=i,t.name=e.name,t.type="text",t.onblur=e=>this._formInputBlurCallback.bind(this)(e),e.pattern&&(t.pattern=e.pattern),null!=e.placeholder&&(t.placeholder=e.placeholder),this.form.append(t)}}))}_formInputBlurCallback(e){const t=e.currentTarget,o=this._validateInput(t);return o?t.classList.remove("invalid-input"):t.classList.add("invalid-input"),o}attributeChangedCallback(e,t,o){this.dialog.attributeChangedCallback(e,t,o)}show(e=!1){return e&&this.reset(),this.dialog.show(empty),this}showModal(){return this.dialog.showModal(),this}close(){return this.dialog.close(),this}}customElements.define("he-form-dialog",HeliumFormDialog);class HeliumCheck extends HTMLElement{static formAssociated=!0;static observedAttributes=["name","indeterminate"];mark;internals;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
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
        `);let o=document.createElement("div");o.classList.add("container"),o.innerHTML=this.innerHTML,this.innerHTML="",this.mark=document.createElement("div"),this.mark.classList.add("checkmark"),o.append(this.mark),e.append(o),e.adoptedStyleSheets=[t]}connectedCallback(){this.internals=this.attachInternals(),this.addEventListener("click",(()=>this.toggle()))}set checked(e){e?(this.setAttribute("checked",!0),this.internals.states.add("checked"),this.internals.setFormValue("on","checked")):(this.removeAttribute("checked"),this.internals.states.delete("checked"),this.internals.setFormValue(null))}get checked(){return this.internals.states.has("checked")}set name(e){this.setAttribute("name",e)}get name(){return this.getAttribute("name")}set indeterminate(e){e?this.internals.states.add("indeterminate"):this.internals.states.delete("indeterminate")}get indeterminate(){return this.internals.states.has("indeterminate")}attributeChangedCallback(e,t,o){if("indeterminate"===e)this.indeterminate=null!=o&&"false"!==o}toggle(){if(this.checked=!this.checked,this.onchange){const e=new InputEvent("click");this.onchange(e)}}}document.addEventListener("DOMContentLoaded",(function(){customElements.define("he-check",HeliumCheck)}));class HeliumTable extends HTMLElement{static observedAttributes=["endpoint","pagination"];endpoint;checkAll;form;formDialogEdit;body;diagEdit;dataOld;editRequestType;idsEdit=[];nextRowId=0;pagination;offset=0;constructor(){super();let e=this.attachShadow({mode:"open"}),t=new CSSStyleSheet;t.replaceSync(scss`
        table {
            border-spacing: 0;
            border-collapse: separate;
            border-radius: var(--he-table-radius, 4px);
        }

        thead {
            position: sticky;
            top: 1px;
            z-index: 100;
        }

        thead th {
            background-color: var(--he-table-clr-bg-header, white);
            color: var(--he-table-clr-fg-header, black);
            font-weight: 500;
            padding: 7px 15px;
            padding-top: 15px;
            text-align: center;
            vertical-align: middle;
            text-wrap: nowrap;
            width: 0;
            border-bottom: 1px solid grey;
        }

        thead th:hover .label-sorter {
            opacity: 0.5;
        }

        thead th div {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            justify-content: space-between;
        }

        thead td {
            background-color: #0082b4;
            padding: 0px 4px 8px 4px;
            width: 0;

        }

        thead td:first-child {
            padding: 3px 15px;
            border-radius: 0;
        }

        thead td:last-child {
            border-radius: 0;
            padding-right: 15px;
        }

        thead select {
            padding: 0px 3px;
        }

        thead a {
            color: rgba(255, 255, 255, 0.5411764706);
            padding-left: 5px;

        }

        thead a:hover {
            color: white;
        }

        thead .cont-filter {
            position: relative;    
            width: 100%;
        }
        
        thead .span-colname {
            position: absolute;
            left: 0.3rem;
            pointer-events: none;
            transition: 0.2s ease all;
            top: 0px;
            font-weight: 600;
        }

        thead .inp-filter {
            margin: 0;
            padding: 1px 5px;
            font-size: 0.9rem;
            font-weight: 500;
            background-color: transparent;
            border-radius: 2px;
            outline: none;
            border: 0;
            color: black;
            width: 100%;
            -webkit-appearance: none;
            -moz-appearance: none;
            text-indent: 1px;
            text-overflow: '';
            border-radius: var(--he-table-filter-radius, 2px);
        }

        tbody tr:last-child td:first-child {
            border-bottom-left-radius: var(--he-table-radius, 4px);
        }
        tbody tr:last-child td:last-child {
            border-bottom-right-radius: var(--he-table-radius, 4px);
        }
        thead tr:first-child th:first-child {
            border-top-left-radius: var(--he-table-radius, 4px);
        }
        thead tr:first-child th:last-child {
            border-top-right-radius: var(--he-table-radius, 4px);
        }

        thead .inp-filter:focus,
        .cont-filter input:not(:placeholder-shown),
        .cont-filter select:has(option:checked:not([value=""])) {
            background-color: whitesmoke;
            transform: translateY(9px);
            font-weight: 600;
        }

        thead .inp-filter:focus + .span-colname, 
        .cont-filter input:not(:placeholder-shown) + .span-colname,
        .cont-filter select:has(option:checked:not([value=""])) + .span-colname {
            transform: translateY(-3px);
            font-size: 0.7rem;
            opacity: 1;
        }
        
        tbody {
            min-height: 15px;
        }

        tbody tr:nth-child(even) {
            background-color: whitesmoke;
        }

        tbody tr:hover {
            background-color: #dcdcdc;
        }

        tbody td {
            text-wrap: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 400px;
            padding: 5px 15px;
            vertical-align: middle;
            width: 0;

        }

        tbody td xmp {
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        tbody #row-btn-more {
            background-color: var(--he-table-clr-bg-more, whitesmoke);
            color: var(--he-table-clr-fg-more, black);
            cursor: pointer;
            text-align: center;
        }

        tbody #row-btn-more:hover {
            filter: brightness(110%);
        }

        tbody #row-btn-more td {
            padding: 0.3rem;
        }

        .cont-sorters {
            display: inline-flex;
            flex-direction: column;
            font-size: 0.7rem;
            gap: 0;
            cursor: pointer;
        }

        .label-sorter {
            opacity: 0;
        }

        thead th div .label-sorter:hover {
            opacity: 1;
        }

        thead th div .label-sorter:has(input:checked) {
            opacity: 1;
        }

        .label-sorter input {
            display: none;
        }

        table[loading] {
            pointer-events: none;
            cursor: no-drop;
        }

        table[loading] tbody {
            position: relative;
        }

        table[loading] tbody::after {
            content: "";
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: linear-gradient(-90deg, #dbd8d8 0%, #fcfcfc 50%, #dbd8d8 100%);
            background-size: 400% 400%;
            animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
            0% {
                background-position: 0% 0%
            }
            100% {
                background-position: -135% 0%
            }
        }
        `),e.adoptedStyleSheets=[t]}connectedCallback(){const e=this.shadowRoot;this.id=""==this.id?"he-table-"+Math.floor(10000000001*Math.random()):this.id;let t=document.createElement("table");this.form=document.createElement("form"),this.form.id="form-tbl",this.form.append(t),e.append(this.form);let o=document.createElement("tr"),i=document.createElement("tr");const r=this.querySelectorAll("th");for(let e of r){let t=e.getAttribute("column")??e.innerText,o=document.createElement("div"),r=document.createElement("div");r.classList.add("cont-filter"),o.append(r);let n=document.createElement("span");n.innerHTML=e.innerHTML.trim(),n.classList.add("span-colname"),e.innerHTML="",r.append(n);let l=this._renderSorters(t);e.setAttribute("column",t),o.append(l),e.append(o),i.append(e);const a=this._getColumnOptions(e);if(a&&a.length>0){let e=document.createElement("select");e.id="filter-"+t,e.name=t,e.classList.add("inp-filter"),e.onchange=e=>this._filterChangeCallback(e);let o=document.createElement("option");o.value="",e.append(o);for(const t of a)e.append(t.cloneNode(!0));r.prepend(e)}else{let o=document.createElement("input");o.id="filter-"+t,o.type="search",o.name=t,o.autocomplete="off",o.placeholder=" ",o.classList.add("inp-filter"),o.value=e.getAttribute("filter")??"",o.onchange=e=>this._filterChangeCallback(e),r.prepend(o)}}this.checkAll=document.createElement("he-check"),this.checkAll.id="check-all",this.checkAll.onchange=e=>this._checkAllCheckCallback.bind(this)(e);let n=document.createElement("th");n.append(this.checkAll),i.prepend(n);let l=document.createElement("thead");l.append(i),l.append(o),t.append(l),this.body=document.createElement("tbody");const a=this.querySelectorAll("tr:has(td)");for(const e of a){let t={};for(let o=0;o<r.length;++o){const i=e.children[o],n=r[o],l=i.getAttribute("data")??i.innerText;t[n.getAttribute("column")??n.innerText]=l}let o=this._renderRow(t);this.body.append(o)}t.append(this.body),this.diagEdit=this._renderDialogEdit(),e.append(this.diagEdit),this.innerHTML="";for(let e of this.form.querySelectorAll(".cont-filter")){let t=e.querySelector(".span-colname");e.querySelector(".inp-filter").style.minWidth=t.offsetWidth+"px"}this._requestRows(this._replaceBody)}_renderSorters(e){let t=document.createElement("input");t.type="radio",t.name="sort",t.value=e+"-asc",t.id=e+"-asc",t.onclick=e=>this._sortClickCallback.bind(this)(e,!1);let o=document.createElement("label");o.for=e+"asc",o.innerHTML="▲",o.classList.add("label-sorter"),o.append(t);let i=document.createElement("input");i.type="radio",i.name="sort",i.value=e+"-desc",i.id=e+"-desc",i.onclick=e=>this._sortClickCallback.bind(this)(e,!0);let r=document.createElement("label");r.for=e+"desc",r.classList.add("label-sorter"),r.innerHTML="▼",r.append(i);let n=document.createElement("div");return n.classList.add("cont-sorters"),n.append(o),n.append(r),n}_getColumnOptions(e){let t=e.getAttribute("options"),o=document.querySelector("datalist"+t);return null==o?null:o.children}_sortClickCallback(e,t){if(this.endpoint)return void this._requestRows(this._replaceBody);let o=e.currentTarget;const i=Array.prototype.indexOf.call(o.parentElement.parentElement.parentElement.parentElement.parentElement.children,o.parentElement.parentElement.parentElement.parentElement);let r=[];for(const e of this.body.children)r.push([e.children[i].getAttribute("data"),e]);let n=t?Array.from(r).sort(((e,t)=>t[0].localeCompare(e[0]))):Array.from(r).sort(((e,t)=>e[0].localeCompare(t[0])));for(const e of n)this.body.append(e[1])}_filterChangeCallback(e){if(this.offset=0,null!=this.endpoint)return void this._requestRows(this._replaceBody);const t=e.currentTarget,o=t.value.toLowerCase(),i=Array.prototype.indexOf.call(t.parentElement.parentElement.parentElement.parentElement.children,t.parentElement.parentElement.parentElement);for(const e of this.body.children){const t=e.children[i].getAttribute("data");let r=e.getAttribute("mask")??0;t.toLowerCase().includes(o)?r&=-2<<i:r|=1<<i,e.setAttribute("mask",r),e.style.visibility=r>0?"collapse":null}}_getColumns(){return this.shadowRoot.querySelectorAll("th[column]")}_renderCellText(e,t){switch(e){case"date":return t.split("-").reverse().join(".");case"datetime":t=t.replace("T"," ");const[e,o]=t.split(" ");return e.split("-").reverse().join(".")+" "+o;default:return t}}_renderRow(e){let t=document.createElement("he-check");t.name="rows[]",t.value=e.id??"",t.classList.add("check-row");let o=document.createElement("td");o.append(t);let i=document.createElement("tr");i.id="row-"+this.nextRowId++,i.append(o),i.onclick=e=>this._rowClickCallback.bind(this)(e);for(let t of this._getColumns()){let o=t.getAttribute("column"),r=t.getAttribute("type"),n=document.createElement("td"),l=e[o]??"";n.innerHTML=this._renderCellText(r,l),n.setAttribute("data",l),n.title=l,i.append(n)}return i}showDialogNew(){this.diagEdit.reset(),this.editRequestType="POST",this.diagEdit.setAttribute("he-title","Erstellen"),this.diagEdit.showModal()}showDialogEdit(){let e=this.shadowRoot.querySelector(".check-row:state(checked)");if(null==e)throw new Error("No row selected");let t=e.parentElement.parentElement,o=this._getRowData(t,!0);this.diagEdit.setValues(o),this.dataOld=o,this.idsEdit=[t.id],this.editRequestType="PATCH",this.diagEdit.setAttribute("he-title","Bearbeiten"),this.diagEdit.showModal()}showDialogDuplicate(){let e=this.shadowRoot.querySelector(".check-row:state(checked)");if(null==e)throw new Error("No row selected");let t=e.parentElement.parentElement,o=this._getRowData(t,!0);this.diagEdit.setValues(o),this.editRequestType="POST",this.diagEdit.setAttribute("he-title","Duplizieren"),this.diagEdit.showModal()}loading(e=!0){e?this.body.parentElement.setAttribute("loading",!0):this.body.parentElement.removeAttribute("loading")}deleteChecked(e=!0){let t=this.shadowRoot.querySelectorAll(".check-row:state(checked)"),o={data:[]};for(let e of t){let t=e.closest("tr"),i=this._getRowData(t);o.data.push(i)}let i=o.data.length;if(0===i)return void window.alert("Keine Zeilen ausgewählt.");const r=i>1?`werden ${i} Zeilen`:"wird 1 Zeile";if(!e||window.confirm(`Es ${r} gelöscht.\nSind Sie sicher?`))if(null==this.endpoint)for(const e of t)e.parentElement.parentElement.remove();else fetch(this.endpoint,{method:"DELETE",body:JSON.stringify(o)}).then((e=>e.json())).then((e=>{e.forEach(((e,o)=>{e||t[o].closest("tr").remove()}))})).catch((e=>{console.log(e)}))}_getRowData(e,t=!1){let o={},i=this._getColumns();for(let r=0;r<i.length;++r){let n=e.children[r+1];o[i[r].getAttribute("column")]=t?n.innerText:n.getAttribute("data")}return o}_requestRows(e){if(null==this.endpoint)return;this.loading();let t=new FormData(this.form);null!=this.pagination&&(t.append("offset",this.offset),t.append("count",this.pagination+1)),fetch(this.endpoint+"/?"+new URLSearchParams(t).toString(),{method:"GET"}).then((e=>e.json())).then((t=>{e.bind(this)(t)})).catch((e=>{console.log(e)})).finally((()=>this.loading(!1)))}attributeChangedCallback(e,t,o){switch(e){case"endpoint":this.endpoint=o;break;case"pagination":this.pagination=Number(o)}}replaceRowData(e,t){let o=this.body.querySelector("#"+e);if(null==o)throw new Error("No row found with the row ID "+e);let i=this._getColumns();for(let e=0;e<i.length;++e){const r=i[e].getAttribute("column"),n=i[e].getAttribute("type")??"text",l=t[r];if(null==l)continue;let a=o.children[e+1];a.setAttribute("data",l),a.innerHTML=this._renderCellText(n,l)}}_replaceBody(e){this.body.innerHTML="",this.offset=0,this.checkAll.checked=!1,this.checkAll.indeterminate=!1;let t=!1;null!=this.pagination&&e.length>this.pagination&&(e.pop(),t=!0);for(let t of e)this.body.append(this._renderRow(t));t&&this.body.append(this._renderButtonMore())}_renderButtonMore(){let e=document.createElement("tr");e.id="row-btn-more";let t=document.createElement("td");return t.colSpan="100",t.title="Mehr anzeigen",t.innerHTML="Mehr anzeigen",t.onclick=()=>this._handlePagination(),e.append(t),e}_handlePagination(){this.offset+=this.pagination??0,this._requestRows(this._appendRows)}_appendRows(e){null!=this.pagination&&e.length>this.pagination&&e.pop();let t=null;"row-btn-more"===this.body.lastChild.id&&(t=this.body.lastChild,this.body.removeChild(t));for(let t of e)this.body.append(this._renderRow(t));null!=t&&e.length===this.pagination&&this.body.append(t)}_renderDialogEdit(){let e=[];for(let t of this._getColumns()){const o=this._getColumnOptions(t);let i=null;if(o&&o.length>0){i=[];for(const e of o)i[e.value]=e.innerHTML}"true"!==t.getAttribute("no-edit")&&e.push({name:t.getAttribute("column"),required:"true"===t.getAttribute("required"),label:t.querySelector("span").innerHTML,placeholder:t.getAttribute("default"),pattern:t.getAttribute("pattern"),options:i})}let t=document.createElement("he-form-dialog");return t.renderRows(e),t.setAttribute("endpoint",this.endpoint),t.setAttribute("before-submit",`document.querySelector('#${this.id}').formEditBeforeSubmitCallback`),t.setAttribute("after-submit",`document.querySelector('#${this.id}').formEditAfterSubmitCallback`),t}formEditBeforeSubmitCallback(e){return e.body={data:[JSON.parse(e.body)]},null!=this.dataOld&&(e.body.old=[this.dataOld]),e.method=this.editRequestType,e.headers={Accept:"application/json","Content-Type":"application/json"},e.body=JSON.stringify(e.body),e}formEditAfterSubmitCallback(e){e.json().then((e=>{switch(this.editRequestType){case"POST":this._requestRows(this._replaceBody);break;case"PATCH":e.forEach(((e,t)=>{const o=this.idsEdit[t];this.replaceRowData(o,e)}))}this.diagEdit.close()}))}_checkAllCheckCallback(){this.checkAll.indeterminate=!1;for(const e of this.body.querySelectorAll(".check-row"))this.checkAll.checked?e.checked=!0:e.checked=!1}_updateExternElements(){for(const e of document.querySelectorAll(`[he-table-checked="#${this.id}"]`))switch(e.classList.remove(".he-table-checked-none"),e.classList.remove(".he-table-checked-one"),e.classList.remove(".he-table-checked-multiple"),this.countChecked){case 0:e.setAttribute("he-table-state","none");break;case 1:e.setAttribute("he-table-state","one");break;default:e.setAttribute("he-table-state","multiple")}}_rowClickCallback(e){const t=e.currentTarget,o=this.body.querySelectorAll(".check-row:state(checked)");let i=o.length;if(!e.target.classList.contains("check-row")){for(let e of o)e.checked=!1;t.children[0].children[0].checked=!0,i=1}0===i?(this.checkAll.checked=!1,this.checkAll.indeterminate=!1):i<this.body.children.length?(this.checkAll.checked=!0,this.checkAll.indeterminate=!0):(this.checkAll.indeterminate=!1,this.checkAll.checked=!0)}}customElements.define("he-table",HeliumTable);export{HeliumTable};
