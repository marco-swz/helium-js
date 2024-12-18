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
    const isScrollYVisible = document.body.scrollHeight > document.body.clientHeight;
    if (isScrollYVisible) {
        document.body.style.position = 'fixed';
        document.body.style.overflowY = 'scroll';
    }

    const isScrollXVisible = document.body.scrollWidth > document.body.clientWidth;
    if (isScrollXVisible) {
        document.body.style.position = 'fixed';
        document.body.style.overflowX = 'scroll';
    }
    //document.body.style.overflowX = 'scroll';
}

function heEnableBodyScroll() {
    document.body.style.position = 'static';
    document.body.style.overflowY = 'auto';
    document.body.style.overflowX = 'auto';
}

export { hePositionRelative as a, heDisableBodyScroll as b, heEnableBodyScroll as c, heSpaceBelow as h };
