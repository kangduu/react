import { combineReducers } from "redux";
import { REQUEST_DATA, RECEIVE_DATA, RELOAD_DATA, ADD_DATA } from "./type";
import { initStaticState, initFetchState } from "./store";

/**
 * 实际返回reducer处理函数
 * @param {Object} state 初始值
 * @param {Object} action 匹配 ./action.js 中定义的action
 */
const handleData = (
    state = {
        isFetching: true,
        data: null,
    },
    action
) => {
    switch (action.type) {
        case REQUEST_DATA:
            return { ...state, isFetching: true };
        case RECEIVE_DATA:
            return { ...state, isFetching: false, data: action.data }
        case RELOAD_DATA:
            return { ...state, isFetching: false, data: action.data }
        case ADD_DATA:
            // 添加默认是需要显示历史的
            return { ...state, isFetching: false, data: [action.data, ...state.data] }
        default:
            return { ...state }
    }
}

/**
 * @param {Object} state 异步数据 
 * @param {Object} action 匹配 ./action.js 中定义的action
 */
const httpData = (
    state = initFetchState,
    action
) => {
    switch (action.type) {
        // case RELOAD_DATA:
        // break;

        //! 注意：RECEIVE_DATA 和 REQUEST_DATA 处理逻辑相同
        case RECEIVE_DATA:
        case REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state, action)
            }
        case ADD_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            }
        default:
            return { ...state }
    }
}

/**
 * @param {Object} state 本地同步数据
 * @param {Object} action 匹配 ./action.js 中定义的action
 */
const staticData = (
    state = initStaticState,
    action
) => {
    switch (action.type) {
        // case REQUEST_DATA:
        //     break;
        // case ADD_DATA:
        //     break;
        // case RECEIVE_DATA:
        //     break;
        case RELOAD_DATA:
            return {
                ...state,
                [action.category]: action.data
            }
        default:
            return { ...state }
    }
}

export default combineReducers({ httpData, staticData })