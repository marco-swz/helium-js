function scss(text) {
    return text;
}

function html(text) {
    return text;
}

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

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
            elem.style.left = rect.left + 'px';
            elem.style.top = rect.bottom + offset + 'px';
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

