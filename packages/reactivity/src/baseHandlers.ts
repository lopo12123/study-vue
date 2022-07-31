import { track, trigger } from "./effect";

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
        return Reflect.get(target, key, receiver)
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
