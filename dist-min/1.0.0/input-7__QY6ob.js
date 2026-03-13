import{i as t,b as e,_ as i}from"./lit-element-BFntg_Aa.js";import{s}from"./button-PRBUFLqa.js";import{t as l}from"./custom-element-Dz3n6kSt.js";import{n as r}from"./property-ZAv1lmY7.js";import{n as a,e as o}from"./ref-BUr9nx8Q.js";let n=class extends t{static get styles(){return[s]}static{this.formAssociated=!0}render(){return e`
            <div id="cont-inp">
                <input 
                    @change=${this._handleChangeInput}
                    ${a(this._refInput)}
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
        `}constructor(){super(),this._refInput=o(),this.default=null,this.disabled=!1,this.invalid=!1,this.loading=!1,this.name=null,this.ok=!1,this.placeholder=null,this.required=!1,this.readonly=!1,this.type=null,this.value=null,this.step=null,this.pattern=null,this._internals=this.attachInternals(),this._internals.setFormValue("")}attributeChangedCallback(t,e,i){switch(t){case"type":"hidden"===i?this.style.display="none":"hidden"===e&&(this.style.display="");break;case"default":""!==this.value||this.disabled||this._internals.setFormValue(i);break;case"value":this.disabled||this._internals.setFormValue(i??"");break;case"disabled":null!=i?this._internals.setFormValue(null):this._internals.setFormValue(this.value)}}checkValidity(){const t=this._refInput.value?.validity??{valid:!0};return t.valid?this.invalid=!1:this.invalid=!0,t.valid}focus(){return this._refInput.value?.focus(),this}formResetCallback(){this.value="",this.ok=!1,this.invalid=!1}reset(){return this.formResetCallback(),this}select(){return this._refInput.value?.select(),this}_handleChangeInput(){this.disabled||(this.checkValidity()&&this._internals.setFormValue(this._refInput.value?.value??""),this.dispatchEvent(new CustomEvent("change")))}};i([r({reflect:!0,type:String})],n.prototype,"default",void 0),i([r({reflect:!0,type:Boolean})],n.prototype,"disabled",void 0),i([r({reflect:!0,type:Boolean})],n.prototype,"invalid",void 0),i([r({reflect:!0,type:Boolean})],n.prototype,"loading",void 0),i([r({reflect:!0,type:String})],n.prototype,"name",void 0),i([r({reflect:!0,type:Boolean})],n.prototype,"ok",void 0),i([r({reflect:!0,type:String})],n.prototype,"placeholder",void 0),i([r({reflect:!0,type:Boolean})],n.prototype,"required",void 0),i([r({reflect:!0,type:Boolean})],n.prototype,"readonly",void 0),i([r({reflect:!0,type:String})],n.prototype,"type",void 0),i([r({reflect:!0,type:String})],n.prototype,"value",void 0),i([r({reflect:!0,type:Number})],n.prototype,"step",void 0),i([r({reflect:!0,type:String})],n.prototype,"pattern",void 0),n=i([l("he-input")],n);export{n as HeliumInput};
