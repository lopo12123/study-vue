export const patchStyle = (el, prevValue, nextValue) => {
    // 新的覆盖
    for (let key in nextValue) {
        el.style[key] = nextValue
    }

    // 旧的清除
    if (prevValue) {
        for (let key in prevValue) {
            if (nextValue[key] == undefined) {
                el.style[key] = null
            }
        }
    }
}