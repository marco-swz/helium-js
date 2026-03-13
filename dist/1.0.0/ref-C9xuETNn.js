import { A } from './lit-element-C9ed7Kq3.js';

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const r$1=o=>void 0===o.strings;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={CHILD:2},e$1=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=(i,t)=>{const e=i._$AN;if(void 0===e)return  false;for(const i of e)i._$AO?.(t,false),s(i,t);return  true},o$1=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===e?.size)},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),c(t);}};function h$1(i){ void 0!==this._$AN?(o$1(this),this._$AM=i,r(this)):this._$AM=i;}function n$1(i,t=false,e=0){const r=this._$AH,h=this._$AN;if(void 0!==h&&0!==h.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s(r[i],false),o$1(r[i]);else null!=r&&(s(r,false),o$1(r));else s(this,i);}const c=i=>{i.type==t.CHILD&&(i._$AP??=n$1,i._$AQ??=h$1);};class f extends i{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU;}_$AO(i,t=true){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(s(this,i),o$1(this));}setValue(t){if(r$1(this._$Ct))this._$Ct._$AI(t,this);else {const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0);}}disconnected(){}reconnected(){}}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=()=>new h;class h{}const o=new WeakMap,n=e$1(class extends f{render(i){return A}update(i,[s]){const e=s!==this.G;return e&&void 0!==this.G&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=s,this.ht=i.options?.host,this.rt(this.ct=i.element)),A}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const i=this.ht??globalThis;let s=o.get(i);void 0===s&&(s=new WeakMap,o.set(i,s)),void 0!==s.get(this.G)&&this.G.call(this.ht,void 0),s.set(this.G,t),void 0!==t&&this.G.call(this.ht,t);}else this.G.value=t;}get lt(){return "function"==typeof this.G?o.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0);}reconnected(){this.rt(this.ct);}});

export { e, n };
