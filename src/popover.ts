// @ts-ignore
import styles from "./popover.css";
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { heSpaceBelow, hePositionRelative, heEnableBodyScroll, heDisableBodyScroll, RelativePosition } from "./utils.ts";
import { unsafeCSS } from 'lit-element';

export type PopoverTrigger = 'click';

/**
 * This popover element is used to show content in the forground, overlaying the content below.
 * It is positioned relative to another HTML element, which servers as anchor.
 *
 * @cssprop [--he-popover-borderColor=hsl(240 5.9% 90%)] - The border color of the popover
 * @cssprop [--he-popover-borderRadius=3px] - The border radius of the popover
 *
 * @tag he-popover
 */
@customElement('he-popover')
export class HeliumPopover extends LitElement {
    static get styles() {
        return [
            unsafeCSS(styles),
        ];
    }
    _refPopover: Ref<HTMLDivElement> = createRef();
    _$attach: null | HTMLElement = null;
    _$anchor: null | HTMLElement = null;
    _anchorElement: null | HTMLElement = null;

    /** 
     * The anchor element of the popover.
     * The `position` is used relative to this reference.
     */
    @property({ reflect: true, type: String })
    anchor: string | null = null;
    /** 
     * The dismiss action for the popover.
     */
    @property({ reflect: true, type: String })
    dismiss: 'manual' | 'auto' | null = null;
    /** 
     * The position of the popover when opened relative to its anchor.
     */
    @property({ reflect: true, type: String })
    position: null | RelativePosition = null;
    /** 
     * The `open` state of the element.
     * If `open` is set, the options are shown to the user.
     */
    @property({ reflect: true, type: Boolean })
    open = false;
    @property({ reflect: true, type: String })
    targetAction: null | PopoverTrigger = null;
    @property({ reflect: true, type: String })
    target: null | string = null;

    constructor() {
        super();
    }

    render() {
        return html`
            <div id="popover" popover
                ${ref(this._refPopover)}
                @beforetoggle=${(e: ToggleEvent) => this._handleBeforeToggledPopover.bind(this)(e)}
                @toggle=${(e: ToggleEvent) => this._handleToggledPopover.bind(this)(e)}
                .dismiss=${this.dismiss ?? 'auto'}
                .trigger=${this.targetAction ?? 'click'}
            >
                <slot></slot>
            </div>
        `;
    }

    /**
     * Callback for attribute changes of the web component.
     */
    attributeChangedCallback(name: string, _oldValue: any, newValue: any) {
        switch (name) {
            case 'open':
                if (newValue != null) {
                    this._refPopover.value?.showPopover();
                } else {
                    if (this._refPopover.value?.matches(':popover-open')) {
                        this._refPopover.value?.hidePopover();
                    }
                }
                break;
            case 'attach':
                const $attach = document.querySelector(newValue);
                if ($attach == null) {
                    throw new Error('Attachment element not found!');
                }

                this._attachToElement($attach);
                break;
            case 'anchor':
                if (newValue == null) {
                    this._$anchor = null;
                    break;
                }
                const $anchor = document.querySelector(newValue);
                if ($anchor == null) {
                    throw new Error(`Anchor element "${newValue}" not found!`);
                }

                this._$anchor = $anchor;
                break;
        }
    }

    /**
     * Returns the width and height of the popover.
     * Also works if the popover is hidden.
     */
    getSize(): [number, number] {
        const $popover = this._refPopover.value;
        if ($popover == null) {
            throw new Error('Popover not rendered');
        }
        if (this.open) {
            let rect = $popover.getBoundingClientRect();
            return [rect.width, rect.height];
        }
        const pos = this.position
        this.position = 'offscreen';
        this.open = true;
        const rect = $popover.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        this.open = false;
        this.position = pos;
        return [width, height];
    }

    hidePopover(): HeliumPopover {
        this.open = false;
        return this;
    }

    show(): HeliumPopover {
        return this.showPopover();
    }

    showPopover(): HeliumPopover {
        this.open = true;
        return this;
    }

    toggle(): HeliumPopover {
        this.togglePopover();
        return this;
    }

    togglePopover(): boolean {
        this.open = !this.open;
        return this.open;
    }

    _attachToElement($elem: HTMLElement): void {
        this._$attach = $elem;
    }

    _handleBeforeToggledPopover(e: ToggleEvent): void {
        const $popover = this._refPopover.value;
        if ($popover != null && e.newState === "open") {
            $popover.style.visibility = 'hidden';
        }
    }

    _handleToggledPopover(e: ToggleEvent): void {
        const $popover = this._refPopover.value;
        if ($popover == null) {
            return;
        }
        if (e.newState === "open") {
            if (this._$anchor) {
                let positionDefault: RelativePosition = 'bottom-left';
                if (heSpaceBelow(this) < $popover.offsetHeight + 20) {
                    positionDefault = 'top-left';
                }
                const position = this.position ?? positionDefault;
                hePositionRelative($popover, this._$anchor, position, 3);
            }

            heDisableBodyScroll();
            $popover.style.visibility = '';

        } else {
            heEnableBodyScroll();
            this.open = false;
        }
    }
}
