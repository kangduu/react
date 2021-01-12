import { addData, receiveData, reloadData, requestData } from "./action";

/**
 * 本地数据同步操作 
 * @param {*} data 数据
 * @param {String} category 名称
 */
export const loadData = (data, category) => {
    return reloadData(data, category)
}

/**
 * 删除 fetch 异步获取的数据 
 * @param {*} data 需要置空的数据
 * @param {String} category 数据名称
 */
//! 思考：异步数据为何需要置空？ 答：页面Unmounted后(或者Mount时初始化数据)需要清空数据，避免出现副作用
export const delFetchData = (data, category) => {
    return receiveData(data, category)
}