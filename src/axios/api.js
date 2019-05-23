import {fetch,request,postImage} from './index.js'

const type = 'prod'; // prod ，test ，dev

//判断用户是否登录接口
export function userSession(params) {
    return fetch('/userSession',params).then(res => {
        return res
    })
}


//短信绑定微信接口
export function smsSend(params) {
    return fetch('/smsSend',params).then(res => {
        return res
    })
}

//短信绑定微信接口
export function wechatOauth2(params) {
    return fetch('/oauth.do',params).then(res => {
        return res
    })
}

//获取面料种类信息
export function fabricKeywords(params) {
    return fetch('/show.do?cmd=fabricKeywords',params).then(res => {
        return res
    })
}

//微信公众号绑定手机
export function userMgr(params) {
    return request({
        url     : '/auth.do?cmd=userMgr',
        method  : 'post',
        data    : params
    }).then(res => {
        return res
    })
}

//修改供应商信息
export function selfMdfProvider(params) {
    return request({
        url     : '/show.do?cmd=selfMdfProvider',
        method  : 'post',
        data    : params
    })
}

//推送新需求给新的用户
export function newUserPush(params) {
    return request({
        url     : '/auth.do?cmd=sendInqs2New',
        method  : 'post',
        data    : params
    }).then(res => {
        return res
    })
}

//加载供应商详情
export function getUserDetail(params) {
    return fetch('/auth.do?cmd=getUserDetail',params).then(res => {
        return res
    })
}

/**
 * 图片上传统一接口
 * @param {Object} file 需要上传的对象参数
 * @param {String} name 需要上传的name名，不传默认image
 * @return {Object} 返回上传结果组成的对象
 */
export function uploadImage(file,name = 'image') {

    let formData = new FormData()

    formData.append(name,file)

    return request({
        method  : 'POST',
        url     : '/upload?type=99',
        data    : formData,
        headers : {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        return res
    })
}

//更改头像url链接
export function getHeadPortraitChange(params) {
    return request({
        method  : 'post',
        url     : '/auth.do?cmd=userMgr',
        data    : params,
    }).then(res => {
        return res
    })
}





// 获取需求单列表
export function queryInquiryList(params) {
    let url = type==='dev'? '/show.do?cmd=queryInquiryList' : '/auth.do?cmd=queryInquiryList';
    return fetch(url,params).then(res => {
    // return fetch('/show.do?cmd=queryInquiryList',params).then(res => {
        return res
    })
}

// 需求单详情
// export function queryInquiryDetail(params) {
export function inquirySendDetail(params) {
    // let url = type==='dev'? '/show.do?cmd=queryInquiryDetail' : '/auth.do?cmd=queryInquiryDetail';
    let url = type==='dev'? '/show.do?cmd=inquirySendDetail' : '/auth.do?cmd=inquirySendDetail';
    return fetch(url,params).then(res => {
        return res
    })
}

// 修改供应商信息
export function MdfProviderInfo(params) {
    return request({
        url: '/auth.do?cmd=selfMdfProvider',
        method: 'post',
        params
    }).then(res => {
        return res
    })
}

//供应商统计数据
export function getUserStatistics(params) {
    // let url = type==='dev'? '/show.do?cmd=userStatisticsItems' : '/auth.do?cmd=userStatisticsItems';
    let url = '/auth.do?cmd=userStatisticsItems';
    return fetch(url, params).then(res => {
        return res
    })
}

// 上周订单统计
export function queryLastWeekOrders(params) {
    let url = type==='dev'? '/show.do?cmd=queryLastWeekOrders' : '/auth.do?cmd=queryLastWeekOrders';
    return fetch(url,params).then(res => {
        return res
    })
}

// 新增需求回单
export function insertInquiryReceipt(params) {
    let url = type==='dev'? '/show.do?cmd=insertInquiryReceipt' : '/auth.do?cmd=insertInquiryReceipt';
    return request({
        url: url,
        method: 'post',
        params
    }).then(res => {
        return res
    })
}

// 更新需求回单
export function updateInquiryReceiptInfo(params) {
    let url = type==='dev'? '/show.do?cmd=updateInquiryReceiptInfo' : '/auth.do?cmd=updateInquiryReceiptInfo';
    return request({
        url: url,
        method: 'post',
        params
    }).then(res => {
        return res
    })
}
// 获取需求回单列表
export function getInquiryReceiptList(params) {
    let url = type==='dev'? '/show.do?cmd=getInquiryReceiptList' : '/auth.do?cmd=getInquiryReceiptList';
    return fetch(url,params).then(res => {
        return res
    })
}

// 需求回单详情
export function queryInquiryReceipt(params) {
    let url = type==='dev'? '/show.do?cmd=queryInquiryReceipt' : '/auth.do?cmd=queryInquiryReceipt';
    return fetch(url,params).then(res => {
        return res
    })
}

// 获取所有关键字信息
export function getAllKeywords() {
    return fetch('/show.do?cmd=fabricKeywords&groupId=0').then(res => {
        return res
    })
}

// 上传图片到专用服务器
export function uploadImgs(data) {
    return postImage({
        url: '/upload?type=99',
        method: 'post',
        data
    }).then(res => {
        return res
    })
}

//查询新闻列表
export function queryNewsList(params) {
    return fetch('/show.do?cmd=queryNewsList&appName=15&bizType=2',params).then(res => {
        return res
    })
}


