<template>
    <div>
        <van-nav-bar
                title="找布买布"
                class="header header-top"
                @click-left="goHome"
        >
            <div slot="left" class="header">
                首页
            </div>
        </van-nav-bar>
        <v-tab v-model="active" :options="options" class="fix-tab" style=""></v-tab>
        <div class="main-body" style="margin-top: 113.25px">
            <!--<v-tab v-model="active" :options="options" class="margin-distance" style=""></v-tab>-->
            <!--上拉加载更多-->
            <van-list
                    v-model="tabLoadMore[active].loading"
                    :finished="tabLoadMore[active].finished"
                    finished-text="没有更多了"
                    :error.sync="tabLoadMore[active].error"
                    error-text="请求失败，点击重新加载"
                    @load="onLoad"
            >
                <div v-for="(item,jj) in showOrderList" :key="jj" class="margin-distance show-bgcolor">
                    <div style="" class="card-top">
                        <span style="">单号：{{item.inquiryId}}</span>
                        <span style="">{{item.createTime}}</span>
                        <span style="">{{item.orderStatus}}</span>
                    </div>
                    <div class="line" style="margin: 0 auto;"></div>
                    <van-card
                            class="show-bgcolor"
                            style="margin-top: 0"
                            :thumb="item.imageURL"
                            @click="goOrderDetail(item)"
                    >
                        <div slot="price" style="background: #07c160;font-size: 0.32rem">
                            <van-tag  type="primary" class="left" v-show="item.responseCount===0">{{'此单无人投样'}}</van-tag>
                            <!--已查看待查看-->
                            <van-tag :type="item.waitType" class="right" v-show="active==='0' || active==='2'">{{waitCheck[item.unRead]}}</van-tag>
                        </div>
                        <div slot="title" style="">
                            <span>面料种类：{{item.clothType}}</span>
                        </div>
                        <div slot="desc" class="card-desc">
                            <span class="left">收货地址：{{item.area}}</span>
                        </div>
                        <div slot="footer" v-show="item.colorCode">
                            <div class="spa-around">
                                <div class="line"></div>
                                <span class="left">回样信息：色卡编号： {{item.colorCode}}</span>
                                <span> 剪版价：{{item.samplePrice}}元/米</span>
                            </div>
                            <div class="line" style="padding: 0"></div>
                            <div style="display: flex;" v-show="item.remind || item.trackingNum">
                                <van-tag type="success" v-show="item.remind" style="margin-right: 5px">{{item.labelStatus}}</van-tag>
                                <span v-show="item.remind">{{item.reminder}}</span>
                                <span v-show="item.trackingNum">物流单号：{{item.expressComp}} | {{item.trackingNum}}</span>
                            </div>
                        </div>
                    </van-card>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script>
    import Tab from '../components/Tabs';
    import {queryInquiryList, userSession,getUserStatistics} from '../axios/api';
    import {formatDate, getClothType,ORDER_STATUS, ORDER_RESPONSED,REMINDER,LABEL_STATUS,PROVIDER_STATUS} from '../assets/js/common'
    import {getPicUrl} from "../assets/js/getPicUrl";
    // const ORDERCODE_ACCEPT = {'0':'n','1':'y','2':'y','3':'y'};
    var TABID_PARAM = {  // 需求单列表的param参数
        '0': {
            'sendProviderId':0, // 待接单
            'responsed':0,
            'status': -6
        },
        '1': {
            'sendProviderId':0, // 待定 ,已回样
            'responsed':1,
            'status': -7
        },
        '2': {
            'sendProviderId':0, // 已选中
            'responsed':1,
            'status':-3
        },
        '3': {
            'sendProviderId':0, // 未选中
            'status':-5
        },
        '4': {
            'sendProviderId':0, // 全部
        },
    }; // 根据不同的tab 选择不同的param参数
    export default {
        components:{'v-tab': Tab},
        name: "orderList",
        data(){
            return{
                active:'0',
                tabLoadMore:{'0': {'loading':false,'finished':false,'error':false},
                    '1':{'loading':false,'finished':false,'error':false},'2':{'loading':false,'finished':false,'error':false},
                    '3':{'loading':false,'finished':false,'error':false},'4':{'loading':false,'finished':false,'error':false}},
                tabPage:{'0': 0,'1':0,'2':0,'3':0,'4':0},
                tabLength:{'0': 0,'1':0,'2':0,'3':0,'4':0}, //每一tab的总长度，通过请求获得并标在tab上
                options: [
                //     {
                //     value: '5',
                //     text: '首页' // 实现可以图标化
                // },
                    {
                    value: '0',
                    text: '待接单'
                }, {
                    value: '1',
                    text: '已回样'

                }, {
                    value: '2',
                    // text: '符合要求'
                    text: '已选中' // 包含意向单，跑腿中，已发货
                }, {
                    value: '3',
                    // text: '不合适'
                    text: '未选中'
                }, {
                    value: '4',
                    text: '全部'
                },
                ],
                waitCheck: {1:'待查看',0: '已查看'},
                pageSize: 20, // 一页20条
                inquiryId: 0,
                showOrderList: [],
            }
        },
        watch:{
            active(val){
                console.log('watch=>active=>val', val);
                if(val==='5'){
                    this.$router.push('/index')
                }else {
                    // 切换tab时，将各tabpage归零
                    for(let i in this.tabPage){
                        this.tabPage[i] = 0;
                    }
                    //重新设置tabLoadMore的状态，使之再次切换tab时，仍能自动加载
                    for(let i in this.tabLoadMore){
                        this.tabLoadMore[i].loading = false;
                        this.tabLoadMore[i].finished = false;
                        this.tabLoadMore[i].error = false;
                    }
                    //切换tab时，showOrderList清空
                    this.showOrderList = [];
                }
            },
        },
        computed:{
          providerId(){
              return this.$store.state.userInfo.userId;
          }
        },
        created(){
            this.setTabNum();
          if (sessionStorage.getItem('activeCode')){ // 保持orderList的状态
              this.active = sessionStorage.getItem('activeCode');
              sessionStorage.removeItem('activeCode')
          } else{
              this.active = this.$route.query.statusCode;
          }
          // 如果是从acceptOrder提交后跳过来的
            if(this.$route.query.from){
                this.active = '1'
            }
        },
        mounted(){
        },
        methods: {
            onLoad() {// 上拉加载更多，异步更新数据
                setTimeout(() => {
                    //请求数据
                    if(this.providerId  &&  (this.providerId <= 0)){ // 检查providerId是否合法
                        this.$notify('providerId: ' + String(this.providerId) + '不正确!');
                        return false;
                    }
                    let _ = require('lodash');
                    let idParam = TABID_PARAM[this.active];
                    idParam.sendProviderId = this.providerId;
                    let queryParam = {
                        'param': idParam,
                        'page': this.tabPage[this.active],
                        'pageSize': this.pageSize
                    };
                    queryInquiryList(queryParam).then(res => {
                        if(res.totalSize >= 0){
                            // 将返回值整理为统一形式
                            let tmpResult = this.formatOrderList(res.list);
                            //深拷贝数组的合并操作
                            let tmp = _.cloneDeep(this.showOrderList);
                            this.showOrderList = tmp.concat(tmpResult);
                            //可以不深拷贝直接this.showOrderList = this.showOrderList.concat(tmpResult)
                            this.tabPage[this.active] = this.tabPage[this.active] + 1;//刷新+1
                            // 加载状态结束
                            this.tabLoadMore[this.active].loading = false;
                            // 数据全部加载完成
                            if (this.showOrderList.length>=this.tabLength[this.active]) {
                                this.tabLoadMore[this.active].finished = true;
                            }
                        }
                        if(res.exId){
                            this.$notify(res.exDesc)
                        }
                    }).catch(() => {
                        this.tabLoadMore[this.active].error = true;
                        this.tabLoadMore[this.active].loading = false;
                    });
                }, 500);
            },
            goHome(){
                this.$router.push({name: 'index'})
            },
            setReminder(status){
                let reminder = '';
                reminder = REMINDER[status];
                return reminder
            },
            chooseStatus(active,obj){ // 根据this.active选择使用 obj.status 还是 obj.responsed 来标注状态
                let status = '';
                let tmpKey = '';
                let statusObj = {};
                switch (active) {
                    case '0':
                        // status = ORDER_RESPONSED['0'];
                        status = PROVIDER_STATUS['responsed0'];
                        statusObj.orderStatusKey = 'responsed0';
                        statusObj.orderStatus = status;
                        break;
                    case  '1':
                        // status = ORDER_RESPONSED['1'];
                        status = PROVIDER_STATUS['responsed1'];
                        statusObj.orderStatusKey = 'responsed1';
                        statusObj.orderStatus = status;
                        break;
                    case '2': // 已选中含有三种状态 6已回样，7跑腿中，8已发货
                        // 已选中tab  obj一定是有回单信息的
                        tmpKey = obj.status===8 ? 'inquiryStatus8' : 'receiptStatus' + String(obj.receiptList[0].status);
                        status = PROVIDER_STATUS[tmpKey];
                        statusObj.orderStatusKey = tmpKey;
                        statusObj.orderStatus = status;
                        break;
                    case '3':
                        // 未选中tab  obj一定是有回单信息的==不合适
                        // status = ORDER_STATUS[String(obj.status)];
                        status = PROVIDER_STATUS['receiptStatus'+String(obj.receiptList[0].status)]; //receiptStatus2
                        statusObj.orderStatusKey = 'receiptStatus'+String(obj.receiptList[0].status);
                        statusObj.orderStatus = status;
                        break;
                    case '4':
                        status = PROVIDER_STATUS['inquiryStatus'+String(obj.status)];  //使用原始的订单的状态
                        statusObj.orderStatusKey = 'inquiryStatus'+String(obj.status);
                        statusObj.orderStatus = status;
                        break;
                }
                return statusObj
            },
            setTabNum(){ //tab页上的数量
                let params = {
                    'userId':this.providerId,
                    'appName':15
                };
                getUserStatistics(params).then(res => {
                    if(res.exId){
                        this.$notify(res.exDesc);
                        return false
                    }
                    this.tabLength['0'] = res.unResponseInquiryCount; //待接单
                    this.tabLength['1'] = res.responseInquiryCount;   //已接单==已回样
                    this.tabLength['2'] = res.okInquiryCount;         //符合要求==已选中
                    this.tabLength['3'] = res.notOkInquiryCount;      //不适合订单==未选中
                    this.tabLength['4'] = res.allInquiryCount;        //所有订单==全部

                    this.options.forEach(obj => {
                       if(this.tabLength[obj.value]>100){
                           obj.text = obj.text + ' 99+';
                       }else {
                           obj.text = obj.text + ' ' + String(this.tabLength[obj.value]);
                       }
                    });
                }).catch(err => {
                    console.log('setTabNum=>err',err);
                    this.$notify('可能系统维护中，请稍后再试!')
                });
            },
            formatOrderList(resList){ //统一需求单的格式
                // this.showOrderList = []; //清空之前的数据
                let tmpList = [];
                let tmpOrder = {
                    'inquiryId': 0,
                    'imageURL': require('../assets/img/smile.png'),
                    'createTime': '2019.3.22 16:40',
                    'expireTime': '2019.3.22 16:40',
                    'orderStatus': '', //显示在页面上的状态文字
                    'clothType': '梭织-牛仔布',
                    'desc': '请描述要找的主要特征、品名、成分、工艺、用途、规格等请描..',
                    'colorCode': 'ASD12365478',
                    'samplePrice': 0,
                    'reminder': '',
                    'expressComp':'',
                    'trackingNum': '',
                    'statusCode':'1', //联系tab active 用的
                    'labelStatus':'',
                    'area': '',
                    'orderStatusKey': '',
                    'detailStatus':99, //进入详情用的状态，路由传递：99-n,6-y已回样，61-y意向单，7-y跑腿中，8-y已发货
                    'responseCount':0, //需求单是否已经有人回样
                    'unRead': 1,  //待接单，是否查看:1未查看，0已查看  // 只有待接单和已选中展示这个状态
                    'waitType': null, //待接单tab页 待查看红色，已查看蓝色
                    'otherReceipt': null, //待接单tab页，是否显示有人已经接单
                    'receiptId': 0 //  回单id
                };
                resList.forEach(obj => {
                    let colorCode = '';
                    let price = 0;
                    let receiptId = 0;
                    let reminder = '';
                    let labelStatus = '';
                    if(obj.receiptList && obj.receiptList.length > 0){ // 回单了才有
                        colorCode = obj.receiptList[0].colorCardCode;
                        price = obj.receiptList[0].samplePrice;
                        reminder = this.setReminder(obj.receiptList[0].status);  // 回单的状态 1=意向单，2=不合适，3=已中单（跑腿中）
                        receiptId = obj.receiptList[0].receiptId;
                        labelStatus = LABEL_STATUS[obj.receiptList[0].status]
                    }
                    tmpOrder.imageURL = getPicUrl(obj.imageList[0],2); // 缩略图
                    tmpOrder.createTime = formatDate(obj.createTime);
                    tmpOrder.expireTime = formatDate(obj.expireTime);
                    tmpOrder.inquiryId = obj.inquiryId;
                    tmpOrder.area = obj.area;
                    tmpOrder.unRead = obj.unRead;
                    tmpOrder.waitType = tmpOrder.unRead===1 ? 'danger' : 'primary'; //查看否的颜色
                    let statusObj = this.chooseStatus(this.active,obj);
                    tmpOrder.orderStatus = statusObj.orderStatus;
                    tmpOrder.orderStatusKey = statusObj.orderStatusKey;
                    tmpOrder.clothType = getClothType(obj.keywords);
                    tmpOrder.desc = obj.desc;
                    tmpOrder.colorCode = colorCode;
                    tmpOrder.samplePrice = price;
                    tmpOrder.responseCount = obj.responseCount;
                    tmpOrder.reminder = reminder;
                    tmpOrder.expressComp = obj.deliCom;
                    tmpOrder.trackingNum = obj.trackingNum;
                    tmpOrder.statusCode = this.active;
                    tmpOrder.receiptId = receiptId;
                    tmpOrder.labelStatus = labelStatus;
                    tmpList.push(tmpOrder);
                    tmpOrder = {}

                });
                return tmpList;
            },
            goOrderDetail(val){
                // item加入一个状态码，以判断是否进入已接单的详情
                let statusCode = val.statusCode;
                sessionStorage.setItem('activeCode', statusCode);
                // let isAccept = ORDERCODE_ACCEPT[statusCode];
                let isAccept = val.receiptId>0 ? 'y' : 'n'; // 依据是否有回单id来判断待接单/已种单
                let inquiryId = val.inquiryId;
                let receiptId = val.receiptId;
                let orderStatusKey = val.orderStatusKey;
                this.$router.push({name:'orderDetail',query:{'inquiryId':inquiryId, 'receiptId':receiptId, 'isAccept': isAccept,'orderStatusKey':orderStatusKey}})
            }
        }
    }
</script>

<style scoped>
@import '../assets/css/mycss.css';
    .van-card__price {
        display: contents;
    }
    .fix-tab{
        position: fixed;
        top: 50px;
        /*top: 55px;*/
        z-index: 99
    }
    .card-top{
        display: flex;
        justify-content:space-between;
        font-size: 0.32rem;
        padding: 0.13333rem 0.4rem;
    }
</style>
