import { styles } from './toast_styles.ts';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

export type ToastType = 'info' | 'warn' | 'error' | 'success';
export type ToastPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'top';

/**
 * A toast element for quick notification.
 *
 * @element he-toast
 *
 * @cssprop [--he-toast-clr-success = seagreen] - The accent color for success notifications
 * @cssprop [--he-toast-clr-warn = orange] - The accent color for warning notifications
 * @cssprop [--he-toast-clr-error = indianred] - The accent color for error notifications
 * @cssprop [--he-toast-radius = 3px] - The border radius of the toast
 *
 * @extends LitElement
 *
 * @todo Support for mobile devices and small screens
 */
export class HeliumToast extends LitElement {
    static get styles() {
        return [
            styles
        ];
    }

    _refContToasts: Ref<HTMLDivElement> = createRef();

    /**
     * The position of the toast on the screen.
     */
    @property({ reflect: true, type: String })
    position: null | ToastPosition = null;
    /**
     * The duration the toast is visible in milliseconds.
     * @default 5000
     */
    @property({ reflect: true, type: Number })
    timeout: null | number = null;

    constructor() {
        super();
    }

    render() {
        return html`
            <div
                ${ref(this._refContToasts)}
                id="contToasts"
            >
            </div>
        `;
    }

    /**
     * Starts the hide animation and deletes the toast.
     */
    hideToast($toast: HTMLDivElement): void {
        const animation = $toast.animate(
            [
                { opacity: '1' },
                { opacity: '0' },
            ], {
            duration: 200,
        }
        )
        animation.onfinish = () => $toast.remove();
    }


    /**
     * Shows a toast with the given message and of given type.
     */
    _showToast(message: string, type?: ToastType): void {
        const $toast = this._renderToast(message, type);

        const $contToasts = this._refContToasts.value;
        if ($contToasts == null) {
            return;
        }
        const position = this.getAttribute('position') ?? '';
        if (position.includes('top')) {
            $contToasts.prepend($toast);
        } else {
            $contToasts.append($toast);
        }
    }

    _renderToast(content: string, type: ToastType = 'info') {
        const duration = this.timeout ?? 5000;

        const $toast = document.createElement('div');
        $toast.id = 'toast';
        $toast.setAttribute('type', type);

        const $bar = document.createElement('div');
        $bar.id = 'bar';
        $bar.style.width = '0%';
        const animation = $bar.animate(
            [
                { width: '100%' },
                { width: '0%' },
            ], {
            duration: Number(duration),
        }
        )
        animation.onfinish = () => this.hideToast($toast);
        $toast.append($bar);

        const $contMain = document.createElement('div');
        $contMain.id = 'contMain';
        $toast.append($contMain);

        const $contText = document.createElement('div');
        $contText.id = 'contText';
        $contText.innerHTML = content;
        $contMain.append($contText);

        const $btnClose = document.createElement('div');
        $btnClose.id = 'btnClose';
        $btnClose.onclick = () => this.hideToast($toast);
        $btnClose.innerHTML = 'x';

        $contMain.append($btnClose);

        return $toast;
    }

    static showToast(text: string, type?: ToastType, duration = 5000) {
        let $toast = document.querySelector<HeliumToast>('#he-toast-temp') ?? (() => {
            const $toast = <HeliumToast>document.createElement('he-toast');
            $toast.id = 'he-toast-temp';
            $toast.timeout = duration;
            $toast.position = 'top-right';
            document.body.append($toast);
            return $toast;
        })();

        $toast._showToast(text, type);
    }
}

if (!customElements.get('he-toast')) {
    // @ts-ignore
    window.HeliumToast = HeliumToast;
    customElements.define("he-toast", HeliumToast);

    // @ts-ignore
    document.addEventListener("he-toast", function(e: CustomEvent) {
        HeliumToast.showToast(e.detail.value);
    })

    // @ts-ignore
    document.addEventListener("he-toast-error", function(e: CustomEvent) {
        HeliumToast.showToast(e.detail.value, 'error');
    })

    // @ts-ignore
    document.addEventListener("he-toast-warn", function(e: CustomEvent) {
        HeliumToast.showToast(e.detail.value, 'warn');
    })

    // @ts-ignore
    document.addEventListener("he-toast-success", function(e: CustomEvent) {
        HeliumToast.showToast(e.detail.value, 'success');
    })
}
