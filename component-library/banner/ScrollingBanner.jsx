import React, { PureComponent } from 'react'
import { debounce } from "lodash";
import "./banner.less";

// 添加 className 的纯函数
// 主要原因是：getDerivedStateFromProps 方法无权访问组件实例
const handleAddClassName = (data, className) => {
    if (Array.isArray(data)) {
        return data.map((item => Object.assign({}, item, { _className: className })))
    } return []
}

/**
 * @name 获取translateX值
 * @param {String} value transform 数值
 * @returns {Number}
 */
const handleGetTranslateX = (value) => {
    if (typeof value !== "string") return 0
    const splitComma = value.split(",", 1)
    if (
        Array.isArray(splitComma) &&
        typeof splitComma[0] === "string"
    ) {
        const splitVlaue = splitComma[0].split("(")
        if (
            Array.isArray(splitVlaue) &&
            typeof splitVlaue[1] === "string"
        ) {
            const translateX = splitVlaue[1].replace("px", "")
            if (isNaN(Number(translateX))) return 0
            return Math.abs(translateX * 10)
        }
    }
    else return 0
}

// 横向无限滚动组件 (广告横幅)
class ScrollingBanner extends PureComponent {
    static defaultProps = {
        dataSource: [],
    }
    constructor(props) {
        super(props)
        this.state = {
            isScroll: false,
            mainData: null,
            nextData: null,
        }
        // refs node
        this.scrollContainer = null
        this.scrollBanner = null
        // 实际数据渲染节点总宽度
        this.renderWidth = 0
        // requestAnimationFrame实例
        this.animationFrame = null
        // 动画函数
        this.animationField = null
    }
    // getDerivedStateFromProps 会在调用 render 方法之前调用，并且在 初始挂载及后续更新时 都会被调用。
    // 应返回一个对象来更新 state，如果返回 null 则不更新任何内容。
    // 此方法无权访问组件实例
    // 派生 state
    static getDerivedStateFromProps(props) {
        const { dataSource } = props
        let mainData = []
        if (handleAddClassName instanceof Function) {
            mainData = handleAddClassName(dataSource, "main-item")
        }
        return { mainData }
    }

    // 清除动画实列
    clearAnimationInstance() {
        // 浏览器兼容性处理 (打补丁)
        const cancelAnimationFrame = window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame;
        // 清除动画实例
        if (this.animationFrame !== null) {
            if (cancelAnimationFrame instanceof Function) {
                cancelAnimationFrame(this.animationFrame)
            }
            this.animationFrame = null
        }
    }
    // 开始动画
    beginAnimation() {
        // 浏览器兼容性处理 (打补丁)
        const requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;
        const cancelAnimationFrame = window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame;
        if (
            cancelAnimationFrame instanceof Function &&
            requestAnimationFrame instanceof Function
        ) {
            if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame)
            this.animationFrame = requestAnimationFrame(this.animationField)
        }
    }
    /**
     * @name 定制动画
     * @param {undefined | Number} startTimestamp 开始时间戳，默认undefined，当鼠标移出时应传入最新值
     */
    customizedAnimation(startTimestamp) {
        // 记录开始时间
        let startTime = startTimestamp;
        this.animationField = (timestamp/* requestAnimationFrame接口内部定时器返回的时间戳 */) => {
            if (startTime === undefined) startTime = timestamp
            // 已过去时间
            const elapsed = timestamp - startTime,
                // 完成一次动画所需时间，
                totalTime = this.renderWidth * 10,
                // 左移值，既translateX值，时间戳除以10，得到的是像素
                moveLeft = 0.1 * elapsed,
                // 使用Math.min控制元素可以刚刚好停止在this.renderWidth位置，既完整的一次整体左移
                translateX = Math.min(moveLeft, this.renderWidth);
            if (this.scrollBanner) {
                // 设置平移,translate3d 开启 CSS CPU 加速
                this.scrollBanner.style.transform = `translate3d(-${translateX}px,0,0)`
            }
            // 时间边界点判断
            if (elapsed < totalTime) {
                this.beginAnimation()
            }
            // 左移清零,并重置动画
            else {
                if (this.scrollBanner) {
                    this.scrollBanner.style.transform = 'translate3d(0,0,0)'
                }
                startTime = undefined
                this.beginAnimation()
            }
        }
        this.beginAnimation()
    }

    // 鼠标移入 暂停
    handleMouseEnter = debounce(() => {
        if (
            this.scrollBanner == null ||
            this.state.isScroll === false
        ) return
        this.clearAnimationInstance()
    }, 100)
    // 鼠标移出 恢复
    handleMouseLeave = debounce(() => {
        if (
            this.scrollBanner == null ||
            this.state.isScroll === false
        ) return
        // 获取当前时间戳
        const timestamp = window.performance.now(),
            transform = this.scrollBanner.style.transform,
            // 滚动元素左移值
            translateX = handleGetTranslateX(transform),
            // 新的时间戳开始值
            newStartTimestamp = timestamp - translateX;
        this.customizedAnimation(newStartTimestamp)
        //! 重点理解 
        // 已知 elapsed = timestamp - startTime (过去时间 = 最新时间 - 开始时间)
        // 等价于 newStartTimestamp = timestamp - translateX (新的开始时间 = 新的时间戳 - 移动值 * 10)
        // translateX要保持不变,timestamp增加,startTime则需要增加
    }, 100)

    render() {
        const { mainData, nextData, isScroll } = this.state
        let dataLength = 0;
        if (Array.isArray(mainData)) dataLength = mainData.length
        return (
            <div
                className="scroll-banner__container"
                ref={node => this.scrollContainer = node}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                {
                    dataLength > 0 ?
                        <div
                            className="scroll-banner"
                            ref={node => this.scrollBanner = node}
                        >
                            {/* 正常显示列表 */}
                            {
                                mainData.map(
                                    (item, index) => {
                                        const { id, name, value, _className } = item
                                        return (
                                            <div
                                                key={`main-${id}`}
                                                className={`banner-item ${_className} ${_className}-${index + 1}`}
                                            >
                                                <span>{name}</span>&nbsp;
                                                <span>{value}</span>
                                            </div>
                                        )
                                    }
                                )
                            }
                            {/* 候补元素 */}
                            {
                                (
                                    isScroll === true &&
                                    Array.isArray(nextData) &&
                                    nextData.length > 0
                                ) ?
                                    nextData.map(
                                        (item, index) => {
                                            const { id, name, value, _className } = item
                                            return (
                                                <div
                                                    key={`next-${id}`}
                                                    className={`banner-item ${_className} ${_className}-${index + 1}`}
                                                >
                                                    <span>{name}</span>&nbsp;
                                                    <span>{value}</span>
                                                </div>
                                            )
                                        }
                                    )
                                    : null
                            }
                        </div>
                        : null
                }
            </div>
        )
    }

    // 判断是否需要动画
    isNeedAnimation = () => {
        const { dataSource } = this.props
        const mainItemList = document.getElementsByClassName("main-item")
        const containerWidth = this.scrollContainer.offsetWidth
        let itemWidthSum = 0,
            isScroll = false,
            nextData = [],
            fillData = [];
        if (mainItemList) {
            const nodeArray = Array.from(mainItemList) || []
            nodeArray.forEach((item, index) => {
                // 添加需要替补的元素数据
                if (itemWidthSum < containerWidth) fillData.push(dataSource[index])
                const itemWidth = item.offsetWidth
                itemWidthSum += itemWidth
            })
        }
        if (itemWidthSum > containerWidth) {
            // 渲染宽度
            this.renderWidth = itemWidthSum
            // 设置转换
            if (this.scrollBanner) {
                this.scrollBanner.style.justifyContent = "space-between"
            }
            // 需要滚动
            isScroll = true
            // 替补（只添加会显示的部分）
            if (handleAddClassName instanceof Function) {
                nextData = handleAddClassName(fillData, "next-item")
            }
        } else {
            if (this.scrollBanner !== null) {
                this.scrollBanner.style.justifyContent = "center"
            }
        }
        this.setState({
            isScroll,
            nextData
        })
    }

    // componentDidMount() 会在组件挂载后（插入 DOM 树中）立即调用。
    // 1.依赖于 DOM 节点的初始化操作
    // 2.通过网络请求获取数据
    // 3.直接调用 setState()，这将触发额外渲染，但此渲染会发生在浏览器更新屏幕之前。
    componentDidMount() {
        this.isNeedAnimation()
    }
    // componentDidUpdate() 会在更新后会被立即调用。首次渲染不会执行此方法。
    // 当组件更新后，可以在此处对 DOM 进行操作。如果你对更新前后的 props 进行了比较，也可以选择在此处进行网络请求。
    // 可以在 componentDidUpdate() 中直接调用 setState()，但请注意它必须被包裹在一个条件语句里，否则会导致死循环。
    // 这里的 snapshot 是 getSnapshotBeforeUpdate 的返回值。
    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dataSource } = prevProps
        const dataChanged = dataSource !== this.props.dataSource
        if (this.state.isScroll === true) {
            // 若props数据源改变了
            if (dataChanged === true) {
                // 重置变换属性值
                if (this.scrollBanner) {
                    this.scrollBanner.style.transform = `inherit`
                }
                return this.isNeedAnimation()
            }
            // 数据未发生改变
            return this.customizedAnimation()
        }
        if (this.animationFrame !== null) {
            this.clearAnimationInstance()
        }
    }

    // componentWillUnmount() 会在组件卸载及销毁之前直接调用。
    // 在此方法中执行必要的清理操作，例如：清除 timer，取消网络请求或清除在 componentDidMount() 中创建的订阅等。
    componentWillUnmount() {
        this.clearAnimationInstance()
    }
}
export default ScrollingBanner
