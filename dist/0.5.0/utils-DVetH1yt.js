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
 * @param {HTMLElement} elem
 * @param {HTMLElement} target
 * @param {string} position
 * @param {number} offset
 * @returns void
 */
function hePositionRelative(elem, target, position, offset=0) {
    const rect = target.getBoundingClientRect();

    switch (position) {
        case 'bottom-right':
            elem.style.left = (rect.left + rect.width - elem.offsetWidth) + 'px';
            elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'bottom-left':
            elem.style.left = rect.left + 'px';
            elem.style.top = rect.bottom + offset + 'px';
            break;
        case 'top-right':
            elem.style.top = '';
            elem.style.left = (rect.left + rect.width - elem.offsetWidth) + 'px';
            elem.style.top = rect.top - elem.offsetHeight - offset + 'px';
            break;
        case 'top-right':
            elem.style.top = '';
            elem.style.left = rect.left + 'px';
            elem.style.top = rect.top - elem.offsetHeight - offset + 'px';
            break;
        default:
            throw new Error('Invalid position');
    }
}

function heDisableBodyScroll() {
    const width = window.innerWidth - document.body.offsetWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = width + 'px';
}

function heEnableBodyScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

export { hePositionRelative as a, heDisableBodyScroll as b, heEnableBodyScroll as c, heSpaceBelow as h };
