import{css as o}from"lit-element";import{LitElement as t,html as e}from"lit";import{property as r,state as h,customElement as n}from"lit/decorators.js";function i(o,t,e,r){var h,n=arguments.length,i=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,e):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)i=Reflect.decorate(o,t,e,r);else for(var a=o.length-1;a>=0;a--)(h=o[a])&&(i=(n<3?h(i):n>3?h(t,e,i):h(t,e))||i);return n>3&&i&&Object.defineProperty(t,e,i),i}"function"==typeof SuppressedError&&SuppressedError;const a=o`
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
`;let l=class extends t{constructor(){super(...arguments),this.disabled=!1,this.loading=!1,this.submit=null,this.href=null,this._text=""}static get styles(){return[a]}render(){return e`
            <a .href=${this.href}>
                <button id="he-button" @click=${()=>this._handleClickButton()}>
                    ${this._text}
                </button>
            </a>
        `}setText(o){return this._text=o,this}_handleClickButton(){this._submitForm()}_submitForm(){const o=this.submit;if(null==o)return;const t=document.querySelector(o);if(null==t)throw new Error(`No form found with ID ${o}`);if(!(t instanceof HTMLFormElement))throw new Error("The element is not a form!");t.submit()}};i([r()],l.prototype,"disabled",void 0),i([r()],l.prototype,"loading",void 0),i([r()],l.prototype,"submit",void 0),i([r()],l.prototype,"href",void 0),i([h()],l.prototype,"_text",void 0),l=i([n("he-button")],l);export{l as HeliumButton};
