import { isArray, isObject } from "@minivue/shared";
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

class ObjectRefImpl {
    constructor(public object, public key) {
    }

    get value() {
        return this.object[this.key]
    }

    set value(newValue) {
        this.object[this.key] = newValue
    }
}

const toRef = (object, key) => {
    return new ObjectRefImpl(object, key)
}

const toRefs = (object) => {
    const result = isArray(object) ? new Array(object.length) : {}

    for (let key in object) {
        result[key] = toRef(object, key)
    }

    return result
}

const proxyRefs = (object) => {
    return new Proxy(object, {
        get(target: any, p: string | symbol, receiver: any): any {
            const r = Reflect.get(target, p, receiver)
            return r.__v_isRef ? r.value : r
        },
        set(target: any, p: string | symbol, value: any, receiver: any): boolean {
            const oldValue = target[p]
            if(oldValue.__v_isRef) {
                oldValue.value = value
                return true
            }
            else {
                return Reflect.set(target, p, receiver)
            }
        }
    })
}
export {
    ref,
    toRef,
    toRefs,
    proxyRefs,
}
