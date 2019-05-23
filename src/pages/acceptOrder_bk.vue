<template>
    <div>
        <van-nav-bar
                title="给客户回样"
                left-arrow
                @click-left="back"
                class="header header-top"
        />
        <div class="main-body">
            <van-panel>
                <div slot="header">
                    <van-cell title="上传需要找的面料照片：" size="large" label="请上传要找的完整图案、细节图、尺寸参照图、正反面对比等。最多5张。" >
                        <van-button type="primary" slot="right-icon" size="mini" @click="goHistoryRecord" v-show="false">调取产品库</van-button>
                    </van-cell>
                </div>
                <div>
                    <div class="img-uploader">
                        <div class="img-uploader-item-1" v-for="(url,nn) in curImgsList" :key="nn">
                        <!--<div class="img-uploader-item" v-for="(item,nn) in curImgsList" :key="nn">-->
                            <!--<img :src="item.content" alt="图片" class="imgPreview" @click="clickImg($event)">-->
                            <!--<big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>-->
                            <img :src="url" alt="图片" class="imgPreview" @click="clickImg(nn)">
                            <van-icon name="close" @click="delImg(nn)" class="delte" v-show="!loadingStatus"/>
                        </div>
                        <van-uploader :after-read="onRead" :accept="'image/*'" v-show="curImgsList.length<=4 || !loadingStatus">
                            <img src="../assets/img/pic.png" alt="等待传图" class="imgPreview">
                        </van-uploader>
                    </div>
                    <van-popup v-model="loadingStatus" style="border-radius: 50px;">
                    <van-loading size="80px" />
                    </van-popup>
                </div>
            </van-panel>
            <van-panel class="panel-padding">
                <van-cell slot="header" :border="false" class="pannel-header">
                    回样说明：
                </van-cell>
                <van-field
                        v-model="form.colorCardCode"
                        type="text"
                        label="色卡编号："
                        required
                />
                <van-field
                        v-model="form.productName"
                        type="text"
                        label="品名："
                />
                <van-field
                        v-model="form.ingredients"
                        type="text"
                        label="成份："
                />
                <van-field
                        v-model="form.width"
                        type="number"
                        label="幅宽："
                >
                    <span slot="right-icon">CM</span>
                </van-field>
                <van-field
                        v-model="form.weight"
                        type="number"
                        label="克重："
                >
                    <span slot="right-icon">克/CM</span>
                </van-field>
                <van-field
                        v-model="form.samplePrice"
                        type="number"
                        label="剪版价："
                        required
                >
                    <span slot="right-icon">
                        <div v-show="moreStore" class="select">
                            <select class="choice" v-on:change="indexSelect(form.cuttingUnit)" v-model="form.cuttingUnit">
                                <option v-for="(item,ii) in columns" :key="ii" v-bind:value="item.indexId">{{item.name}}</option>
                            </select>
                        </div>
                    </span>
                </van-field>
                <van-field
                        v-model="form.unitPrice"
                        type="number"
                        label="大货价："
                >
                    <span slot="right-icon">
                        <div v-show="moreStore" class="select">
                            <select class="choice" v-on:change="indexSelect(form.largeUnit)" v-model="form.largeUnit">
                                <option v-for="(item,ii) in columns" :key="ii" v-bind:value="item.indexId">{{item.name}}</option>
                            </select>
                        </div>
                    </span>
                </van-field>
                <!--<van-field-->
                        <!--v-model="colorCardPrice"-->
                        <!--type="text"-->
                        <!--label="色卡："-->
                        <!--:readonly="true"-->
                <!--/>-->
                <van-cell style="display: inline-flex">
                    <div slot="title" style="display: flex">
                        <div>免费色卡：</div>
                        <van-radio-group v-model="form.colorCard" style="display: inline-flex">
                            <van-radio :name='1' class="radio-margin">提供</van-radio>
                            <van-radio :name='2' class="radio-margin">不提供</van-radio>
                        </van-radio-group>
                    </div>
                </van-cell>
                <van-cell style="display: inline-flex">
                    <div slot="title" style="display: flex">
                        <div>是否现货：</div>
                        <van-radio-group v-model="form.spotStatus" style="display: inline-flex">
                            <van-radio :name='0' class="radio-margin">现货</van-radio>
                            <van-radio :name="1" class="radio-margin">定制</van-radio>
                        </van-radio-group>
                    </div>
                </van-cell>
                <van-field
                    v-model="form.stock"
                    type="number"
                    label="库存："
                >
                    <span slot="right-icon">{{unit[form.largeUnit]}}</span>
                </van-field>
                <van-panel :border="false">
                    <van-cell slot="header" :border="false">
                        面料说明：
                    </van-cell>
                    <div class="cloth-desc">
                        <textarea rows="4" cols="25" v-model="form.description" style="width: 92%;font-size:0.33rem" ></textarea>
                    </div>
                </van-panel>
            </van-panel>
            <van-panel>
                <div slot="header" :border="false">
                    <van-cell-group :border="false">
                        <van-field
                                v-model="sms"
                                label="我的信息："
                                :readonly="true"
                                :border="false"
                                style="font-weight: bolder"
                        >
                            <van-button slot="button" size="small" type="primary" @click="updateProviderInfo">修改</van-button>
                        </van-field>
                    </van-cell-group>
                    <van-field
                            v-model="name"
                            type="text"
                            label="供应商名称："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="linkman"
                            type="text"
                            label="联系人："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="regTel"
                            type="text"
                            label="移动电话："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-field
                            v-model="DetailAddress"
                            type="text"
                            label="公司地址："
                            placeholder=""
                            :readonly="true"
                    />
                    <van-panel title="">
                        <div slot="header">
                            <van-cell value="主营业务：" :border="false"/>
                            <van-field
                                    v-for="item in providerKeyWords" :key="item.groupId"
                                    v-show="item.keywords.length>0"
                                    v-model="item.keywords"
                                    type="text"
                                    :label="CLOTH_STYLE[item.groupId] + '：'"
                                    :autosize="{minHeight:10}"
                                    :readonly="true"
                            />
                        </div>
                        <div slot="footer">
                            <van-button  type="primary" style="width: 100%" @click="submit" v-if="receiptId === 0">提交</van-button>
                            <van-button  type="primary" style="width: 100%" @click="updateReceipt" v-else>提交回单修改</van-button>
                        </div>
                    </van-panel>
                </div>
            </van-panel>
        </div>
    </div>
</template>

<script>
    // import eventBus from '../assets/js/bus';
    // import BigImg from '../../src/components/BigImg'
    import {CLOTH_STYLE, API, BASEURL, UNIT} from '../assets/js/common'
    import {insertInquiryReceipt, userSession, uploadImgs, updateInquiryReceiptInfo, queryInquiryReceipt} from '../axios/api'
    import {getPicUrl} from '../assets/js/getPicUrl'
    import {ImagePreview} from 'vant'
    // import {postImage} from "../axios";

    export default {
        // components: {'big-img': BigImg},
        name: "acceptOrder",
        data(){
            return{
                sms:'',
                // from:'',
                unit:UNIT,
                moreStore:true,
                columns: [{'indexId':1,'name':'元/公斤'}, {'indexId':2,'name':'元/米'}, {'indexId':3,'name':'元/码'}],
                // columns: [{'indexId':0,'name':'元/米'},{'indexId':1,'name':'元/公斤'}, {'indexId':2,'name':'元/米'}, {'indexId':3,'name':'元/码'}], // 0为之前的无效默认值
                DetailAddress:'',
                inquiryId:0,
                receiptId:0,
                CLOTH_STYLE: CLOTH_STYLE,
                isGo: true,
                // 有关图片显示
                showImg: false,
                mgSrc: '',
                loadingStatus: false,
                curImgsList: [], //图片缩略图数组
                colorCardPrice: '免费',  //固定
                tmpImgUrls:[],  // 临时的图片上传服务器后的url数组
                form:{
                    'colorCardCode':'',
                    'unitPrice': null,  //大货价
                    'productName':'',
                    'ingredients':'',
                    'width':null,
                    'weight':null,
                    'stock':null,
                    'spotStatus':0,
                    'largeUnit': 2,
                    'cuttingUnit': 2,
                    'colorCard': 1,
                    'sampleStatus':null,
                    'samplePrice':null, // 剪版价格
                    'description':'',
                    'imgUrlListValue':[],
                    'inquiryId':0,
                    'receiptId':0,
                    'userId':0
                },
                providerInfo: {
                    'companyName': 'companyName',
                    'name': 'name',
                    'address': 'address',
                    'phone': 'phone'
                },
                providerKeyWords: []
                // providerKeyWords: [{'groupId': 1,'keywords':'牛仔 帆布'},{'groupId': 2,'keywords':'卫衣 棉麻'}]
            }
        },
        created(){
            // sessionStorage.removeItem('inputInfo'); //测试用
          this.inquiryId = this.$route.query.inquiryId;
          // eventBus传值
          // this.from = this.$route.query.from ? this.$route.query.from : '';
          // if(this.from==='updateRecepit'){
          //     this.$nextTick(this.receiveDetailData());
          // }
           this.receiptId = this.$route.query.receiptId ? this.$route.query.receiptId : 0;
           if(this.receiptId > 0){
               let params = {'receiptId': this.receiptId};
               queryInquiryReceipt(params).then(res => {
                   console.log('queryInquiryReceipt=>res',res);
                   if (res.exId) {
                       this.$notify(res.exDesc);
                       return false;
                   }
                   //回单详情
                   this.form.colorCardCode = res.colorCardCode;
                   this.form.unitPrice = res.unitPrice;
                   this.form.stock = res.stock;
                   this.form.largeUnit = res.largeUnit;
                   this.form.cuttingUnit = res.cuttingUnit;
                   this.form.colorCard = res.colorCard;
                   this.form.productName = res.productName;
                   this.form.ingredients = res.ingredients;
                   this.form.width = res.width;
                   this.form.weight = res.weight;
                   this.form.spotStatus = res.spotStatus;
                   this.form.sampleStatus = res.sampleStatus;
                   this.form.samplePrice = res.samplePrice;
                   this.form.description = res.description;
                   this.form.imgUrlListValue = res.imgUrlListValue;
                   this.form.inquiryId = res.inquiryId;
                   this.form.userId = res.userId;
                   this.form.receiptId = this.receiptId;
                   this.tmpImgUrls = res.imgUrlListValue;
                   res.imgUrlListValue.forEach(img => {
                       this.curImgsList.push(getPicUrl(img,1))
                   });
                   console.log('res.imgUrlListValue',res.imgUrlListValue)
               });
           }
          this.dealKeyWords(this.busiKeywords);
          this.DetailAddress = this.area + this.address;
          if(sessionStorage.getItem('inputInfo')){ //
              let inputInfo = JSON.parse(sessionStorage.getItem('inputInfo'));
              this.tmpImgUrls = inputInfo.tmpImgUrls;
              this.curImgsList = inputInfo.curImgsList;
              this.inquiryId = inputInfo.inquiryId;
              this.receiptId = inputInfo.receiptId;
              this.form.colorCardCode = inputInfo.colorCardCode;
              this.form.unitPrice = inputInfo.unitPrice;
              this.form.stock = inputInfo.stock;
              this.form.largeUnit = inputInfo.largeUnit;
              this.form.cuttingUnit = inputInfo.cuttingUnit;
              this.form.colorCard = inputInfo.colorCard;
              this.form.productName = inputInfo.productName;
              this.form.ingredients = inputInfo.ingredients;
              this.form.width = inputInfo.width;
              this.form.weight = inputInfo.weight;
              this.form.spotStatus = inputInfo.spotStatus;
              this.form.sampleStatus = inputInfo.sampleStatus;
              this.form.samplePrice = inputInfo.samplePrice;
              this.form.description = inputInfo.description;
              this.form.imgUrlListValue = inputInfo.imgUrlListValue;
              this.form.inquiryId = inputInfo.inquiryId;
              this.form.userId = inputInfo.userId;
          }
          console.log('this.form',this.form);
        },
        mounted(){
            // this.receiveHistoryData();
        },
        // eventBus实现传递信息
        // beforeDestroy(){
        //     alert(999);
        //     eventBus.$off('fromHistory', (val) => {  //手动关闭$on的监听事件
        //         console.log('fromHistory=>beforeDestroy',val)
        //     });
        //     eventBus.$off('fromDetail', (val) => {
        //         console.log('fromDetail=>beforeDestroy',val)
        //     });
        // },
        computed:{
            providerId(){
              return this.$store.state.userInfo.userId;
            },
            name(){
                return this.$store.state.userInfo.name;
            },
            regTel(){
                return this.$store.state.userInfo.regTel;
            },
            address(){
                return this.$store.state.userInfo.address;
            },
            linkman(){
                return this.$store.state.userInfo.linkman;
            },
            busiKeywords(){ //关键字
                return this.$store.state.userInfo.busiKeywords;
            },
            area(){
                return this.$store.state.userInfo.area
            }
        },
        methods:{
            // receiveHistoryData(){
            //     const that = this; //这个this是vue项目的实例，改为that接收，与eventBus的vue区分
            //     eventBus.$on('fromHistory',function (val) {
            //         console.log('val from historyRecord', val); //需要手动关闭监听
            //         //使用val给表单赋值
            //     })
            // },
            // receiveDetailData(){ //修改回单信息
            //     const _this = this;
            //     console.log(222);
            //     eventBus.$on('fromDetail', function (val) {
            //         console.log(333);
            //         console.log('val from orderDetail', val);
            //     })
            // },
            submit(){
                // 清除缓存
                sessionStorage.removeItem('inputInfo');
                this.form.userId = this.providerId;
                this.form.inquiryId = this.inquiryId;
                this.form.receiptId = 0; //新建回单 receiptId=0
                //集合去重法,图片地址
                let set = new Set(this.tmpImgUrls);
                this.form.imgUrlListValue = Array.from(set);
                // 必填字检测
                if(this.form.colorCardCode === ''){
                    this.$notify('请输入色卡编号!');
                    return false;
                }
                if(this.form.samplePrice===null || this.form.samplePrice <= 0){
                    this.$notify('请输入剪版价!');
                    return false;
                }
                // 图片检测
                if(this.form.imgUrlListValue.length === 0){
                    this.$notify('请上传图片!');
                    return false;
                }
                if(this.form.userId <= 0 || this.form.inquiryId <= 0){
                    this.$notify('providerId:' + String(this.form.userId) + ';或者 inquiryId:' + String(this.form.inquiryId) + '不正确！');
                    return false;
                }
                let params = {'receipt':this.form};
                insertInquiryReceipt(params).then(res => {
                    if(res.exId){
                        this.$notify(res.exDesc);
                        return false;
                    }
                    // 上传成功后
                    if(res.result === 0){
                        this.$notify({
                            message: '已提交成功，请等待客户确认并联系您！',
                            duration: 1000,
                            background: '#1989fa'
                        });
                        this.$router.push({path:'/orderList',query:{'from':'acceptOrder'}})
                    }
                })
            },
            dealKeyWords(keywords){ //  关键字的处理
                this.providerKeyWords = [];
                var zzkeyWord = '';
                var szkeyWord = '';
                if(keywords.length > 0){
                   keywords.forEach(obj => {
                       if(obj.groupId === 1){
                           zzkeyWord += obj.keyword + '  '
                       }
                       if(obj.groupId === 2){
                           szkeyWord += obj.keyword + '  '
                       }
                   });
                }
                this.providerKeyWords.push({'groupId':1,'keywords':zzkeyWord});
                this.providerKeyWords.push({'groupId':2,'keywords':szkeyWord});
            },
            setTmpSessionStorage(){ // 保证输入信息的临时缓存，避免刷新丢失
                //集合去重法,图片地址
                let set = new Set(this.tmpImgUrls);
                this.form.imgUrlListValue = Array.from(set);
                let inputInfo = {
                        'colorCardCode':this.form.colorCardCode,
                        'unitPrice': this.form.unitPrice,
                        'stock': this.form.stock,
                        'largeUnit': this.form.largeUnit,
                        'cuttingUnit': this.form.cuttingUnit,
                        'colorCard': this.form.colorCard,
                        'productName':this.form.productName,
                        'ingredients':this.form.ingredients,
                        'width':this.form.width,
                        'weight':this.form.weight,
                        'spotStatus':this.form.spotStatus,
                        'sampleStatus':this.form.sampleStatus, //调样价格 调样价格状态：0. 免费，1. 收费 以前必须
                        'samplePrice':this.form.samplePrice,
                        'description':this.form.description,
                        'imgUrlListValue':this.form.imgUrlListValue,
                        'inquiryId':this.inquiryId,
                        'receiptId':this.receiptId,
                        'userId':this.providerId,
                        'curImgsList': this.curImgsList,
                        'tmpImgUrls':this.form.imgUrlListValue,
                };
                sessionStorage.setItem('inputInfo',JSON.stringify(inputInfo))
            },
            updateProviderInfo(){
                // sessionStorage.removeItem('inputInfo');
                this.setTmpSessionStorage();
                this.$router.push({path:'/businessCard',query:{'from':'acceptOrder'}})
            },
            updateReceipt(){ // 更新回单信息
                // 清除缓存
                sessionStorage.removeItem('inputInfo');
                this.form.receiptId = this.receiptId;
                this.form.userId = this.providerId;
                this.form.inquiryId = this.inquiryId;
                //集合去重法,图片地址
                let set = new Set(this.tmpImgUrls);
                this.form.imgUrlListValue = Array.from(set);
                // 必填字检测
                if(this.form.colorCardCode === ''){
                    this.$notify('请输入色卡编号!');
                    return false;
                }
                if(this.form.samplePrice===null || this.form.samplePrice <= 0){
                    this.$notify('请输入剪版价!');
                    return false;
                }
                // 图片检测
                if(this.form.imgUrlListValue.length === 0){
                    this.$notify('请上传图片!');
                    return false;
                }
                if(this.form.userId <= 0 || this.form.inquiryId <= 0 || this.form.receiptId <= 0){
                    this.$notify('providerId:' + String(this.form.userId) + ';或者 inquiryId:' + String(this.form.inquiryId) + ';或者 receiptId:' + String(this.form.receiptId) + '不正确！');
                    return false;
                }
                // let formdata = {'param':this.form,'inquiryId':this.inquiryId,'userId':this.providerId,'receiptId':this.receiptId};
                let formdata = {'param':this.form};
                console.log('updateReceipt=> formdata', formdata);
                updateInquiryReceiptInfo(formdata).then(res => {
                    console.log('updateInquiryReceiptInfo=>res', res);
                    if(res.exId){
                        this.$notify(res.exDesc);
                        return false;
                    }
                    this.$notify({
                            message: '回单修改成功！',
                            duration: 1000,
                            background: '#1989fa'
                    });
                    this.$router.push({name:'orderDetail',query:{'isAccept':'y','inquiryId':this.inquiryId,'receiptId':this.receiptId}});
                })
            },
            goHistoryRecord(){
                this.$router.push({name:'historyRecord'})
            },
            back(){
                // this.$router.go(-1);
                this.$router.push({name:"orderList"});
            },
            clickImg (index) {
                this.showImg = true;
                // 获取当前图片地址
                // this.imgSrc = this.tmpImgUrls[index];
                ImagePreview(
                    {
                        images: this.tmpImgUrls,
                        startPosition: index,
                        showIndicators: true
                    },
                );
            },
            viewImg () {
                this.showImg = false
            },
            onRead (file) { // 上传图片到图片服务器
                // // this.$refs.clothImg.src = file.content;
                // this.curImgsList.push(file);
                let fd = new FormData();
                fd.append('upImgs', file.file);
                this.loadingStatus = true;
                uploadImgs(fd).then(res => {
                    if (res.data.desc === 'success') {
                        // 原本大图
                        this.tmpImgUrls.push(res.data.urls[0].image);
                        // 缩略图片
                        let smallImgUrl = getPicUrl(res.data.urls[0].image,1);
                        this.curImgsList.push(smallImgUrl)
                    }
                    this.loadingStatus = false;
                }).catch(err => {
                    this.loadingStatus = false;
                    this.curImgsList = [];
                    this.tmpImgUrls = [];
                    console.log('onRead=>err：', err);
                    this.$notify(err + '网络异常，请重新上传图片！')
                })
                // 以下原生的axios
                // // this.$refs.clothImg.src = file.content;
                // this.curImgsList.push(file);
                // // let url = API + '/upload?type=99'
                // let url = '/upload?type=99';
                // let fd = new FormData();
                // fd.append('upImgs', file.file);
                // this.loadingStatus = true;
                // postImage.post(url, fd, {headers: {
                //         'Content-Type': 'multipart/form-data'
                //     }}).then(res => {
                //     console.log('onRead=>', res.data);
                //     if (res.data.desc === 'success') {
                //         this.tmpImgUrls.push(res.data.urls[0].image)
                //     }
                //     this.loadingStatus = false
                // }).catch(err => {
                //     this.loadingStatus = false;
                //     this.curImgsList = [];
                //     this.tmpImgUrls = [];
                //     console.log('onRead=>err：', err);
                //     this.$notify(err + '网络异常，请重新上传图片！')
                // })
            },
            indexSelect(val){
                console.log('val',val)
            },
            delImg (index) {
                // 删除指定下标的缩略图片url=>页面上显示的
                if (isNaN(index) || index >= this.curImgsList.length) {
                    return false
                }
                let tmp = [];
                for (let i = 0, len = this.curImgsList.length; i < len; i++) {
                    if (this.curImgsList[i] !== this.curImgsList[index]) {
                        tmp.push(this.curImgsList[i])
                    }
                }
                this.curImgsList = tmp;
                // 删除指定下标的图片对象url=>传至后端的url数组
                let tmpImgUrlValues = [];
                for (let i = 0, len = this.tmpImgUrls.length; i < len; i++) {
                    if (this.tmpImgUrls[i] !== this.tmpImgUrls[index]) {
                        tmpImgUrlValues.push(this.tmpImgUrls[i])
                    }
                }
                this.tmpImgUrls = tmpImgUrlValues
            },
        }
    }
</script>

<style lang="less" scoped>
    @import '../assets/css/mycss.css';
    .delte{
        float: right;
    }
    .radio-margin{
        margin: 0 10px;
    }
</style>
