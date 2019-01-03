import request from "utils/request";
import axios from "axios";
//定义接口地址
const URL = {
    "GET_DETAIL":  `${GROBAL_HTTP_CTX}/arrive_order/getAssoVo`,
    "SAVE_ORDER":  `${GROBAL_HTTP_CTX}/arrive_order/saveAssoVo`,
    "GET_LIST":  `${GROBAL_HTTP_CTX}/arrive_order/list`,
    "DEL_ORDER":  `${GROBAL_HTTP_CTX}/arrive_order/deleAssoVo`,


    "GET_TOEXPORTEXCEL":  `${GROBAL_HTTP_CTX}/arrive_order/toExportExcel`,
}

/**
 * 获取列表
 * @param {*} params
 */
export const getList = (params) => {
    let url =URL.GET_LIST+'?1=1';
    for(let attr in params){
        if((attr!='pageIndex')&&(attr!='pageSize')){
            url+='&search_'+attr+'='+params[attr];
        }else{
            url+='&'+attr+'='+params[attr];
        }
    }
    return request(url, {
        method: "get",
        data: params
    });
}

/**
 * 获取下拉列表
 * @param {*} params
 */
export const getSelect = (params) => {
    return request(URL.GET_SELECT, {
        method: "get",
        data: params
    });
}
/**
 * 删除table数据
 * @param {*} params
 */
export const deleteList = (params) => {
    return request(URL.DELETE, {
        method: "post",
        data:params
    });
}

export const saveList = (params) => {
    return request(URL.SAVE, {
        method: "post",
        data:params
    });
}
export const saveArrive_order = (params) => {
    return request(URL.SAVE_ORDER, {
        method: "post",
        data: params
    });
}
export const delArrive_order = (params) => {
    return request(URL.DEL_ORDER, {
        method: "post",
        data: params
    });
}

/**
 * 通过search_id 查询列表详情
*/

export const getDetail = (params) => {
    return request(URL.GET_DETAIL, {
        method: "get",
        param: params
    });
}
/**
 * 导出
 */
export const exportExcel = (params) => {
    exportData(URL.GET_TOEXPORTEXCEL, params.dataList);
}

const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL'];
let exportData = (url,data) => {
    axios({
        method : 'post',
        url : url,
        data : data,
        responseType : 'blob'
    }).then((res) => {
        const content = res.data;
        const blob = new Blob([content]);
        const fileName = "导出数据.xls";

        let elink = document.createElement('a');
        if('download' in elink) {
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = selfURL['createObjectURL'](blob);
            document.body.appendChild(elink);

            // 触发链接
            elink.click();
            selfURL.revokeObjectURL(elink.href);
            document.body.removeChild(elink)
        } else {
            navigator.msSaveBlob(blob, fileName);
        }
    })
}
