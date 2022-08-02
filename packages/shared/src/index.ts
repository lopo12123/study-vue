const isObject = (value: any) => {
    return typeof value === 'object' && value !== null
}
const isFunction = (value: any) => {
    return typeof value === 'function'
}
const isArray = Array.isArray
const assign = Object.assign

export {
    isObject,
    isFunction,
    isArray,
    assign
}
