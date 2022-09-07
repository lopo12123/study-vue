// h 的用法
// h('div')

// h('div', {style: {color: "red"}})
// h('div', 'hello')

// h('div', null, 'hello', 'world')
// h('div', null, h('span'))
// h('div', null, [h('span')])
import { createVnode, isVnode } from "./vnode";
import { isArray, isObject } from "@minivue/shared";

export const h = function (type, propsChildren, children) {
    const l = arguments.length

    // h('div', {style: {color: "red"}})
    // h('div', h('span'))
    // h('div', [h('span'), h('span')])
    // h('div', 'hello')
    if(l === 2) {
        // 为什么要将children包装成数组 => 因为元素可以循环创建; 文本就不需要包装
        if(isObject(propsChildren) && !isArray(propsChildren)) {  // 是对象不是数组 => 属性/虚拟节点
            if(isVnode(propsChildren)) {
                return createVnode(type, null, [ propsChildren ])  // 虚拟节点就包装成数组
            }
            return createVnode(type, propsChildren)  // 属性
        }
        else {
            return createVnode(type, null, propsChildren)  // 是数组
        }
    }
    else {
        if(l > 3) {
            children = Array.from(arguments).slice(2)
        }
        else if(l === 3 && isVnode(children)) {
            children = [ children ]
        }
        // 其他 => children的情况有两种 文本(innerHtml); 数组(循环创建)
        return createVnode(type, propsChildren, children)
    }
}