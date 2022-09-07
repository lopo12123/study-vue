import { ShapeFlags } from "@minivue/shared";

export const createRenderer = (renderOptions) => {
    const {
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText,
        setText: hostSetText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        createElement: hostCreateElement,
        createText: hostCreateText,
        patchProp: hostPatchProp,
    } = renderOptions

    const mountChildren = (children, container) => {
        for (let i = 0; i < children.length; i ++) {
            patch(null, children[i], container)
        }
    }

    const mountElement = (vnode, container) => {
        let { type, props, children, shapeFlag } = vnode
        // 将真实元素挂载到虚拟节点上, 后续用于复用节点和更新
        let el = vnode.el = hostCreateElement(type)
        // 绑定属性
        if(props) {
            for (let key in props) {
                hostPatchProp(el, key, null, props[key])
            }
        }
        // 子节点
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {  // 文本
            hostSetElementText(el, children)
        }
        else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {  // 数组
            mountChildren(children, el)
        }
        // 将dom元素挂载到容器上
        hostInsert(el, container)
    }

    // 旧vnode, 新vnode, 容器
    const patch = (n1, n2, container) => {
        // 无变化
        if(n1 === n2) return;

        // 初次渲染
        if(n1 === null) {
            // 目前是元素的初始化渲染, 后续还有组件的初次渲染
            mountElement(n2, container)
        }
        // 更新
        else {
        }
    }

    // vnode 虚拟dom渲染 => 用传入的 renderOptions进行渲染
    const render = (vnode, container) => {
        if(vnode === null) {
            // 卸载逻辑
        }
        else {
            // 既有初始化又有更新逻辑
            patch(container._vnode || null, vnode, container)
        }
        // 缓存 vnode
        container._vnode = vnode
    }

    return { render }
}