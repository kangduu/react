## React实际开发问题

### 项目中加载字典数据在react初始加载页面时获取字典为空

1. 问题描述

   项目中需要后端返回字典数据 DICTIONARY，我在`App.jsx`组件的 `componentWillMount`生命周期中使用redux触发`action`进行请求并将结果保存在store和sessionStorage中；

   在其他组件中使用`import`模块语法导入我在`util/dictionary.js`文件中封装的解析字典的方法，并使用其中的方法在组件中解析需要的字典数据；

   store解析由于是从`mapStateToProps`中解析添加到组件props上，所以没有bug；

   但是**我们使用import导入的方法在react加载时便调用了此方法解析sessionStorage数据，这使得解析sessionStorage中的数据意外的得到了null** 

2. 问题分析

   - import的`静态解析`和`导入即执行`机制导致了react加载时便解析执行了对应的方法（不确定）
   - 请求字典数据是一个`异步`操作，未返回时已经执行了我封装的解析字典的方法，此时字典数据为空

3. 解决办法

   - 字典数据统一存储在`store`中，使用`mapStateToProps`解析挂载到组件的props属性上使用。
   - 使用[React.lazy()和Suspense](https://zh-hans.reactjs.org/docs/code-splitting.html#reactlazy)实现组件的异步加载，参考[代码分割](https://zh-hans.reactjs.org/docs/code-splitting.html)

4. 问题总结

   - React为什么会在打开页面时就会解析所有的`import `?  
   
     答：React默认加载并解析所有组件。

### 子组件中需要保存用户操作或内部状态时，父组件不可以使用setState更新数据。（非可控组件颗粒化）

1. 问题描述

   `Parent`父组件有多个子组件（A、B、C...），`A组件`有一个选择树，当用户选择某一状态时通知`Parent`请求数据并更新，`B组件`和`C组件`都由`Parent`传递props数据渲染；
   
   在`Parent`数据请求的回调函数中，我**使用`setState`更新需要传递给B和C的state值，但是这将导致`A组件`也会更新，从而丢失了用户当前选择的高亮状态的树节点。**
   
   注意：这里的组件都是class组件，即继承自React.Component

2. 问题分析

    `setState()` 将对组件 state 的更改排入队列，并通知 React 需要使用更新后的 state **重新渲染<u>此组件</u>及其<u>子组件</u>。**

    除非 `shouldComponentUpdate()` 返回 `false`，否则 `setState()` 将始终执行重新渲染操作。如果可变对象被使用，且无法在 `shouldComponentUpdate()` 中实现条件渲染，那么仅在新旧状态不一时调用 `setState()`可以避免不必要的重新渲染 

3. 解决办法

   将子组件的数据属性从`Parent`组件抽离存入`store`中，通过`props传递`并更新，剔除父子组件之间的数据耦合性

4. 问题总结

   思考state和props对class组件的更新影响，同时减少或不使用[setState](https://react.docschina.org/docs/react-component.html#setstate)更新state。

   