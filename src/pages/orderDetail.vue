<template>
    <div>
        <van-nav-bar
                title="需求单"
                class="header header-top"
                left-arrow
                @click-left="back"
        />
        <!--采购商信息 -->
        <van-row type="flex" class="main-body buyer buyer-info">
            <van-col span="4" style="min-height: 60px;"><img :src="headPortrait"  alt="" class="wechat-header2"></van-col>
            <van-col span="20" style="padding-left: 5px;">
                <div class="buyer-shop">{{customerInfo.companyName}}</div>
                <div style="margin-top: 8px">
                    <van-button slot="button" size="mini" type="primary" @click="showContact" v-show="showButton">显示联系方式</van-button>
                </div>
                <div v-show="showCont">
                    <div>
                        <span>姓名：{{customerInfo.name}}</span><span class="right">电话：{{customerInfo.phone}}</span>
                    </div>
                    <div style="overflow-x: auto">地址：{{customerInfo.address}}</div>
                </div>
            </van-col>
        </van-row>

        <div style="padding-top: 15px">
            <van-panel>
                <div class="img-uploader">
                    <div class="img-uploader-item" v-for="(url,kk) in smallImgUrl" :key="kk">
                        <img v-lazy="url" alt="图片" class="imgPreview" @click="clickImg(kk)">
                    </div>
                </div>
                <!--<div slot="footer" style="text-align: center;color: #1989fa" v-show="showAll">-->
                    <!--<span @click="showAllInfo">{{showAllText}}</span>-->
                <!--</div>-->
            </van-panel>

            <!--已经填写回单-->
            <div v-if="isAccept==='y'">
                <van-panel class="panel-padding" v-show="noHiding">
                    <van-cell slot="header" :border="false" class="pannel-header">
                        需求说明：
                    </van-cell>
                    <van-field
                            v-model="orderDetailData.clothType"
                            type="text"
                            label="面料种类："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="orderDetailData.sampleType"
                            type="text"
                            label="类型："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="orderDetailData.expireTime"
                            type="text"
                            label="有效期至："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="orderDetailData.acceptCustomize"
                            type="text"
                            label="可否定制："
                            placeholder=""
                            :readonly="true"
                    />
                    <!--<p style="font-weight: bolder;padding-left: 1%">面料说明：</p>-->
                    <van-panel :border="false">
                        <van-cell slot="header" :border="false">
                            面料说明：
                        </van-cell>
                        <div class="cloth-desc">
                            <textarea rows="4" cols="25" v-model="orderDetailData.desc" readonly="readonly" ></textarea>
                        </div>
                    </van-panel>
                </van-panel>
                <van-cell>
                    <div style="text-align: center;color: #1989fa;font-size: 12px" v-show="showAll">
                      <span @click="showAllInfo">{{showAllText}}</span>
                    </div>
                </van-cell>
                <!--回单信息-->
                <van-panel class="panel-padding margin-block">
                    <div slot="header">
                        <!--<span style="font-weight: bolder;font-size: 35px">回单信息：</span>-->
                        <van-cell class="font-boder">回单信息：</van-cell>
                    </div>
                    <van-card
                            class="show-bgcolor"
                            :thumb="feedbackInfo.imageURL"
                    >
                        <div slot="title">
                            <span class="left">色卡编号：{{feedbackInfo.colorCode}}</span>
                            <span class="right">{{feedbackInfo.createTime}}</span>
                        </div>
                        <div slot="desc" class="card-desc">
                            <van-row type="flex" justify="space-between">
                                <van-col span="15">大货价：{{feedbackInfo.unitPrice}}元/{{unit[feedbackInfo.largeUnit]}}</van-col>
                                <!--<van-col span="6" style="text-align: right">{{order_status[String(detailStatus)]}}</van-col>-->
                                <van-col span="6" style="text-align: right">{{provider_status[detailStatus]}}</van-col>
                                <!--是否现货-->
                                <!--<van-col span="6" style="text-align: right">{{feedbackInfo.sampleStatus}}</van-col>-->
                            </van-row>
                            <van-row type="flex" justify="space-between" style="margin: 8px 0 1px 0;vertical-align: middle">
                                <van-col span="15">剪版价：{{feedbackInfo.samplePrice}}元/{{unit[feedbackInfo.cuttingUnit]}}</van-col>
                                <van-col span="6">
                                    <van-button size="mini" type="primary" class="right" @click="goFeedBackDetail" v-if="toSee.indexOf(detailStatus)>=0">查看</van-button>
                                    <van-button size="mini" type="primary" class="right" @click="updateRecepit" v-else>修改</van-button>
                                </van-col>
                            </van-row>
                            <van-row type="flex" justify="space-between">
                                <van-col span="15">库存：{{feedbackInfo.stock}}{{unit[feedbackInfo.largeUnit]}}</van-col>
                                <van-col span="6"></van-col>
                            </van-row>
                        </div>
                        <!--采购信息-->
                        <div slot="footer" v-if="toSee.indexOf(detailStatus)>=0 && feedbackInfo.detail.hasOwnProperty('payInfo') &&  feedbackInfo.detail.payInfo.hasOwnProperty('items')">
                        <!--<div slot="footer">-->
                            <div class="line"></div>
                            <div style="font-size: 0.32rem">
                                <div style="text-align: left;font-weight: bolder">采购信息：</div>
                                <div style="text-align: left">
                                    <span style="margin-right: 20px">剪版：{{feedbackInfo.detail.payInfo.items[0].buyNumber}}
                                        {{unit[feedbackInfo.detail.payInfo.items[0].unit]}}</span>
                                    <span>色号备注：{{feedbackInfo.detail.payInfo.items[0].buyColorCode}}</span>
                                </div>
                            </div>
                        </div>
                    </van-card>
                </van-panel>
                <!--有回单的 其他信息-->
                <van-panel class="panel-padding margin-block" v-show="detailStatusList.indexOf(detailStatus)!==-1">
                <!--<van-panel class="panel-padding margin-block">-->
                    <div slot="header">
                        <div style="width: 100%;display: inline-block;" v-show="detailStatus==='inquiryStatus8'">
                        <!--<div style="width: 100%;">-->
                            <van-cell>
                                <van-tag type="success" style="margin-right: 5px">{{provider_status[detailStatus]}}</van-tag>
                                <span style="">物流单号：{{feedbackInfo.expressComp}} | {{feedbackInfo.trackingNum}}</span>
                                <span style="float: right;" >
                                   <van-button size="mini" type="primary" style="float: right" @click="copyNumber">复制单号</van-button>
                                </span>
                            </van-cell>
                        </div>
                        <div style="width: 100%;display: inline-block;" v-show="detailStatus==='receiptStatus3' || detailStatus==='inquiryStatus7'">
                        <!--<div style="width: 100%;">-->
                            <van-cell>
                                <!--回单的status-->
                                <van-tag type="success" style="margin-right: 5px">{{label_status[feedbackInfo.receiptStatus]}}</van-tag>
                                <span style="">{{reminder[feedbackInfo.receiptStatus]}}</span>
                            </van-cell>
                        </div>
                        <!--意向单-->
                        <div style="width: 100%;display: inline-block;" v-show="detailStatus==='receiptStatus1'">
                            <!--<div>-->
                            <van-cell>
                                <van-tag type="success" style="margin:0 5px 5px 0">{{label_status[feedbackInfo.receiptStatus]}}</van-tag>
                                <span style="">{{reminder[feedbackInfo.receiptStatus]}}</span>
                            </van-cell>
                            <van-cell>姓名：{{customerInfo.name}}</van-cell>
                            <van-cell>电话：{{customerInfo.phone}}</van-cell>
                            <van-cell>地址：{{customerInfo.address}}</van-cell>
                        </div>
                    </div>
                </van-panel>
            </div>

            <!--待填写回单-->
            <div v-show="isAccept==='n'">
                <van-panel class="panel-padding" v-show="noHiding">
                    <van-cell slot="header" :border="false" class="pannel-header">
                        需求说明：
                    </van-cell>
                    <van-field
                            v-model="orderDetailData.clothType"
                            type="text"
                            label="面料种类："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="orderDetailData.sampleType"
                            type="text"
                            label="类型："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="orderDetailData.expireTime"
                            type="text"
                            label="有效期至："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="orderDetailData.acceptCustomize"
                            type="text"
                            label="可否定制："
                            placeholder=""
                            :readonly="true"
                    />
                    <!--<p style="font-weight: bolder;padding-left: 1%">面料说明：</p>-->
                    <van-panel :border="false">
                        <van-cell slot="header" :border="false">
                            面料说明：
                        </van-cell>
                        <div class="cloth-desc">
                            <textarea rows="4" cols="25" v-model="orderDetailData.desc" readonly="readonly" ></textarea>
                        </div>
                    </van-panel>
                </van-panel>
                <van-cell>
                    <div style="text-align: center;color: #1989fa;font-size: 12px" v-show="showAll">
                        <span @click="showAllInfo">{{showAllText}}</span>
                    </div>
                </van-cell>
                <van-button  type="primary" style="width: 100%" @click="goAcceptOrder">我要接这单</van-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {handleClipboard} from "../assets/js/clipboard";
    import {inquirySendDetail, queryInquiryReceipt} from '../axios/api'
    import {formatDate, IS_CUSTOMIZATION,REQUIREMENTS_TYPE,getClothType, SPOT_STATUS, ORDER_STATUS, REMINDER,UNIT,PROVIDER_STATUS,LABEL_STATUS} from '../assets/js/common'
    import {getPicUrl} from "../assets/js/getPicUrl";
    // import BigImg from '../../src/components/BigImg;
    // import evenBus from '../assets/js/bus'
    import { ImagePreview } from 'vant';
    const FIELD_TYPE = {'n': 'password','y':'text'};
    const SHOW_BUTTON = {'n': true,'y':false};
    // const SAMPLE_STATUS = {0:'已调版',1:'待确认调版',2:'已发货'};
    export default {
        // components: {'big-img': BigImg},
        name: "orderDetail",
        data(){
            return{
                sms:'',
                headPortrait: null,
                unit:UNIT,
                reply:{}, //回单内容
                reminder:REMINDER,
                label_status:LABEL_STATUS,
                provider_status:PROVIDER_STATUS,
                toSee:['receiptStatus3','inquiryStatus7','inquiryStatus8'], //去查看回单详情，不可修改回单
                detailStatusList:['receiptStatus1','receiptStatus3','inquiryStatus7','inquiryStatus8'], //意向单，跑腿，发货
                detailStatus: '', //状态的key 见 PROVIDER_STATUS
                showAll:false, //点击按钮
                noHiding: false, //需求详情
                showCont: false, //
                showAllText:'',
                smallImgUrl:[], //缩略图
                showButton: false,
                isAccept:'', // 是否已经接单
                fieldType: 'password',
                showImg: false,
                inquiryId:0,
                receiptId:0,
                imgSrc: '',
                // flag: 'w',
                orderDetailData: {
                    'clothType':'',
                    'sampleType':'',
                    'expireTime':'',
                    'acceptCustomize':'',
                    'desc':'',
                    'imgList':[]
                },
                customerInfo:{
                    'companyName':'companyName',
                    'name':'name',
                    'phone':'phone',
                    'address': 'address',
                     },
                feedbackInfo:{
                    'inquiryId': 0,
                    'imageURL': require('../assets/img/smile.png'),
                    'createTime': 'createTime',
                    'sampleStatus': 'sampleStatus',
                    'colorCode': 'colorCode',
                    'samplePrice': 0,
                    'unitPrice': 0, //大货价
                    'largeUnit': null,
                    'cuttingUnit': null,
                    'stock': null,
                    'colorCard': null,
                    'expressComp':'expressComp',
                    'trackingNum': 'trackingNum',
                    'statusCode':'statusCode',
                    'detail': {},
                    'receiptStatus': 0,// 回单的status
                },
            }
        },
        created(){
            this.isAccept = this.$route.query.isAccept;
            this.detailStatus = this.$route.query.orderStatusKey; //从修改回单再到详情，没有该值
            if(this.isAccept==='y'){
                this.showAll = true;
                this.showCont = true;
                this.noHiding = false;
                this.showAllText = '展开查看详情';
            }else {
                this.showAll = false;
                this.noHiding = true;
            }
            this.inquiryId = this.$route.query.inquiryId;
            this.receiptId = this.$route.query.receiptId;
            this.fieldType = FIELD_TYPE[this.isAccept];
            this.showButton = SHOW_BUTTON[this.isAccept];
            this.setOrderDetailData()
        },
        methods:{
            showAllInfo(){
                this.noHiding = !this.noHiding;
                this.showAllText = this.noHiding? '收起详情': '展开查看详情';
            },
            setOrderDetailData(){
                if(this.inquiryId > 0){
                    let params = {
                        'inquiryId':this.inquiryId
                    };
                    // 需求详情
                    inquirySendDetail(params).then(res => {
                        if(res.exId){
                            this.$notify(res.exDesc);
                            return false;
                        }
                        // 设置orderDetailData
                        if(res.imageList.length > 0){ // 形成缩略图
                            res.imageList.forEach(url => {
                                this.smallImgUrl.push(getPicUrl(url,2))
                            })
                        }
                        // this.detailStatus = res.status;
                        // if(res.status===6 && res.confirmedCount > 0){
                        //     this.detailStatus = 61; //意向单
                        // }
                        this.orderDetailData.imgList = res.imageList;
                        console.log('res.headPortrait',res.headPortrait);
                        this.headPortrait = res.headPortrait || require('../assets/img/defaultHead.png'); // 采购商头像
                        this.orderDetailData.acceptCustomize = IS_CUSTOMIZATION[res.acceptCustomize];
                        this.orderDetailData.expireTime = formatDate(res.expireTime);
                        this.orderDetailData.desc = res.desc;
                        this.orderDetailData.clothType = getClothType(res.keywords);
                        this.orderDetailData.sampleType = REQUIREMENTS_TYPE[res.type];
                        //设置customerInfo
                        this.customerInfo.companyName = res.companyName;
                        this.customerInfo.name = res.name;
                        this.customerInfo.phone = res.phone;
                        this.customerInfo.address = res.address;
                        //feedbackInfo的物流信息
                        this.feedbackInfo.expressComp = res.deliCom;
                        this.feedbackInfo.trackingNum = res.trackingNum;
                        this.feedbackInfo.detail = res.detail; //已支付的采购信息
                    })
                    // 需求回单信息
                    if(this.receiptId > 0){
                        let params = {'receiptId': this.receiptId};
                        queryInquiryReceipt(params).then(res => {
                            if(res.exId){
                                this.$notify(res.exDesc);
                                return false;
                            }
                            //feedbackInfo的非物流信息
                            this.feedbackInfo.inquiryId = res.inquiryId;
                            this.feedbackInfo.imageURL = getPicUrl(res.imgUrlListValue[0],2);
                            this.feedbackInfo.createTime = formatDate(res.createTime);
                            this.feedbackInfo.sampleStatus = SPOT_STATUS[res.spotStatus];
                            this.feedbackInfo.colorCode = res.colorCardCode;
                            this.feedbackInfo.samplePrice = res.samplePrice;
                            this.feedbackInfo.unitPrice = res.unitPrice;
                            this.feedbackInfo.colorCard = res.colorCard;
                            this.feedbackInfo.largeUnit = res.largeUnit;
                            this.feedbackInfo.cuttingUnit = res.cuttingUnit;
                            this.feedbackInfo.stock = res.stock;
                            this.feedbackInfo.statusCode = '';
                            this.feedbackInfo.receiptStatus = res.status;
                            //修改用的回单信息
                            this.reply = res
                        })
                    }

                }else{
                    this.$notify('inquiryId: ' + String(this.inquiryId) + '不正确!');
                    return false;
                }

            },
            copyNumber () { // 物流单号复制
                handleClipboard(this.feedbackInfo.trackingNum, event, () => {
                    this.$toast.success('单号已经复制在剪贴版');
                }, () => {
                    this.$toast.fail('单号复制失败！')
                })
            },
            back(){
                // this.$router.go(-1);
                this.$router.push({name:'orderList'})
            },
            clickImg (index) {
                this.showImg = true;
                // 获取当前图片地址
                // this.imgSrc = e.currentTarget.src
                // this.imgSrc = this.orderDetailData.imgList[index];
                ImagePreview(
                    {
                        images: this.orderDetailData.imgList,
                        startPosition: index,
                        showIndicators: true
                     },
                );
            },
            showContact(){
                this.showCont = true;
                this.showButton = false;
              // this.fieldType = 'text'
              // this.fieldType = 'textarea'
            },
            goFeedBackDetail(){
                this.$router.push({name:'feedBackDetail',query:{'receiptId':this.receiptId}})
            },
            goAcceptOrder(){
                if(this.showCont){ // 已经查看了客户资料
                    this.$router.push({name:'acceptOrder', query:{'inquiryId':this.inquiryId}})
                }else{
                    this.$notify('请先显示客户资料！')
                }
            },
            updateRecepit(){
                // evenBus.$emit('fromDetail',this.reply);
                // this.$router.push({name:'acceptOrder', query:{'inquiryId':this.inquiryId, 'from': 'updateRecepit'}})
                this.$router.push({name:'acceptOrder', query:{'inquiryId':this.inquiryId, 'receiptId': this.receiptId,'orderStatusKey':this.detailStatus}})
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../assets/css/mycss.css';
    .cloth-desc textarea{
            width: 92%;
            border: none;
            font-size:0.33rem
    }
</style>
