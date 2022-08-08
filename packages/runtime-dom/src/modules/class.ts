export const patchClass = (el, className) => {
    if (className === null) el.removeAttribute('class')
    else el.className = className
}