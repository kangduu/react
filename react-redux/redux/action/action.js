import { REQUEST_DATA, RECEIVE_DATA, RELOAD_DATA, ADD_DATA } from "../type"

/**
 * @name 项目中所有需要使用的Action
 * @param {String} category store中数据名称
 * @param {Object} data 数据
 * @param {String} type 触发的Action类型
 * @returns action
 */

// 开始请求数据前 触发 request action ；并改变isFetching值为true
export const requestData = category => ({
    type: REQUEST_DATA,
    category,
})

// 数据响应后 触发 receive action ；并改变isFetching值为false
export const receiveData = (data, category) => ({
    type: RECEIVE_DATA,
    data,
    category,
})

// 新增数据
export const addData = (data, category) => ({
    type: ADD_DATA,
    data,
    category,
})

// 重新加载数据
export const reloadData = (data, category) => ({
    type: RELOAD_DATA,
    data,
    category,
})