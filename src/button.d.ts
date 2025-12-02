/**
 * A button with included loading animation.
 *
 * @attr he-input-invalid - One or more IDs of `HeliumInput` elements.
 * The attribute is set by the inputs themself if they are invalid.
 * This behavior is activated by he `report-validtity` attribute of the `HeliumInput`.
 * @attr show-dialog - Calls `.showModal()` on the specified element(s) if the button is pressed.
 * @attr close-dialog - Calls `.close()` on the specified element(s) if the button is pressed.
 * @attr {string} onload - The content `onload` is evaluated when attached to the DOM
 *
 * @cssprop [--he-button-cursor-loading = default] - The cursor style when in `loading` state
 * @cssprop [--he-button-cursor-hover = pointer] - The cursor style when hovering
 * @cssprop [--he-button-cursor-disabled = not-allowed] - The cursor style when in `disabled` state
 *
 * @extends HTMLElement
 * @todo Add all css variables to doc
 * @todo Disable all click events when disabled or loading
 */
export class HeliumButton extends HTMLElement {
    static observedAttributes: string[];
    /** @type {HTMLButtonElement} */
    $button: HTMLButtonElement;
    /** @type {HTMLAnchorElement} */
    $anchor: HTMLAnchorElement;
    /** @type {?EventListener} */
    listenerClick: EventListener | null;
    /** @type {number} */
    slotCount: number;
    /**
     * Gets or sets the `disabled` state of the button.
     * @type {boolean}
     */
    set disabled(val: boolean);
    get disabled(): boolean;
    /**
     * Gets or sets the `loading` state of the button.
     * While loading, a spinner is shown on top of the button.
     * @type {boolean}
     */
    set loading(val: boolean);
    get loading(): boolean;
    /**
     * Gets or sets the theme of the button.
     * @type {'danger'|'warning'|'success'}
     */
    set theme(val: string | null);
    get theme(): string | null;
    /**
     * Gets or sets the theme of the button.
     * @type {'primary'|'ghost'}
     */
    set variant(val: string | null);
    get variant(): string | null;
    /**
     * Callback for attribute changes of the web component.
     * @param {string} name The attribute name
     * @param {string} _oldValue The previous attribute value
     * @param {string} newValue The new attribute value
     */
    attributeChangedCallback(name: string, _oldValue: string, newValue: string): void;
    connectedCallback(): void;
    setText(newText: any): void;
    _closeDialog(): void;
    _submitForm(): void;
    _showDialog(): void;
}
//# sourceMappingURL=button.d.ts.map