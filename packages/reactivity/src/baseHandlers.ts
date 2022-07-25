// 代理标识
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers = {
    get(target: any, key: string | symbol, receiver: any): any {
        // 标识
        if(key === ReactiveFlags.IS_REACTIVE) return true

        // 取值
        return Reflect.get(target, key, receiver)
    },
    set(target: any, key: string | symbol, value: any, receiver: any): boolean {
        return Reflect.set(target, key, value, receiver)
    }
}
