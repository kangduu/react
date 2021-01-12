import { addData, receiveData, requestData } from "./action";
import { Modal } from "antd"
import http from "@/fetch";

/**
 * @name 项目所有触发action的dispatch
 * @param {String} fetchName 异步请求名称
 * @param {Object} params 
 * @param {String} stateName 
 */

//  查询数据
export const fetchQueryData = ({ fetchName, params, stateName }) =>
    dispatch => {
        // 必须是一个有效的请求名称
        if (!fetchName && "string" !== typeof fetchName) {
            throw new Error("")
        }

        // 请求数据类
        const fetchRequest = http[fetchName]
        if (!(fetchRequest instanceof Function)) {
            throw new Error("")
        }

        if (!stateName) stateName = fetchName
        // 开始请求前的action
        dispatch(requestData(stateName))

        // 触发请求
        return fetchRequest(params)
            .then(response => {
                dispatch(receiveData(response, stateName))
                return response
            })
            .catch(error => {
                // Modal.error({
                //     title: "数据查询失败"
                // })
                return false
            })
    }


// 删除数据
export const fetchDeleteData = ({ fetchName, params, stateName }) =>
    dispatch => {
        if (!fetchName && "string" !== typeof fetchName) {
            throw new Error("")
        }
        // 请求数据类
        const fetchRequest = http[fetchName]
        if (!(fetchRequest instanceof Function)) {
            throw new Error("")
        }

        if (!stateName) stateName = fetchName
        // 开始请求前的action
        dispatch(requestData(stateName))

        // 触发请求
        return fetchRequest(params)
            .then(response => {
                const { success } = response || {}
                if (true === success) {
                    Modal.success({
                        title: "删除成功"
                    })
                } else {
                    Modal.error({
                        title: "删除失败"
                    })
                }
                return response
            })
            .catch(error => {
                Modal.error({
                    title: "删除失败"
                })
                return false
            })
    }

// 添加数据
export const fetchAddData = ({ fetchName, params, stateName }) =>
    dispatch => {
        if (!fetchName && "string" !== typeof fetchName) {
            throw new Error("")
        }
        // 请求数据类
        const fetchRequest = http[fetchName]
        if (!(fetchRequest instanceof Function)) {
            throw new Error("")
        }

        if (!stateName) stateName = fetchName

        // 开始请求前的action
        dispatch(requestData(stateName))

        // 触发请求
        return fetchRequest(params)
            .then(response => {
                const { success } = response || {}
                if (true === success) {
                    dispatch(addData(params, stateName))
                    Modal.success({
                        title: "保存成功"
                    })
                } else {
                    Modal.error({
                        title: "保存失败"
                    })
                }
                return response
            })
            .catch(error => {
                Modal.error({
                    title: "保存失败"
                })
                return false
            })
    }

// 编辑数据
export const fetchEditData = ({ fetchName, params, stateName }) =>
    dispatch => {
        if (!fetchName && "string" !== typeof fetchName) {
            throw new Error("")
        }
        // 请求数据类
        const fetchRequest = http[fetchName]
        if (!(fetchRequest instanceof Function)) {
            throw new Error("")
        }

        if (!stateName) stateName = fetchName

        // 开始请求前的action
        dispatch(requestData(stateName))

        // 触发请求
        return fetchRequest(params)
            .then(response => {
                const { success } = response || {}
                if (true === success) {
                    dispatch(addData(params, stateName))
                    Modal.success({
                        title: "添加成功"
                    })
                } else {
                    Modal.error({
                        title: "添加失败"
                    })
                }
            })
            .catch(error => {
                Modal.error({
                    title: "添加失败"
                })
            })
    }