function t(t,e,o,r){var s,i=arguments.length,n=i<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,o):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,o,r);else for(var h=t.length-1;h>=0;h--)(s=t[h])&&(n=(i<3?s(n):i>3?s(e,o,n):s(e,o))||n);return i>3&&n&&Object.defineProperty(e,o,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,o=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let i=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(e,t))}return t}toString(){return this.cssText}};const n=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new i("string"==typeof t?t:t+"",void 0,r))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:h,defineProperty:a,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,b=p.trustedTypes,m=b?b.emptyScript:"",f=p.reactiveElementPolyfillSupport,$=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},_=(t,e)=>!h(t,e),g={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=g){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),r=this.getPropertyDescriptor(t,o,e);void 0!==r&&a(this.prototype,t,r)}}static getPropertyDescriptor(t,e,o){const{get:r,set:s}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const i=r?.call(this);s?.call(this,e),this.requestUpdate(t,i,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??g}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const o=this._$Eu(t,e);void 0!==o&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,r)=>{if(o)t.adoptedStyleSheets=r.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const o of r){const r=document.createElement("style"),s=e.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=o.cssText,t.appendChild(r)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,o);if(void 0!==r&&!0===o.reflect){const s=(void 0!==o.converter?.toAttribute?o.converter:v).toAttribute(e,o.type);this._$Em=t,null==s?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,e){const o=this.constructor,r=o._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=o.getPropertyOptions(r),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=r;const i=s.fromAttribute(e,t.type);this[r]=i??this._$Ej?.get(r)??i,this._$Em=null}}requestUpdate(t,e,o){if(void 0!==t){const r=this.constructor,s=this[t];if(o??=r.getPropertyOptions(t),!((o.hasChanged??_)(s,e)||o.useDefault&&o.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:r,wrapped:s},i){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,i??e??this[t]),!0!==s||void 0!==i)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,o,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[$("elementProperties")]=new Map,y[$("finalized")]=new Map,f?.({ReactiveElement:y}),(p.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=A.trustedTypes,E=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,x="?"+S,P=`<${x}>`,k=document,U=()=>k.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,M="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,j=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,z=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...o)=>({_$litType$:t,strings:e,values:o}))(1),I=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=k.createTreeWalker(k,129);function F(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const o=t.length-1,r=[];let s,i=2===e?"<svg>":3===e?"<math>":"",n=H;for(let e=0;e<o;e++){const o=t[e];let h,a,l=-1,c=0;for(;c<o.length&&(n.lastIndex=c,a=n.exec(o),null!==a);)c=n.lastIndex,n===H?"!--"===a[1]?n=N:void 0!==a[1]?n=R:void 0!==a[2]?(L.test(a[2])&&(s=RegExp("</"+a[2],"g")),n=j):void 0!==a[3]&&(n=j):n===j?">"===a[0]?(n=s??H,l=-1):void 0===a[1]?l=-2:(l=n.lastIndex-a[2].length,h=a[1],n=void 0===a[3]?j:'"'===a[3]?z:D):n===z||n===D?n=j:n===N||n===R?n=H:(n=j,s=void 0);const d=n===j&&t[e+1].startsWith("/>")?" ":"";i+=n===H?o+P:l>=0?(r.push(h),o.slice(0,l)+C+o.slice(l)+S+d):o+S+(-2===l?e:d)}return[F(t,i+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class K{constructor({strings:t,_$litType$:e},o){let r;this.parts=[];let s=0,i=0;const n=t.length-1,h=this.parts,[a,l]=J(t,e);if(this.el=K.createElement(a,o),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=V.nextNode())&&h.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(C)){const e=l[i++],o=r.getAttribute(t).split(S),n=/([.?@])?(.*)/.exec(e);h.push({type:1,index:s,name:n[2],strings:o,ctor:"."===n[1]?Y:"?"===n[1]?tt:"@"===n[1]?et:X}),r.removeAttribute(t)}else t.startsWith(S)&&(h.push({type:6,index:s}),r.removeAttribute(t));if(L.test(r.tagName)){const t=r.textContent.split(S),e=t.length-1;if(e>0){r.textContent=w?w.emptyScript:"";for(let o=0;o<e;o++)r.append(t[o],U()),V.nextNode(),h.push({type:2,index:++s});r.append(t[e],U())}}}else if(8===r.nodeType)if(r.data===x)h.push({type:2,index:s});else{let t=-1;for(;-1!==(t=r.data.indexOf(S,t+1));)h.push({type:7,index:s}),t+=S.length-1}s++}}static createElement(t,e){const o=k.createElement("template");return o.innerHTML=t,o}}function Z(t,e,o=t,r){if(e===I)return e;let s=void 0!==r?o._$Co?.[r]:o._$Cl;const i=O(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),void 0===i?s=void 0:(s=new i(t),s._$AT(t,o,r)),void 0!==r?(o._$Co??=[])[r]=s:o._$Cl=s),void 0!==s&&(e=Z(t,s._$AS(t,e.values),s,r)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,r=(t?.creationScope??k).importNode(e,!0);V.currentNode=r;let s=V.nextNode(),i=0,n=0,h=o[0];for(;void 0!==h;){if(i===h.index){let e;2===h.type?e=new Q(s,s.nextSibling,this,t):1===h.type?e=new h.ctor(s,h.name,h.strings,this,t):6===h.type&&(e=new ot(s,this,t)),this._$AV.push(e),h=o[++n]}i!==h?.index&&(s=V.nextNode(),i++)}return V.currentNode=k,r}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,r){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,r="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=K.createElement(F(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new G(r,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,r=0;for(const s of t)r===e.length?e.push(o=new Q(this.O(U()),this.O(U()),this,this.options)):o=e[r],o._$AI(s),r++;r<e.length&&(this._$AR(o&&o._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,r,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=W}_$AI(t,e=this,o,r){const s=this.strings;let i=!1;if(void 0===s)t=Z(this,t,e,0),i=!O(t)||t!==this._$AH&&t!==I,i&&(this._$AH=t);else{const r=t;let n,h;for(t=s[0],n=0;n<s.length-1;n++)h=Z(this,r[o+n],e,n),h===I&&(h=this._$AH[n]),i||=!O(h)||h!==this._$AH[n],h===W?t=W:t!==W&&(t+=(h??"")+s[n+1]),this._$AH[n]=h}i&&!r&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Y extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class tt extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class et extends X{constructor(t,e,o,r,s){super(t,e,o,r,s),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===I)return;const o=this._$AH,r=t===W&&o!==W||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==W&&(o===W||r);r&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=A.litHtmlPolyfillSupport;rt?.(K,Q),(A.litHtmlVersions??=[]).push("3.3.1");const st=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class it extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const r=o?.renderBefore??e;let s=r._$litPart$;if(void 0===s){const t=o?.renderBefore??null;r._$litPart$=s=new Q(e.insertBefore(U(),t),t,void 0,o??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}it._$litElement$=!0,it.finalized=!0,st.litElementHydrateSupport?.({LitElement:it});const nt=st.litElementPolyfillSupport;nt?.({LitElement:it}),(st.litElementVersions??=[]).push("4.2.1");const ht=((t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,o,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[r+1]),t[0]);return new i(o,t,r)})`
:host {
    --he-button-loading-cursor: default;
    --he-button-hover-cursor: pointer;
    --he-button-disabled-cursor: not-allowed;
    --he-button-borderWidth: 0.1rem;
    --he-button-font-size: 14px;
    --he-button-height: 35px;
    --he-button-width: fit-content;

    --he-button-color: black;
    --he-button-backgroundColor: white;
    --he-button-hover-backgroundColor: hsl(240 4.8% 95.9%);
    --he-button-hover-color: black;
    --he-button-borderColor: hsl(240 4.9% 83.9%);
    --he-button-hover-borderColor: var(--he-button-borderColor);

    --he-theme-color: var(--he-accent-color, steelblue);
    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));
    --he-theme-contrast: white;

    display: inline-block;
    text-wrap: nowrap;
    border-radius: 3px;
    outline-style: none;
    box-shadow: none !important;
    width: var(--he-button-width);
    min-width: var(--he-button-minWidth);
}

:host([theme=danger]) {
    --he-theme-color: hsl(0 72.2% 50.6%);
    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));
    --he-theme-contrast: white;
}

:host([theme=warning]) {
    --he-theme-color: hsl(32.1 94.6% 43.7%);
    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));
    --he-theme-contrast: white;
}

:host([theme=success]) {
    --he-theme-color: hsl(142.1 76.2% 36.3%);
    --he-theme-bright1-color: hsl(from var(--he-theme-color) h s calc(l + 10));
    --he-theme-contrast: white;
}

:host([theme][variant]), 
:host([theme]) {
    --he-button-color: var(--he-theme-color);
    --he-button-hover-color: var(--he-theme-contrast);
    --he-button-backgroundColor: var(--he-theme-contrast);
    --he-button-hover-backgroundColor: var(--he-theme-color);
    --he-button-borderColor: var(--he-theme-color);
    --he-button-hover-borderColor: var(--he-theme-color);
}

:host([variant=primary]), :host([variant=primary][theme]) {
    --he-button-color: var(--he-theme-contrast);
    --he-button-hover-color: var(--he-theme-contrast);
    --he-button-backgroundColor: var(--he-theme-color);
    --he-button-hover-backgroundColor: var(--he-theme-bright1-color);
    --he-button-borderColor: var(--he-theme-color);
    --he-button-hover-borderColor: var(--he-theme-bright1-color);
}

:host([variant=ghost]) {
    --he-button-borderColor: white;
    --he-button-hover-borderColor: var(--he-button-hover-backgroundColor);
}
:host([variant=ghost][theme]) {
    --he-button-color: var(--he-theme-color);
    --he-button-hover-color: var(--he-theme-contrast);
    --he-button-backgroundColor: var(--he-theme-contrast);
    --he-button-hover-backgroundColor: var(--he-theme-color);
    --he-button-borderColor: var(--he-theme-contrast);
    --he-button-hover-borderColor: var(--he-theme-color);
}

a {
    width: inherit;
    cursor: inherit;
    padding: inherit;
    border-radius: inherit;
    outline-style: inherit;
    box-shadow: inherit;
    text-shadow: inherit;
    min-width: inherit;
}

#he-button {
    position: relative;
    border-radius: inherit;
    padding: inherit;
    vertical-align: middle;
    text-align: center;
    font-size: var(-he-button-fontSize);
    background-color: var(--he-button-backgroundColor);
    outline-style: inherit;
    box-shadow: inherit;
    text-shadow: inherit;
    cursor: inherit;
    color: var(--he-button-color);
    height: var(--he-button-height);
    border-width: var(--he-button-borderWidth);
    border-style: solid;
    border-color: var(--he-button-borderColor);
    padding: 0px 10px;
    font-weight: 600;
    width: inherit;
    overflow: hidden;
    min-width: inherit;
}

:host([disabled]) #he-button {
    opacity: 0.5;
    cursor: var(--he-button-disabled-cursor);
}

:host(:not([loading]):not([disabled]):hover) #he-button {
    transition:
        background-color 0.2s,
        border-color 0.2s,
        color 0.2s;
    background-color: var(--he-button-hover-backgroundColor);
    border-color: var(--he-button-hover-borderColor);
    cursor: var(--he-button-hover-cursor);
    color: var(--he-button-hover-color);
}

:host(:not([loading]):not([disabled]):active) #he-button {
    animation: inset-anim 0.15s 1 ease-in-out;
}

:host([loading]) {
    pointer-events: none;
}

:host([loading]) #he-button {
    opacity: 0.5;
    cursor: var(--he-button-loading-cursor);
}

:host([loading]) #he-button::after {
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
    border-top-color: var(--he-button-spinner-color, black);
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
}

:host([ok]) #he-button::after {
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
    border-bottom-color: var(--he-button-spinner-color, black);
    border-right-color: var(--he-button-spinner-color, black);
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

@keyframes inset-anim {
    0% {
        box-shadow: inset 0 0 0 0 hsl(from var(--he-button-hover-backgroundColor) h s l);
    }
    50% {
        box-shadow: inset 0 0 10px 0 hsl(from var(--he-button-hover-backgroundColor) h s calc(l - 10));
    }
    100% {
        box-shadow: inset 0 0 0 0 hsl(from var(--he-button-hover-backgroundColor) h s l);
    }
}
`
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,at={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:_},lt=(t=at,e,o)=>{const{kind:r,metadata:s}=o;let i=globalThis.litPropertyMetadata.get(s);if(void 0===i&&globalThis.litPropertyMetadata.set(s,i=new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),i.set(o.name,t),"accessor"===r){const{name:r}=o;return{set(o){const s=e.get.call(this);e.set.call(this,o),this.requestUpdate(r,s,t)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=o;return function(o){const s=this[r];e.call(this,o),this.requestUpdate(r,s,t)}}throw Error("Unsupported decorator location: "+r)};function ct(t){return(e,o)=>"object"==typeof o?lt(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}let dt=class extends it{constructor(){super(...arguments),this.disabled=!1,this.loading=!1,this.submit=null,this.href=null,this.theme=null,this.variant=null}static get styles(){return[ht]}render(){return B`
            <a ${this.href}>
                <button id="he-button" @click=${()=>this._handleClickButton()}>
                    <slot></slot>
                </button>
            </a>
        `}setText(t){return this.innerHTML=t,this}_handleClickButton(){this._submitForm()}_submitForm(){const t=this.submit;if(null==t)return;const e=document.querySelector(t);if(null==e)throw new Error(`No form found with ID ${t}`);if(!(e instanceof HTMLFormElement))throw new Error("The element is not a form!");e.submit()}};t([ct({type:Boolean,reflect:!0})],dt.prototype,"disabled",void 0),t([ct({type:Boolean,reflect:!0})],dt.prototype,"loading",void 0),t([ct({reflect:!0})],dt.prototype,"submit",void 0),t([ct({reflect:!0})],dt.prototype,"href",void 0),t([ct({reflect:!0})],dt.prototype,"theme",void 0),t([ct({reflect:!0})],dt.prototype,"variant",void 0),dt=t([(t=>(e,o)=>{void 0!==o?o.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)})
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */("he-button")],dt);export{dt as HeliumButton};
