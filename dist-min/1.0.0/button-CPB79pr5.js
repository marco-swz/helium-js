import{_ as t,i as e,r as o,A as r,b as i}from"./lit-element-BFntg_Aa.js";import{s as l}from"./button-PRBUFLqa.js";import{t as s}from"./custom-element-Dz3n6kSt.js";import{n}from"./property-ZAv1lmY7.js";let p=class extends e{constructor(){super(...arguments),this.disabled=!1,this.loading=!1,this.href="",this.theme=null,this.variant=null}static get styles(){return[o(l)]}render(){return i`
            <a href=${this.href||r}>
                <button id="he-button" @click=${()=>this._handleClickButton()}>
                    <slot></slot>
                </button>
            </a>
        `}_handleClickButton(){}};t([n({type:Boolean,reflect:!0})],p.prototype,"disabled",void 0),t([n({type:Boolean,reflect:!0})],p.prototype,"loading",void 0),t([n({type:String,reflect:!0,useDefault:!0})],p.prototype,"href",void 0),t([n({reflect:!0})],p.prototype,"theme",void 0),t([n({reflect:!0})],p.prototype,"variant",void 0),p=t([s("he-button")],p);export{p as HeliumButton};
