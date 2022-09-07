import { isArray, isString, ShapeFlags } from "@minivue/shared";

export const isVnode = (value: any) => {
    return !!(value?.__v_isVnode)
}

// 虚拟节点有很多: 组件、元素、文本 ...
// children: string | Array | null
export const createVnode = (type, props, children = null) => {
    // 组合方案 shapeFlag 想知道一个元素中包含的是多个子节点还是一个子节点
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0

    // 虚拟dom就是一个对象, diff算法 (真实dom的属性较多)
    const vnode = {
        type,
        props,
        children,
        // 对应的真实节点, 后续diff算法 => 比对后更新
        el: null,
        key: props?.key,
        __v_isVnode: true,
        shapeFlag
    }

    if(children) {
        let type = 0
        if(isArray(children)) {
            type = ShapeFlags.ARRAY_CHILDREN
        }
        else {
            children = String(children)
            type = ShapeFlags.TEXT_CHILDREN
        }
        vnode.shapeFlag |= type
    }

    return vnode
}