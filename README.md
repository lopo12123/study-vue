### study-vue

study of vue3`s source code

### `vue` 中为了解耦, 将逻辑分成了两个模块

- 运行时核心, 不依赖于平台(browser, node, app, ...). 依靠虚拟dom
- 针对不同平台的运行时, `vue` 就是针对浏览器平台的
- 渲染器