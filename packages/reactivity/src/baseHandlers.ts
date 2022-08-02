import { track, trigger } from "./effect";
import { isObject } from "@minivue/shared";
import { reactive } from "./reactive";

// 代理标识
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    get(target: any, key: string | symbol, receiver: any): any {
        // 标识
        if(key === ReactiveFlags.IS_REACTIVE) return true

        // 依赖收集
        track(target, 'get', key)

        // 在代理对象上取值, 此处可以监控到用户取值
        let res = Reflect.get(target, key, receiver)

        // 对象嵌套多层, 需要递归实现深度代理
        if(isObject(res)) {
            return reactive(res)
        }

        return res
    },
    set(target: any, key: string | symbol, value: any, receiver: any): boolean {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)

        // 值变化了
        if(oldValue !== value) {
            // 要更新
            trigger(target, 'set', key, value, oldValue)
        }
        return result
    }
}
