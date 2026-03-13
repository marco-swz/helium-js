import{a as e,i as t,b as r,_ as o}from"./lit-element-CTF9oPG1.js";import{t as i}from"./custom-element-Dz3n6kSt.js";import{n}from"./property-DG0WALBg.js";import{n as l,e as a}from"./ref-KAuOJHf5.js";const s=e`
:host {
    --he-input-borderColor: lightgrey;
    --he-input-borderWidth: 1px;
    --he-input-borderStyle: solid;
    --he-input-color: black;
    --he-input-fontSize: 14px;
    --he-input-backgroundColor: whitesmoke;
    --he-input-hover-borderColor: grey;
    --he-input-loading-spinner-color: black;
    --he-input-padding: 0.3rem 0.4rem;

    display: inline-block;
    position: relative;
    border-radius: 3px;
    background-color: var(--he-input-backgroundColor);
    width: 100%;
    height: 1.6rem;
    font-size: var(--he-input-fontSize);
    border-style: var(--he-input-borderStyle);
    border-color: var(--he-input-borderColor);
    border-width: var(--he-input-borderWidth);
    color: var(--he-input-color);
    cursor: text;
}

#cont-inp {
    display: inline-flex;
    width: 100%;
    height: 100%;
}

:host(:hover), :host([variant="underline"]:hover) {
    transition:
        border-color 0.2s;
    border-color: var(--he-input-hover-borderColor);
}

:host([variant="underline"]) {
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
    border-bottom-color: var(--he-input-borderColor);

}

:host([invalid]) {
    transition:
        border-color 0.2s;
    border-color: indianred;
}

:host([invalid]:hover) {
    border-color: indianred;
}

:host([loading])::after {
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
    border-bottom-color: var(--he-input-loading-spinner-color);
    animation: button-loading-spinner 1s ease infinite;
}

:host([ok]) {
    border-color: green;
}

:host([ok])::after {
    content: "✔";
    position: absolute;
    width: 10px;
    height: 15px;
    color: green;
    top: 1px;
    right: 8px;
    font-weight: 700;
}

#inp-main {
    font-family: inherit;
    outline: none;
    background-color: inherit;
    width: 100%;
    font-size:inherit;
    border-radius: inherit;
    border: none;
    padding: var(--he-input-padding);
    cursor: inherit;
    color: inherit;
}

:host([readonly]:hover),
:host([disabled]:hover) {
    border-color: var(--he-input-borderColor);
}

:host([readonly]), :host([disabled]) {
    cursor: default;
    color: hsl(from var(--he-input-color) h s calc(l + 50))
}

div[slot=content] {
    max-height: 200px;
}

#cont-options {
    display: flex;
    flex-direction: column;
}

he-popover {
    --he-popover-borderRadius: 5px;
}

::slotted(*) {
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 3px;
}

::slotted(*:hover) {
    background-color: hsl(from white h s calc(l - 10));
}

@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }

    to {
        transform: rotate(1turn);
    }
}
`;let d=class extends t{static get styles(){return[s]}static{this.formAssociated=!0}render(){return r`
            <div id="cont-inp">
                <input 
                    @change=${this._handleChangeInput}
                    ${l(this._refInput)}
                    id="inp-main"
                    .type=${this.type}
                    .placeholder=${this.placeholder??""}
                    .step=${this.step??"1"}
                    .pattern=${this.pattern??".*"}
                    ?readonly=${this.readonly}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    autocomplete="off"
                />
            </div>
        `}constructor(){super(),this._refInput=a(),this.default=null,this.disabled=!1,this.invalid=!1,this.loading=!1,this.name=null,this.ok=!1,this.placeholder=null,this.required=!1,this.readonly=!1,this.type=null,this.value=null,this.step=null,this.pattern=null,this._internals=this.attachInternals(),this._internals.setFormValue("")}attributeChangedCallback(e,t,r){switch(e){case"type":"hidden"===r?this.style.display="none":"hidden"===t&&(this.style.display="");break;case"default":""!==this.value||this.disabled||this._internals.setFormValue(r);break;case"value":this.disabled||this._internals.setFormValue(r??"");break;case"disabled":null!=r?this._internals.setFormValue(null):this._internals.setFormValue(this.value)}}checkValidity(){const e=this._refInput.value?.validity??{valid:!0};return e.valid?this.invalid=!1:this.invalid=!0,e.valid}focus(){return this._refInput.value?.focus(),this}formResetCallback(){this.value="",this.ok=!1,this.invalid=!1}reset(){return this.formResetCallback(),this}select(){return this._refInput.value?.select(),this}_handleChangeInput(){this.disabled||(this.checkValidity()&&this._internals.setFormValue(this._refInput.value?.value??""),this.dispatchEvent(new CustomEvent("change")))}};o([n({reflect:!0,type:String})],d.prototype,"default",void 0),o([n({reflect:!0,type:Boolean})],d.prototype,"disabled",void 0),o([n({reflect:!0,type:Boolean})],d.prototype,"invalid",void 0),o([n({reflect:!0,type:Boolean})],d.prototype,"loading",void 0),o([n({reflect:!0,type:String})],d.prototype,"name",void 0),o([n({reflect:!0,type:Boolean})],d.prototype,"ok",void 0),o([n({reflect:!0,type:String})],d.prototype,"placeholder",void 0),o([n({reflect:!0,type:Boolean})],d.prototype,"required",void 0),o([n({reflect:!0,type:Boolean})],d.prototype,"readonly",void 0),o([n({reflect:!0,type:String})],d.prototype,"type",void 0),o([n({reflect:!0,type:String})],d.prototype,"value",void 0),o([n({reflect:!0,type:Number})],d.prototype,"step",void 0),o([n({reflect:!0,type:String})],d.prototype,"pattern",void 0),d=o([i("he-input")],d);export{d as HeliumInput};
