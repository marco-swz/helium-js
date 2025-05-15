export function scss(text) {
    return text;
}

export function html(text) {
    return text;
}

export function preventDefaultForScrollKeys(e) {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
        e.preventDefault();
        return false;
    }
}

/**
 * Returns the amount of pixels between the element and
 * the bottom of the screen.
 * @param {HTMLElement} element
 * @returns number
 */
export function heSpaceBelow(element) {
    const elementRect = element.getBoundingClientRect();
    const spaceBelow = window.innerHeight - elementRect.bottom;
    return spaceBelow;
}

/**
 * 
 * @param {HTMLElement} $elem
 * @param {HTMLElement} $target
 * @param {string} position
 * @param {number} offset
 * @returns void
 */
export function hePositionRelative($elem, $target, position, offset = 0) {
    const rect = $target.getBoundingClientRect();

    switch (position) {
        case 'bottom':
        case 'bottom-center':
            $elem.style.left = (rect.left + rect.width / 2 - $elem.offsetWidth / 2) + 'px';
            $elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'top':
        case 'top-center':
            $elem.style.left = (rect.left + rect.width / 2 - $elem.offsetWidth / 2) + 'px';
            $elem.style.top = rect.top - $elem.offsetHeight - offset + 'px';
            break;
        case 'bottom-right':
            $elem.style.left = (rect.left + rect.width - $elem.offsetWidth) + 'px';
            $elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'bottom-left':
            $elem.style.left = rect.left + 'px';
            $elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'top-right':
            $elem.style.top = '';
            $elem.style.left = (rect.left + rect.width - $elem.offsetWidth) + 'px';
            $elem.style.top = rect.top - $elem.offsetHeight - offset + 'px';
            break;
        case 'top-right':
            $elem.style.top = '';
            $elem.style.left = rect.left + 'px';
            $elem.style.top = rect.top - $elem.offsetHeight - offset + 'px';
            break;
        case 'offscreen':
            $elem.style.left = '-10000px';
            break;
        default:
            throw new Error('Invalid position');
    }
}

export function heDisableBodyScroll() {
    //const isScrollYVisible = document.body.scrollHeight > document.body.clientHeight;
    //if (isScrollYVisible) {
    //    document.body.style.position = 'fixed';
    //    document.body.style.overflowY = 'scroll';
    //}

    //const isScrollXVisible = document.body.scrollWidth > document.body.clientWidth;
    //if (isScrollXVisible) {
    //    document.body.style.position = 'fixed';
    //    document.body.style.overflowX = 'scroll';
    //}
    //document.body.style.overflowX = 'scroll';
}

export function heEnableBodyScroll() {
    document.body.style.position = 'static';
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'auto';
}


/**
 * Calls the provided callback if the a click occurs outside of the elements.
 * @param {Array<HTMLElement>} elements
 * @param {function(): void} callback
 * @returns {function(InputEvent): void} The listener callback to clean up manually
 */
export function heCallOnOutsideClick(elements, callback) {
    const outsideClickListener = event => {
        let isInside = false;
        for (const $element of elements) {
            if (heIsInside($element, event.clientX, event.clientY)) {
                isInside = true;
                break;
            }
        }

        // TODO(marco); Remove last listener. Currently one stays attached
        if (!isInside) {
            removeClickListener();
            callback();
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    }

    document.removeEventListener('click', outsideClickListener);
    document.addEventListener('click', outsideClickListener, true);
    return outsideClickListener;
}

export function heIsVisible(elem) {
    return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
}

export function heHash(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

/**
 * Checks if the coordinates are within the elements borders
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} $elem
 * @returns {boolean}
 */
export function heIsInside($elem, x, y) {
    const rect = $elem.getBoundingClientRect();

    let isInside = x > rect.left && x < rect.left + rect.width;
    isInside = isInside && y > rect.top && y < rect.top + rect.height;
    return isInside;
}
