<template>
    <div>
        <router-link to="/introduce">
            <img src="../assets/img/index.jpg" alt="" class="index-img">
        </router-link>
        <van-panel class="panel-padding main-bkcolor" style="padding-top: 0" >
            <div slot="header">
                <!--<div class="show-bgcolor block-margin" style="display: flex;">-->
                    <!--<div><img src="../assets/img/156.jpg"  alt="" class="wechat-header"></div>-->
                    <!--<div style="width: 60%;display: flex">-->
                        <!--<div class="info-com">{{company}}</div>-->
                        <!--<div class="info-middle info-hide">{{providerShop}}</div>-->
                    <!--</div>-->
                    <!--<div class="info-middle"><van-button slot='right-icon' size="small" type="primary" @click="updateProviderInfo">修改信息</van-button></div>-->
                <!--</div>-->
                <van-cell-group class="show-bgcolor block-margin">
                    <van-cell  style="display: flex;font-size: 0.293rem;padding: 6px 0 0 0;width: 99.3%;">
                        <span slot="icon" style="padding:0px 5px"><img :src="headPortrait"  alt="" class="wechat-header"></span>
                        <div style="display: flex;" slot="title">
                            <div style="font-weight: bolder">{{company}}</div>
                            <div class="info-hide">{{providerShop}}</div>
                        </div>
                        <span slot="label" style="">{{providerId}}</span>
                        <span slot="right-icon" style="float: right"><van-button size="small" type="primary" @click="updateProviderInfo">修改信息</van-button></span>
                    </van-cell>
                </van-cell-group>
                <!--通知-->
                <van-notice-bar
                        background="#ffffff"
                        :text="newsTitle"
                        left-icon="volume-o"
                />
                <div  class="top-card block-margin">
                    <span class="card" @click="toOrderList('0')">
                        <!--气泡-->
                        <!--<span class="card-content">-->
                        <span :class="publishedUnReadCount>0? 'bubble-card-content': 'card-content'">
                            <div class="red-bubble" style="display: flow-root;" v-show="publishedUnReadCount && (publishedUnReadCount>0)">
                                 <span >
                                     {{publishedUnReadCount}}
                                 </span>
                             </div>
                            <h1>{{unResponseInquiryCount}}</h1>
                            <h3>待接单</h3>
                            <h4 class="h4-font font-color">客户订单需要及时响应</h4>
                        </span>
                    </span>
                    <span class="card" @click="toOrderList('2')" >
                            <!--气泡-->
                        <!--<span class="card-content">-->
                        <span :class="okUnReadCount>0 ? 'bubble-card-content': 'card-content'">
                               <div class="red-bubble" style="display: flow-root;" v-show="okUnReadCount && (okUnReadCount>0)">
                                 <span>
                                     {{okUnReadCount}}
                                 </span>
                             </div>
                            <h1 style="margin-top: 0">{{okInquiryCount}}</h1>
                            <h3>符合要求</h3>
                            <h4 class="h4-font font-color" style="width: 95%;text-align: left;margin: 0 auto">有客户觉得你的回样合适，请及时联系客户</h4>
                        </span>
                    </span>
                </div>
                <!--以下表格不显示-->
                <div class="block-margin show-bgcolor" v-show="!isShow">
                    <van-row class="table-text">
                        <van-col span="8">
                            <div class="border-b border-r table-header-span"><h3>已接单</h3></div>
                            <div @click="toOrderList('1')" class="border-r table-content-span"><h2>{{responseInquiryCount}}</h2></div>
                        </van-col>
                        <van-col span="8">
                            <div class="border-b border-r table-header-span"><h3>不适合订单</h3></div>
                            <div @click="toOrderList('3')" class="border-r table-content-span"><h2>{{notOkInquiryCount}}</h2></div>
                        </van-col>
                        <van-col span="8">
                            <div class="border-b table-header-span"><h3>所有订单</h3></div>
                            <div @click="toOrderList('4')" class="table-content-span"><h2>{{allInquiryCount}}</h2></div>
                        </van-col>
                    </van-row>
                </div>

                <!--<h2 style="padding-left: 1%" v-show="isShow">成就：</h2>-->
                <div class="block-margin" v-show="isShow">
                    <div class="top-card">
                    <span class="card">
                        <span class="card-content">
                            <h1>{{acceptCount}}</h1>
                            <h3>上周接单量</h3>
                            <div><span><img src="../assets/img/smile.png" alt="" class="card-img"></span>
                                <span class="come-on font-color">您已打败<span style="color: red">{{percent}}%</span>广州中大同类竞争对手</span>
                            </div>
                        </span>
                    </span>
                        <span class="card">
                            <span class="card-content">
                                <h1>{{okCount}}</h1>
                                <h3>上周中单量</h3>
                                <div><span><img src="../assets/img/come_on.png" alt="" class="card-img"></span>
                                    <span class="come-on font-color">要加油哦！主动与客户联系能增加订单成功率</span>
                                </div>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </van-panel>
    </div>
</template>

<script>
    import {getUserStatistics,queryLastWeekOrders, queryNewsList} from '../axios/api'
    import {CLOTH_STYLE} from '../assets/js/common'
    export default {
        name: "index",
        data(){
            return{
                // company: 'XXXXX纺织',
                newsTitle:'暂无',
                percent: 0,
                isShow: true,
                allInquiryCount:0,       //所有订单==全部
                notOkInquiryCount:0,     //不适合订单==未选中
                okInquiryCount:0,        //符合要求==已选中
                responseInquiryCount:0,  //已接单==已回样
                unResponseInquiryCount:0,//待接单
                publishedUnReadCount: 0, //待接单未读
                okUnReadCount: 0,        //符合要求 未读
                acceptCount:0,
                okCount:0,
                providerShop:''
            }
        },
        computed:{
            company(){
                return this.$store.state.userInfo.name;
            },
            providerId(){
                return this.$store.state.userInfo.userId;
            },
            busiKeywords(){ //关键字
                return this.$store.state.userInfo.busiKeywords;
            },
            headPortrait(){ // 设置默认头像
                let head = this.$store.state.userInfo.headPortrait ? this.$store.state.userInfo.headPortrait : require('../assets/img/defaultHead.png');
                return head;
            }
        },
        created(){
            this.providerShop = this.setProviderShop();
            this.setStatisticsData();
            this.getLastesNews();
        },
        methods:{
            getLastesNews(){
                let params = {
                    'newsType': 2,
                    'status': 1,
                    'queryType': 'ALL',
                    'page': 0,
                    'pageSize': 2,
                };
                queryNewsList(params).then(res => {
                    console.log('getLastesNews=>res',res);
                    if(res.exId){
                        this.$notify(res.exDesc);
                        return false;
                    }
                    if(res.list.length > 0){
                        this.newsTitle = res.list[0].newsTitle;
                    }else{
                        this.newsTitle = '暂无';
                    }

                }).catch(err => {
                    console.log('queryNewsList=>err',err);
                })
            },
            setProviderShop(){
                let zzTmp = '';
                let szTmp = '';
                let result = '';
                if(this.busiKeywords.length > 0){
                    this.busiKeywords.forEach(obj => {
                        if(obj.groupId === 1){
                            zzTmp += obj.keyword + ' '
                        }
                        if(obj.groupId === 2){
                            szTmp += obj.keyword + ' '
                        }
                    });
                    zzTmp = zzTmp ? CLOTH_STYLE[1] + ':' + zzTmp : '';
                    szTmp = szTmp ? CLOTH_STYLE[2] + ':' + szTmp : '';
                    result = '(' + zzTmp + ' ' + szTmp + ')'
                }else{
                    result =  '()'
                }
                return result
            },
            updateProviderInfo(){
                this.$router.push({path:'/businessCard'})
            },
            setStatisticsData(){
                if(this.providerId > 0){
                    // 供应商数据统计
                    let param = {'userId':this.providerId,'appName':15};
                    getUserStatistics(param).then(res => {
                        if(res.exId){
                            this.$notify(res.exDesc);
                            return false
                        }
                        this.unResponseInquiryCount = res.unResponseInquiryCount;
                        this.responseInquiryCount = res.responseInquiryCount;
                        this.okInquiryCount = res.okInquiryCount;
                        this.notOkInquiryCount = res.notOkInquiryCount;
                        this.allInquiryCount = res.allInquiryCount;
                        this.publishedUnReadCount = res.publishedUnReadCount;
                        this.okUnReadCount = res.okUnReadCount;
                    })
                    // // 成就统计
                    queryLastWeekOrders({'userId':this.providerId}).then(res => {
                        if(res.exId){
                            this.$notify(res.exDesc);
                            return false;
                        }
                        this.acceptCount = res.countOrders;
                        if(res.hasOwnProperty('rate')){
                            this.percent = res.rate;
                        }
                        });
                    queryLastWeekOrders({'userId':this.providerId,'status':3}).then(res => {
                        if(res.exId){
                            this.$notify(res.exDesc);
                            return false;
                        }
                        this.okCount = res.countOrders;
                    })
                }else{
                    this.$notify('providerId: ' + String(this.providerId) + '不正确!');
                    return false;
                }
            },
            toOrderList(code){
                this.$router.push({name:'orderList',query:{statusCode:code}})
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/css/mycss.css";
    div.van-cell__title{
        width: 60%;
    }
    .red-bubble{
        display: flow-root;
        span{
            background: #fa352e;
            border-radius: 20px;
            width: 20px;
            height: 20px;
            float: right;
            color: white;
        }
    }
    .info-middle{
      line-height: 1.3rem;
    }
    .info-hide{
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        font-size:0.3rem;
        color: #969799;
        width: 60%;
    }
    .info-com{
        padding: 0.26667rem 0 0.26667rem 0.4rem;
        line-height: 0.64rem;
        font-size: 0.37333rem;
    }
    .index-img{
        width: 100%;
        height: 18%
    }
    .van-cell__value{
        text-align: left;
    }
    .border-r{
        border-right: 1px #dddddd solid;
    }
    .border-b{
        border-bottom: 1px #dddddd solid;
    }
    h1{
        margin:3px;
        font-size: 30px;
    }
    h2{
        margin: 0px;
    }
    h3,h4{
        margin: 0px;
        font-weight: normal;
    }
    .h4-font{
        font-weight: normal;
        text-align: center;
    }
    .block-margin{
        margin: 15px 0;
    }
    .provider-major{
        display: flex;
        span{
            text-overflow:ellipsis;
            white-space:nowrap;
            overflow:hidden;
            font-size:0.3rem;
        }
    }
    .table-header-span{
        padding: 5px 0;
    }
    .table-content-span{
        padding: 10px 0;
    }
    .table-text{
        justify-content: space-between;
        text-align: center;
    }
    .card {
        width: 49.4%;
        min-height: 120px;
        margin-top: 0;
        text-align: center;
        background: #ffffff;
        display: table;
    }
    .come-on{
        padding: 0 10px;
        text-align: left
    }
    .card-content{
        padding-top: 15px;
        display:table-cell;
        div{
            padding: 0 5px;
            display: flex
        }
    }
    .bubble-card-content{
        padding-top: 0;
        display:table-cell;
        div{
            padding: 0 5px;
            display: flex
        }
    }
    .top-card{
        display:flex;
        justify-content: space-between;
    }
    .card-img{
        width: 30px;
        height: 30px
    }
    .card-title{
        font-size: 20px;
        font-weight: bold;
    }
    .achievement{
        justify-content: space-around;
        display: flex;
        min-height: 120px;
    }
    .font-color{
        color: #b5b5b5;
        font-size: 11px;
    }
</style>
