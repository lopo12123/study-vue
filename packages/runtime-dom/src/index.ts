import {nodeOps} from "./nodeOps";
import {patchProp} from "./patchProp";
import {createRenderer} from "@minivue/runtime-core";

const renderOptions = Object.assign(nodeOps, {patchProp})

export const render = (vnode, container) => {
    createRenderer(renderOptions)
        .render(vnode, container)
}

export * from "@minivue/runtime-core";