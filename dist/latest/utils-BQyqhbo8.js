/**
 * Returns the amount of pixels between the element and
 * the bottom of the screen.
 * @param {HTMLElement} element
 * @returns number
 */
function heSpaceBelow(element) {
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
function hePositionRelative($elem, $target, position, offset = 0) {
    const rect = $target.getBoundingClientRect();

    switch (position) {
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

function heEnableBodyScroll() {
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
function heCallOnOutsideClick(elements, callback) {
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
    };

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener);
    };

    document.removeEventListener('click', outsideClickListener);
    document.addEventListener('click', outsideClickListener, true);
    return outsideClickListener;
}

/**
 * Checks if the coordinates are within the elements borders
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} $elem
 * @returns {boolean}
 */
function heIsInside($elem, x, y) {
    const rect = $elem.getBoundingClientRect();

    let isInside = x > rect.left && x < rect.left + rect.width;
    isInside = isInside && y > rect.top && y < rect.top + rect.height;
    return isInside;
}

export { heCallOnOutsideClick as a, hePositionRelative as b, heEnableBodyScroll as c, heSpaceBelow as h };
