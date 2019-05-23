<template>
    <div>
        <van-nav-bar
                title="回样详情"
                class="header header-top"
                left-arrow
                @click-left="back"
        />
        <div class="main-body">
            <van-panel>
                <div class="img-uploader">
                    <div class="img-uploader-item" v-for="(url,kk) in smallImgUrl" :key="kk" >
                        <img v-lazy="url" alt="图片" class="imgPreview" @click="clickImg(kk)">
                        <!--<big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>-->
                    </div>
                </div>
            </van-panel>
            <van-panel class="panel-padding">
                <van-cell slot="header" :border="false" class="pannel-header">
                    回样说明：
                </van-cell>
                <van-field
                        v-model="feedbackInfo.colorCode"
                        type="text"
                        label="色卡编号："
                        :readonly="true"
                        required
                />
                <van-field
                        v-model="feedbackInfo.productName"
                        type="text"
                        label="品名："
                        :readonly="true"
                />
                <van-field
                        v-model="feedbackInfo.ingredients"
                        type="text"
                        label="成份："
                        :readonly="true"
                />
                <van-field
                        v-model="feedbackInfo.width"
                        type="number"
                        label="幅宽："
                        :readonly="true"
                >
                    <span slot="right-icon">CM</span>
                </van-field>
                <van-field
                        v-model="feedbackInfo.weight"
                        type="number"
                        label="克重："
                        :readonly="true"
                >
                    <span slot="right-icon">克/CM</span>
                </van-field>
                <van-field
                        v-model="feedbackInfo.samplePrice"
                        type="number"
                        label="剪版价："
                        required
                        :readonly="true"
                >
                    <span slot="right-icon">
                        <div v-show="moreStore" class="select">
                            <select class="choice" v-on:change="indexSelect(feedbackInfo.cuttingUnit)" v-model="feedbackInfo.cuttingUnit" disabled="disabled">
                                <option v-for="(item,ii) in columns" :key="ii" v-bind:value="item.indexId">{{item.name}}</option>
                            </select>
                        </div>
                    </span>
                </van-field>
                <van-field
                        v-model="feedbackInfo.unitPrice"
                        type="number"
                        :readonly="true"
                        label="大货价："
                >
                    <span slot="right-icon">
                        <div v-show="moreStore" class="select">
                            <select class="choice" v-on:change="indexSelect(feedbackInfo.largeUnit)" v-model="feedbackInfo.largeUnit"  disabled="disabled">
                                <option v-for="(item,ii) in columns" :key="ii" v-bind:value="item.indexId">{{item.name}}</option>
                            </select>
                        </div>
                    </span>
                </van-field>
                <van-cell style="display: inline-flex">
                    <div slot="title" style="display: flex">
                        <div>免费色卡：</div>
                        <van-radio-group v-model="feedbackInfo.colorCard" style="display: inline-flex" disabled>
                            <van-radio :name='1' class="radio-margin">提供</van-radio>
                            <van-radio :name='2' class="radio-margin">不提供</van-radio>
                        </van-radio-group>
                    </div>
                </van-cell>
                <van-cell style="display: inline-flex">
                    <div slot="title" style="display: flex">
                        <div>是否现货：</div>
                        <van-radio-group v-model="feedbackInfo.spotStatus" style="display: inline-flex" disabled>
                            <van-radio :name='0' class="radio-margin">现货</van-radio>
                            <van-radio :name="1" class="radio-margin">定制</van-radio>
                        </van-radio-group>
                    </div>
                </van-cell>
                <van-field
                        v-model="feedbackInfo.stock"
                        type="number"
                        label="库存："
                        :readonly="true"
                >
                    <span slot="right-icon">{{unit[feedbackInfo.largeUnit]}}</span>
                </van-field>
                <van-panel :border="false">
                    <van-cell slot="header" :border="false">
                        面料说明：
                    </van-cell>
                    <div class="cloth-desc">
                        <textarea rows="4" cols="25"  v-model="feedbackInfo.desc" readonly="readonly" ></textarea>
                    </div>
                </van-panel>
            </van-panel>
            <van-panel>
                <div slot="header" :border="false">
                    <van-cell slot="header" :border="false" class="pannel-header">
                        我的信息：
                    </van-cell>
                    <van-field
                            v-model="providerInfo.companyName"
                            type="text"
                            label="供应商名称："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="providerInfo.name"
                            type="text"
                            label="联系人："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="providerInfo.phone"
                            type="text"
                            label="移动电话："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="providerInfo.address"
                            type="text"
                            label="公司地址："
                            placeholder=""
                            :readonly="true"
                    />
                </div>
            </van-panel>
        </div>
    </div>
</template>

<script>
    // import BigImg from '../../src/components/BigImg'
    import {queryInquiryReceipt} from '../axios/api'
    import {SPOT_STATUS,UNIT} from '../assets/js/common'
    import {getPicUrl} from "../assets/js/getPicUrl";
    import { ImagePreview } from 'vant';

    export default {
        name: "feedBackDetail",
        // components:{'big-img': BigImg},
        data(){
            return{
                sms:'',
                unit:UNIT,
                moreStore:true,
                columns: [{'indexId':1,'name':'元/公斤'}, {'indexId':2,'name':'元/米'}, {'indexId':3,'name':'元/码'}],
                smallImgUrl:[],
                showImg: false,
                imgSrc: '',
                receiptId: 0,
                feedbackInfo: {
                    'imgList':[require('../assets/img/logo.png'),require('../assets/img/logo.png'),require('../assets/img/smile.png'),require('../assets/img/156.jpg'),require('../assets/img/156.jpg')],
                    'desc': 'desc',
                    'samplePrice': 'samplePrice',
                    'inStock': 'inStock',
                    'weight': 'weight',
                    'width': 'width',
                    'ingredients': 'ingredients',
                    'productName': 'productName',
                    'colorCode': 'colorCode',
                },
                providerInfo:{
                    'companyName':'companyName',
                    'name':'name',
                    'phone':'phone',
                    'address':'address',
                }
            }
        },
        created(){
            this.receiptId = this.$route.query.receiptId;
            this.setFeedBackData()
        },
        methods:{
            indexSelect(val){
                console.log('val',val)
            },
            setFeedBackData(){
                if(this.receiptId > 0){
                    let params = {'receiptId': this.receiptId};
                    queryInquiryReceipt(params).then(res => {
                        if(res.exId){
                            this.$notify(res.exDesc);
                            return false;
                        }
                        //feedbackInfo的信息
                        if(res.imgUrlListValue.length > 0){
                            res.imgUrlListValue.forEach(url => {
                                this.smallImgUrl.push(getPicUrl(url))
                            })
                        }
                        this.feedbackInfo.imgList = res.imgUrlListValue;
                        this.feedbackInfo.desc = res.description;
                        this.feedbackInfo.samplePrice = res.samplePrice;
                        this.feedbackInfo.inStock = SPOT_STATUS[res.spotStatus];
                        this.feedbackInfo.spotStatus = res.spotStatus;
                        this.feedbackInfo.weight = res.weight;
                        this.feedbackInfo.width = res.width;
                        this.feedbackInfo.ingredients = res.ingredients;
                        this.feedbackInfo.productName = res.productName;
                        this.feedbackInfo.colorCode = res.colorCardCode;
                        this.feedbackInfo.cuttingUnit = res.cuttingUnit;
                        this.feedbackInfo.largeUnit = res.largeUnit;
                        this.feedbackInfo.unitPrice = res.unitPrice;
                        this.feedbackInfo.colorCard = res.colorCard;
                        this.feedbackInfo.stock = res.stock;
                        //providerInfo的信息
                        if(res.hasOwnProperty('provider')){
                            this.providerInfo.companyName = res.provider.name;
                            this.providerInfo.name = res.provider.linkman;
                            this.providerInfo.phone = res.provider.regTel;
                            this.providerInfo.address = res.provider.address;
                        }
                    })
                }else{
                    this.$notify('receiptId:' + String(this.receiptId)+',不正确！')
                }
            },
            back(){
                this.$router.go(-1)
            },
            clickImg (index) {
                this.showImg = true;
                // 获取当前图片地址
                // this.imgSrc = this.feedbackInfo.imgList[index]
                // this.imgSrc = e.currentTarget.src
                // this.imgSrc = e.target.dataset.src
                ImagePreview(
                    {
                        images: this.feedbackInfo.imgList,
                        startPosition: index,
                        showIndicators: true
                    },
                );
            },
            viewImg () {
                this.showImg = false
            }
        }
    }
</script>

<style scoped>
    @import '../assets/css/mycss.css';
    .cloth-desc textarea{
        width: 92%;
        border: none;
        font-size:0.33rem
    }
</style>
