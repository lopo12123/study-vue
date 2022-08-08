export const nodeOps = {
    // 增加
    createElement(tagName) {
        return document.createElement(tagName)
    },
    createText(text) {
        return document.createTextNode(text)
    },
    insert(child, parent, anchor = null) {
        parent.insertBefore(child, anchor)
    },
    // 删除
    remove(child) {
        const parentNode = child.parentNode
        if (parentNode) parentNode.removeChild(child)
    },
    // 修改 1. 文本节点; 2. 元素中的内容
    setElementText(el, text: string) {
        el.textContent = text
    },
    setText(node, text) {
        node.nodeValue = text
    },
    // 查询
    querySelector(selector) {
        return document.querySelector(selector)
    },
    parentNode(node) {
        return node.parentNode
    },
    nextSibling(node) {
        return node.nextSibling
    }
}