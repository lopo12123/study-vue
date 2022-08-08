import {patchClass} from "./modules/class";
import {patchEvent} from "./modules/event";
import {patchStyle} from "./modules/style";
import {patchAttr} from "./modules/attr";

export const patchProp = (el, key, prevValue, nextValue) => {
    // 类名 el.className
    if (key === 'class') {
        patchClass(el, nextValue)
    }
    // 样式 el.style
    else if (key === 'style') {
        patchStyle(el, prevValue, nextValue)
    }
    // event
    else if (/^on[^a-z]/.test(key)) {
        patchEvent(el, key, nextValue)
    }
    // 普通属性
    else {
        patchAttr(el, key, nextValue)
    }
}