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
        <v-tab v-model="active" :options="options" class="margin-distance" style="position: fixed;top: 50px;z-index: 99"></v-tab>
        <div class="main-body" style="margin-top: 106px">
            <!--<v-tab v-model="active" :options="options" class="margin-distance" style=""></v-tab>-->

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
                    <!--不显示说明，改显示状态-->
                    <!--<div slot="price" style="" class="scroll-y card-font-size">-->
                        <!--&lt;!&ndash;<span class="card-font-size">说明：{{item.desc}}</span>&ndash;&gt;-->
                        <!--说明：{{item.desc}}-->
                    <!--</div>-->
                    <div slot="price" style="background: #07c160;font-size: 0.32rem">
                        <van-tag  type="primary" class="left" v-show="item.responseCount===0">{{'此单无人投样'}}</van-tag>
                        <!--已查看待查看//只有待接单才有的提示-->
                        <van-tag :type="item.waitType" class="right" v-show="item.noCheck!==2 && active==='0'">{{waitCheck[item.noCheck]}}</van-tag>
                    </div>
                    <div slot="title" style="">
                        <span>面料种类：{{item.clothType}}</span>
                    </div>
                    <div slot="desc" class="card-desc">
                        <!--不显示有效期，改显示收货地址-->
                        <!--<span class="mark-color left" v-show="!item.colorCode">有效期至：{{item.expireTime}}</span>-->
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
        </div>
    </div>
</template>

<script>
    import Tab from '../components/Tabs';
    import {queryInquiryList, userSession} from '../axios/api';
    import {formatDate, getClothType,ORDER_STATUS, ORDER_RESPONSED,REMINDER,LABEL_STATUS} from '../assets/js/common'
    import {getPicUrl} from "../assets/js/getPicUrl";
    // const ORDERCODE_ACCEPT = {'0':'n','1':'y','2':'y','3':'y'};
    var TABID_PARAM = {  // 需求单列表的param参数
        '0': {
            'sendProviderId':0, // 待接单
            'responsed':0
        },
        '1': {
            'sendProviderId':0, // 待定 ,已接单=已回样
            'responsed':1,
            'status': -7
        },
        '2': {
            'sendProviderId':0, // 已选中
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
                    // text: '已接单'
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
                waitCheck: {0:'待查看',1: '已查看'},
                page: 0,
                pageSize: 100, // 一页50条
                // providerId: 0, // 使用vuex的计算属性
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
                    this.setOrderList(val);
                }

            }
        },
        computed:{
          providerId(){
              return this.$store.state.userInfo.userId;
          }
        },
        created(){
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
            this.setOrderList(this.active);
          // this.showTabOrder(this.active)
          //   tab标签的数量
          //   this.setTabNum()
        },
        methods: {
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
                switch (active) {
                    case '0':
                        status = ORDER_RESPONSED['0'];
                        break;
                    case  '1':
                        status = ORDER_RESPONSED['1'];
                        break;
                    case '2': // 已选中含有三种状态 6已回样，7跑腿中，8已发货
                        if(obj.status===6 && obj.confirmedCount>0){
                            status = '意向单';
                        }else{
                            status = ORDER_STATUS[String(obj.status)];
                        }
                        break;
                    case '3':
                        status = ORDER_STATUS[String(obj.status)];
                        break;
                    case '4':
                        status = ORDER_STATUS[String(obj.status)];
                        break;
                }
                return status
            },
            setTabNum(){ //tab页上的数量
                let tabNum = [99,99,99,98,110];
                if(tabNum.length !== this.options.length){
                    return false;
                }
                tabNum.forEach((num,index) =>{
                    if(num >= 100){
                        this.options[index].text = this.options[index].text + ' 99+'
                    }else{
                        this.options[index].text = this.options[index].text + ' ' + String(num)
                    }
                });
            },
            formatOrderList(resList){ //统一需求单的格式
                this.showOrderList = []; //清空之前的数据
                let tmpOrder = {
                    'inquiryId': 0,
                    'imageURL': require('../assets/img/smile.png'),
                    'createTime': '2019.3.22 16:40',
                    'expireTime': '2019.3.22 16:40',
                    'orderStatus': '',
                    'clothType': '梭织-牛仔布',
                    'desc': '请描述要找的主要特征、品名、成分、工艺、用途、规格等请描..',
                    'colorCode': 'ASD12365478',
                    'samplePrice': 0,
                    'reminder': '',
                    'expressComp':'',
                    'trackingNum': '',
                    'statusCode':'1',
                    'labelStatus':'',
                    'area': '',
                    'detailStatus':99, //进入详情用的状态，路由传递：99-n,6-y已回样，61-y意向单，7-y跑腿中，8-y已发货
                    'responseCount':0, //需求单是否已经有人回样
                    'noCheck': 0,  //待接单，是否查看:0未查看，1已查看，2非待接单tab
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
                        reminder = this.setReminder(obj.receiptList[0].status);
                        receiptId = obj.receiptList[0].receiptId;
                        labelStatus = LABEL_STATUS[obj.receiptList[0].status]
                    }
                    tmpOrder.imageURL = getPicUrl(obj.imageList[0],2); // 缩略图
                    tmpOrder.createTime = formatDate(obj.createTime);
                    tmpOrder.expireTime = formatDate(obj.expireTime);
                    tmpOrder.inquiryId = obj.inquiryId;
                    tmpOrder.area = obj.area;
                    let isAccept = receiptId>0 ? 'y' : 'n'; // 依据是否有回单id来判断待接单/已种单
                    if(isAccept==='n'){
                        if(localStorage.getItem(isAccept + obj.inquiryId)){
                            tmpOrder.noCheck = localStorage.getItem(isAccept + obj.inquiryId); //已查看 永久存贮
                            tmpOrder.waitType = 'primary';
                        }else{
                            tmpOrder.noCheck = 0;
                            tmpOrder.waitType = 'danger'
                        }
                        tmpOrder.detailStatus = 99
                    }else{//非待接单tab
                        tmpOrder.noCheck = 2;
                        tmpOrder.detailStatus = obj.status; //6,7,8...
                        if(obj.status===6 && obj.confirmedCount>0){ // 意向单
                            tmpOrder.detailStatus = 61
                        }
                    }
                    tmpOrder.orderStatus = this.chooseStatus(this.active,obj);
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
                    this.showOrderList.push(tmpOrder);
                    tmpOrder = {}
                })
            },
            // queryInquiryList(statusCode){
            setOrderList(active){
                if(this.providerId  &&  (this.providerId <= 0)){ // 检查providerId是否合法
                    this.$notify('providerId: ' + String(this.providerId) + '不正确!');
                    return false;
                }
                let idParam = TABID_PARAM[active];
                idParam.sendProviderId = this.providerId;
                let queryParam = {
                    'param': idParam,
                    'page': this.page,
                    'pageSize': this.pageSize
                };
                queryInquiryList(queryParam).then(res => {
                    if(res.totalSize >= 0){
                        // 将返回值整理为统一形式
                        this.formatOrderList(res.list);
                    }
                    if(res.exId){
                        this.$notify(res.exDesc)
                    }
                });
            },
            goOrderDetail(val){
                // item加入一个状态码，以判断是否进入已接单的详情
                let statusCode = val.statusCode;
                sessionStorage.setItem('activeCode', statusCode);
                // let isAccept = ORDERCODE_ACCEPT[statusCode];
                let isAccept = val.receiptId>0 ? 'y' : 'n'; // 依据是否有回单id来判断待接单/已种单
                let inquiryId = val.inquiryId;
                let receiptId = val.receiptId;
                let detailStatus = val.detailStatus;
                // let isAccept = 'n';
                //缓存待接单的inquiryId+状态，以确定是否查看
                if(isAccept === 'n'){ //是否查看，永久存储在本地
                    localStorage.setItem(isAccept + inquiryId,1);
                }
                this.$router.push({name:'orderDetail',query:{'inquiryId':inquiryId, 'receiptId':receiptId, 'isAccept': isAccept,'detailStatus':detailStatus}})
            }
        }
    }
</script>

<style scoped>
@import '../assets/css/mycss.css';
    .van-card__price {
        display: contents;
    }
    .card-top{
        display: flex;
        justify-content:space-between;
        font-size: 0.32rem;
        padding: 0.13333rem 0.4rem;
    }
</style>
