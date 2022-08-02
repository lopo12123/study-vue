import { isObject } from "@minivue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandlers";

const isReactive = (value: any) => {
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

// 缓存
const reactiveMap = new WeakMap();

const reactive = <T extends object>(target: T): T => {
    // 判断是否是对象 (基础类型不行)
    if(!isObject(target)) {
        throw new Error('reactive can only used for object.')
    }

    // 已代理 - 直接返回
    if(target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }

    // 缓存(判断)
    let existingProxy = reactiveMap.get(target)
    if(existingProxy) return existingProxy

    // 实现代理
    const proxy = new Proxy(target, mutableHandlers)

    // 缓存(存储)
    reactiveMap.set(target, proxy)

    return proxy
}

// 1. 同一个对象代理多次 -> 返回同一个代理
// 2. 代理对象再次被代理 -> 直接返回
export {
    reactive,
    isReactive
}
