/**
 * @Project: gys
 * @FileName: common
 * @Author: wayne
 * @Date: 2019/4/18
 */

var IS_CUSTOMIZATION = {0: '不接受定制', 1: '接受定制'};
var REQUIREMENTS_TYPE = {1: '色卡', 2: '剪版'};
// var ORDER_STATUS = {
//     '-1': '正在找',
//     '-2': '已结束',
//     '-3': '采购商符合要求的订单',
//     '-4': '跑腿订单',
//     '-5': '供应商不合适的订单',
//     '1': '未发布',
//     '2': '已发布',
//     '3': '已过期',
//     '4': '已结束',
//     '5': '无效订单',
//     '6': '已回样',
//     '7': '已委托调版',
//     '8': '已发货',
//     '9': '已取消'
// };
var ORDER_STATUS = {
    '1':'未发布',
    '2':'已发布',
    '3':'已过期',
    '4':'已结束',
    '5':'无效订单',
    '6':'已回样',
    '7':'跑腿中',
    '8':'已发货',
    '9':'已取消',
    '61':'意向单',
};

var PROVIDER_STATUS = { //公众号-供应商在订单列表页和订单详情显示的状态
    'responsed0':'待接单',
    'responsed1': '已回样',
    'receiptStatus1':'意向单',
    'receiptStatus2':'不合适', //未选中
    'receiptStatus3':'已中单',
    'inquiryStatus1': '未发布',
    'inquiryStatus2': '已发布',
    'inquiryStatus3': '已过期',
    'inquiryStatus4': '已结束',
    'inquiryStatus5': '无效订单',
    'inquiryStatus6': '已回样',
    'inquiryStatus7': '跑腿中',
    'inquiryStatus8': '已发货',
    'inquiryStatus9': '已取消',
};

var UNIT = {
    0: '米', //新增加的字段，以前没有的默认是0
    1: '米',
    2: '公斤',
    3: '码',
};

var ORDER_RESPONSED = {'0': '待接单','1':'已回样'};
var REMINDER = {  // 根据回单详情的status
    1:'客户认为符合要求，请尽快与客户联系',
    3:'客户已确认需要该样并委托平台跑腿取样'};
var LABEL_STATUS = { //根据回单详情的status
    1:'有意向',
    3:'委托跑腿',
};
var SPOT_STATUS = {0: '有现货', 1: '无现货'};
var FEEDBACK_SPOTSTATUS = {'0': '现货', '1': '定制'};
var CLOTH_STYLE = {1: '针织', 2: '梭织'};
var SENDING_STATUS = {0: '待确认调版', 1: '已确认调版'};

// 生产环境 http://desk.ebudaowei.cn/ebuapi/show.do?
// var BASEURL = 'http://desk.ebudaowei.cn'
// var API = '/ebuapi'

// ts. 测试环境
// var BASEURL = 'http://ts.ebdaowei.com' // 测试环境//
// var API = '/ebuapi' // 测试环境

// 本地开发环境
var BASEURL = ''
var API = '/tsebuapi' // 开发环境api

function formatDate (timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;// 月份是从0开始的
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    if (hour < 10) {
        hour = '0' + String(hour)
    }
    if (min < 10) {
        min = '0' + String(min)
    }
    // let sec = date.getSeconds()
    let newTime = year + '/' + month + '/' + day + ' ' + hour + ':' + min;
    return newTime
}

// talkingData统计平台埋点
function setSpot (sendMsg, logMsg) {
    try {
        window.TDAPP.onEvent(sendMsg);
        return true
    } catch (err) {
        console.log(logMsg + '=>err', err);
        return false
    }
}

// 存储当前历史记录点,实现控制手机物理返回键的按钮事件
var pushHistory = function () {
    let state = {
        title: '',
        url: ''
    };
    window.history.pushState(state, state.title, state.url)
};

function getClothType (keyWords) { // 设置面料种类,一级，二级
    if (keyWords.length > 0) {
        let first = CLOTH_STYLE[keyWords[0].groupId];
        let second = keyWords[0].keyword;
        return first + '-' + second
    }
}

export {IS_CUSTOMIZATION, REQUIREMENTS_TYPE, formatDate, ORDER_STATUS, SPOT_STATUS, FEEDBACK_SPOTSTATUS,LABEL_STATUS,
    CLOTH_STYLE, SENDING_STATUS, pushHistory, setSpot, ORDER_RESPONSED, REMINDER,getClothType,BASEURL,API, UNIT,PROVIDER_STATUS}
