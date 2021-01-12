import React, { Component } from "react";

// TODO 编写修改 Chrome 和 FireFox 取消跨域限制的操作手册 参考：chrome => https://www.cnblogs.com/guoqiang-QI/p/8022760.html ，FireFox还没查到

// 父窗口
class Parent extends Component {
    constructor() {
        super()
        this.frame = null
        this.childrenWindow = null
    }
    componentDidMount() {
        // 暴露方法到全局，提供给Children使用
        window.onParent = function (value) {
            console.log('onParent runing : ' + value)
        }
        // 接收子窗口发送过来的信息
        window.addEventListener("message", this.parentEventListenHandler, false);
    }
    componentWillUnmount() {
        window.removeEventListener('message', this.parentEventListenHandler)
    }
    // 事件处理函数
    parentEventListenHandler = (event) => {
        const {
            // 从其他 window 中传递过来的对象
            data,
            // 调用 postMessage  时消息发送方窗口的 origin 。
            // 这个字符串由 协议、“://“、域名、“ : 端口号”拼接而成。例如 “https://example.org (隐含端口 443)”、“http://example.net (隐含端口 80)”、“http://example.com:8080”。
            // 请注意，这个origin不能保证是该窗口的当前或未来origin，因为postMessage被调用后可能被导航到不同的位置。
            origin,
            // 可选 source
            // 对发送消息的窗口对象的引用;
            // 您可以使用此来在具有不同origin的两个窗口之间建立双向通信。
            source
        } = event
        if ('http://192.168.1.186:3000' !== origin) return
        // 缓存子窗口引用
        if (!this.childrenWindow) this.childrenWindow = source
        console.log('data:', data);
    }
    // 事件源
    handleSendClick = () => {
        let childrenWindow = null
        // 向子窗口发送消息
        if (this.frame) {
            childrenWindow = this.frame.contentWindow
            this.frame.contentWindow.postMessage('parent', 'http://192.168.1.186:3000/#/')
        }
        // 可以调用子窗口的API
        // 1 缓存 source
        if (this.childrenWindow) this.childrenWindow.onChildren('parent')
        // 2 iframe.contentWindow
        if (childrenWindow) childrenWindow.onChildren('parent callback')
    }
    render() {
        return (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <iframe
                    ref={e => this.frame = e}
                    id="iframe"
                    title="iframe"
                    src="http://192.168.1.186:3000/#/"
                    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                />
                <button
                    onClick={this.handleSendClick}
                    style={{ position: 'absolute', top: '55%', left: '20%' }}
                >Parent Click</button>
            </div>
        )

    }
}

export default Parent