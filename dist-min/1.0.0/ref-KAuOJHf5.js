import{A as t}from"./lit-element-CTF9oPG1.js";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,s,i){this._$Ct=t,this._$AM=s,this._$Ci=i}_$AS(t,s){return this.update(t,s)}update(t,s){return this.render(...s)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const e=(t,s)=>{const i=t._$AN;if(void 0===i)return!1;for(const t of i)t._$AO?.(s,!1),e(t,s);return!0},h=t=>{let s,i;do{if(void 0===(s=t._$AM))break;i=s._$AN,i.delete(t),t=s}while(0===i?.size)},n=t=>{for(let s;s=t._$AM;t=s){let i=s._$AN;if(void 0===i)s._$AN=i=new Set;else if(i.has(t))break;i.add(t),c(s)}};function o(t){void 0!==this._$AN?(h(this),this._$AM=t,n(this)):this._$AM=t}function r(t,s=!1,i=0){const n=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(s)if(Array.isArray(n))for(let t=i;t<n.length;t++)e(n[t],!1),h(n[t]);else null!=n&&(e(n,!1),h(n));else e(this,t)}const c=t=>{t.type==s&&(t._$AP??=r,t._$AQ??=o)};class d extends i{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,s,i){super._$AT(t,s,i),n(this),this.isConnected=t._$AU}_$AO(t,s=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),s&&(e(this,t),h(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const s=[...this._$Ct._$AH];s[this._$Ci]=t,this._$Ct._$AI(s,this,0)}}disconnected(){}reconnected(){}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=()=>new $;class ${}const _=new WeakMap,A=(t=>(...s)=>({_$litDirective$:t,values:s}))(class extends d{render(s){return t}update(s,[i]){const e=i!==this.G;return e&&void 0!==this.G&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=i,this.ht=s.options?.host,this.rt(this.ct=s.element)),t}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const s=this.ht??globalThis;let i=_.get(s);void 0===i&&(i=new WeakMap,_.set(s,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?_.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{l as e,A as n};
