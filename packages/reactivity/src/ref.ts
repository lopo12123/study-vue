import { isObject } from "@minivue/shared";
import { reactive } from "./reactive";
import { ReactiveEffect, trackEffects, triggerEffects } from "./effect";

const toReactive = (value) => {
    return isObject(value) ? reactive(value) : value
}

class RefImpl {
    public dep: Set<ReactiveEffect> = new Set()
    public _value
    public __v_isRef = true

    constructor(public rawValue) {
        this._value = toReactive(rawValue)
    }

    get value() {
        trackEffects(this.dep)
        return this._value
    }

    set value(newValue) {
        if(newValue !== this.rawValue) {
            this._value = toReactive(newValue)
            this.rawValue = newValue
            triggerEffects(this.dep)
        }
    }
}

const ref = (value) => {
    return new RefImpl(value)
}

export {
    ref
}
