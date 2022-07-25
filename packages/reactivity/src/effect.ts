let activeEffect = undefined

class ReactiveEffect {
    public active = true  // effect 默认是激活状态
    constructor(public fn) {
    }

    // 执行 effect
    run() {
        // 如果非激活状态, 则只需要执行函数, 不需要依赖收集
        if(!this.active) this.fn()

        // 依赖收集  核心是将当前的 effect 和 稍后渲染的属性关联起来
        try {
            activeEffect = this
            this.fn()
        }finally {
            activeEffect = undefined
        }
    }
}

const effect = (fn) => {
    // fn 可以根据状态变化重新执行, effect可以嵌套写
    const _effect = new ReactiveEffect(fn)
    _effect.run()  // 默认先执行一次
}

export {
    effect,
    activeEffect
}
