import { isObject } from "@minivue/shared";

// 缓存
const reactiveMap = new WeakMap();

// 代理标识
const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

const reactive = (target) => {
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
    const proxy = new Proxy(target, {
        get(target: any, key: string | symbol, receiver: any): any {
            // 标识
            if(key === ReactiveFlags.IS_REACTIVE) return true

            // 取值
            return Reflect.get(target, key, receiver)
        },
        set(target: any, key: string | symbol, value: any, receiver: any): boolean {
            return Reflect.set(target, key, value, receiver)
        }
    })

    // 缓存(存储)
    reactiveMap.set(target, proxy)

    return proxy
}

// 1. 同一个对象代理多次 -> 返回同一个代理
// 2. 代理对象再次被代理 -> 直接返回
export {
    reactive
}
