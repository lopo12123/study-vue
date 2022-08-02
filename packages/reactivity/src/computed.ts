import { isFunction } from "@minivue/shared";
import { activeEffect, ReactiveEffect, track, trackEffects, triggerEffects } from "./effect";

class ComputedRefImpl {
    // 内部维护的effect
    public effect: ReactiveEffect
    // 默认应该取值的时候进行计算
    public _dirty = true
    public __v_isReadonly = true
    public __v_isRef = true
    public _value
    public dep: Set<ReactiveEffect>

    constructor(public getter, public setter) {
        // 将用户的getter放入effect, 则getter的依赖会被此effect收集
        this.effect = new ReactiveEffect(getter, () => {
            // 依赖的属性变化会执行此调度函数
            if(!this._dirty) {
                this._dirty = true

                // 触发更新
                triggerEffects(this.dep)
            }
        })
    }

    get value() {
        // computed的依赖收集
        trackEffects(this.dep || (this.dep = new Set()))

        // 如果是脏则重新计算
        if(this._dirty) {
            // 计算后恢复干净
            this._dirty = false
            this._value = this.effect.run()
        }
        return this._value
    }

    set value(newValue) {
        this.setter(newValue)
    }
}

const computed = (getterOrOptions) => {
    let onlyGetter = isFunction(getterOrOptions)
    let getter;
    let setter;

    if(onlyGetter) {
        getter = getterOrOptions
        setter = () => {
            console.warn('no setter!')
        }
    }
    else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }

    return new ComputedRefImpl(getter, setter)
}

export {
    computed
}
