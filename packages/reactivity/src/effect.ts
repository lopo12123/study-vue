let activeEffect: ReactiveEffect = undefined

const cleanupEffect = (effect: ReactiveEffect) => {
    // deps 是 Set<ReactiveEffect>[]
    const { deps } = effect
    for (let i = 0; i < deps.length; i++) {
        // 解除effect, 重新依赖收集
        deps[i].delete(effect)
    }
    // 重置effect
    effect.deps.length = 0
}

class ReactiveEffect {
    // 嵌套的外层effect
    public parent = null
    // 依赖收集 - 双向记忆
    public deps: Set<ReactiveEffect>[] = []
    // effect 默认是激活状态
    public active = true

    constructor(public fn) {
    }

    // 执行 effect
    run() {
        // 如果非激活状态, 则只需要执行函数, 不需要依赖收集
        if(!this.active) {
            return this.fn()
        }

        // 依赖收集  核心是将当前的 effect 和 稍后渲染的属性关联起来
        try {
            // effect嵌套的解决方案: 使用parent字段存储外层的effect
            this.parent = activeEffect
            // 标识当前激活的effect
            activeEffect = this

            // 此处需要在执行用户函数前将之前收集的内容清空
            cleanupEffect(this)

            return this.fn()
        } finally {
            // effect嵌套的解决方案: 退出当前effect时, activeEffect指向外层effect(或者undefined)
            activeEffect = this.parent
            this.parent = null
        }
    }

    stop() {
        this.active = false
    }
}

const effect = (fn) => {
    // fn 可以根据状态变化重新执行, effect可以嵌套写
    const _effect = new ReactiveEffect(fn)
    _effect.run()  // 默认先执行一次
}

// 依赖收集
// WeakMap: { 对象: Map<name: Set<effect>> }
const targetMap = new WeakMap<object, Map<string, Set<ReactiveEffect>>>()
const track = (target, type, key) => {
    // 只有在effect中才进行收集
    if(!activeEffect) return;

    // 以下类似 entry_or_insert
    let depsMap: Map<string, Set<ReactiveEffect>> = targetMap.get(target)
    if(!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if(!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    let shouldTrack = !dep.has(activeEffect)
    if(shouldTrack) {
        dep.add(activeEffect)
        // 让effect也记录对应的dep
        activeEffect.deps.push(dep)
    }
}

const trigger = (target, type, key, value, oldValue) => {
    const depsMap = targetMap.get(target)

    // 触发的值不在模板中使用
    if(!depsMap) return;

    // 获取属性对应的effect(Set集合)
    let effects = depsMap.get(key)

    // 在执行前先拷贝一份, 不要关联引用
    if(effects) {
        effects = new Set(effects)
        effects.forEach(effect => {
            // 当正在执行effect时又要调用自己
            // 则需要屏蔽掉, 否则会无限调用死循环
            if(activeEffect !== effect) effect.run()
        })
    }
}

export {
    effect,
    activeEffect,
    track,
    trigger
}
