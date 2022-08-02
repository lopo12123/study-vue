import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isFunction, isObject } from "@minivue/shared";

const traversal = (value, set = new Set()) => {
    // 不是对象就不再递归
    if(!isObject(value)) return value

    // 避免循环引用
    if(set.has(value)) return value

    set.add(value)
    for (let key in value) {
        traversal(value[key], set)
    }

    return value
}

const watch = (source, cb: (newValue, oldValue, onCleanup) => void) => {
    let getter;

    if(isReactive(source)) {
        // 对用户传入的数据 进行递归循环(访问对象上的每一个属性 => 依赖收集)
        getter = () => traversal(source)
    }
    else if(isFunction(source)) {
        getter = source
    }
    else {
        return
    }

    let cleanup: Function;
    const onCleanup = (fn) => {
        cleanup = fn
    }

    let oldValue;
    const job = () => {
        // 类似react的useEffect清理副作用
        if(cleanup) cleanup()

        // 再次调用 run, 获取新值
        const newValue = effect.run()
        cb(newValue, oldValue, onCleanup)
        // 更新旧值
        oldValue = newValue
    }

    // 监控构造的job函数, 变化后重新执行
    const effect = new ReactiveEffect(getter, job)

    // 保存旧值
    oldValue = effect.run()
}

export {
    watch
}
