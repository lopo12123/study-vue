export const isObject = (value: any) => {
    return typeof value === 'object' && value !== null
}
export const isFunction = (value: any) => {
    return typeof value === 'function'
}
export const isArray = Array.isArray
export const isString = (value: any) => {
    return typeof value === 'string'
}
export const assign = Object.assign

// vue3 提供的形状标识
export const enum ShapeFlags {
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT = 1 << 2,
    TEXT_CHILDREN = 1 << 3,
    ARRAY_CHILDREN = 1 << 4,
    SLOTS_CHILDREN = 1 << 5,
    TELEPORT = 1 << 6,
    SUSPENSE = 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
