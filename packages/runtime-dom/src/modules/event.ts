const createInvoker = (callback) => {
    const invoker = (e) => invoker.value(e)
    invoker.value = callback
    return invoker
}

export const patchEvent = (el, eventName, nextValue) => {
    // 先移除事件, 再重新绑定事件
    // remove + add ===> add + 自定义事件(里面调用绑定的方法)
    let invokers = el._vei ||= {}

    let exists = invokers(eventName)

    // 已绑定该事件
    if (exists && nextValue) {
        exists.value = nextValue
    }
    // 未绑定该事件
    else {
        let event = eventName.slice(2).toLowerCase()

        if (nextValue) {
            const invoker = invokers[eventName] = createInvoker(nextValue)
            el.addEventListener(event, invoker)
        } else if (exists) {
            el.removeEventListener(event, exists)
            invokers[eventName] = undefined
        }
    }
}