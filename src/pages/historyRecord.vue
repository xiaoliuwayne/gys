<template>
    <div>
        <van-nav-bar
                title="产品库"
                left-arrow
                @click-left="back"
                class="header header-top"
        />
        <div class="main-body">
            <van-cell value="产品库是您回复客户后的产品记录，方便您下次回复相同产品的快捷回复。"  class="margin-distance"/>
            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
            >
                <div v-for="(item,jj) in historyReplyList" :key="jj" class="margin-distance show-bgcolor ">
                    <van-card
                            class="show-bgcolor"
                            style="margin-top: 0"
                            :thumb="item.imageURL"
                    >
                        <div slot="title" style="">
                            <span class="left">色卡编号：{{item.colorCode}}</span>
                            <span class="right">{{item.createTime}}</span>
                        </div>
                        <div slot="desc" class="card-desc">
                            <van-row type="flex" justify="space-between">
                                <van-col span="15">
                                    <div style="padding-top: 8px">剪版价：{{item.samplePrice}}元/{{unit[item.cuttingUnit]}}</div>
                                    <div style="padding-top: 10px">大货价：{{item.largePrice}}元/{{unit[item.largeUnit]}}</div>
                                </van-col>
                                <van-col span="10" style="padding-top: 8px">
                                    <van-button type="primary" size="mini" class="right" @click="choose(item)">选择</van-button>
                                </van-col>
                            </van-row>
                        </div>
                    </van-card>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script>
    import {getInquiryReceiptList} from '../axios/api';
    import {formatDate,UNIT} from '../assets/js/common'
    // import eventBus from '../assets/js/bus';
    export default {
        name: "historyRecord",
        data(){
            return{
                unit:UNIT,
                curInquiryId: 0,
                curReceiptId:0,
                page: 0,
                pageSize: 5,
                loading: false,
                finished: false,
                status: 0, //回单列表中的需求单状态
                historyReplyList: []
            }
        },
        created(){
            this.curInquiryId = this.$route.query.inquiryId;
            this.curReceiptId = this.$route.query.receiptId;
        },
        computed:{
            providerId(){
                return this.$store.state.userInfo.userId;
            }
        },
        methods:{
            onLoad() {
                // 异步更新数据
                setTimeout(() => {
                    this.init();
                }, 500);
            },
            init(){ //获取用户的回单列表
                let param = {
                    // 'status':this.status.
                    'userId':this.providerId,
                    'page':this.page,
                    'pageSize':this.pageSize
                };
                getInquiryReceiptList(param).then(res => {
                    console.log('getInquiryReceiptList=>res',res);
                    console.log('current page',this.page);
                    if(res.exId){
                       this.$notify(res.exDesc);
                       return false;
                    }
                    if(res.totalSize > 0){
                        res.list.forEach(obj => {
                            let historyItem = {};
                            historyItem.imageURL = obj.imgUrlListValue[0];
                            historyItem.colorCode = obj.colorCard;
                            historyItem.createTime = formatDate(obj.updateTime);
                            historyItem.samplePrice = obj.samplePrice;
                            historyItem.largePrice = obj.unitPrice;
                            historyItem.largeUnit = obj.largeUnit;
                            historyItem.cuttingUnit = obj.cuttingUnit;
                            historyItem.receiptId = obj.receiptId;
                            this.historyReplyList.push(historyItem);
                        } );
                    }
                    this.page = this.page + 1;
                    // 加载状态结束
                    this.loading = false;
                    // 数据全部加载完成
                    if (this.historyReplyList.length >= res.totalSize) {
                    // if (this.historyReplyList.length >= 2) {
                        this.finished = true;
                    }
                }).catch(err => {
                    console.log('getInquiryReceiptList=>err：', err);
                    this.$notify(err + '可能网络异常，请稍后再试！')
                })
            },
            back(){
                this.$router.go(-1);
            },
            choose(item){
                // eventBus.$emit('fromHistory',item);
                // this.back()
                console.log('historyRecord=>item',item);
                this.$router.push({name:'acceptOrder',query:{
                        'itemReceiptId':item.receiptId,
                        'inquiryId':this.curInquiryId,
                        'receiptId':this.curReceiptId}})
            }
        }
    }
</script>

<style scoped>
@import '../assets/css/mycss.css';
</style>
