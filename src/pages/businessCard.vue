<template>
    <div>
        <van-nav-bar
                title="供应商信息"
                left-arrow
                @click-left="back"
                class="header header-top"
        />

        <div class="page-content">

            <van-row type="flex" justify="center">
                <van-col span="24">
                    <div class="head-portrait">
                        <van-uploader :after-read="onRead">
                            <img :src="userInfo.headPortrait" alt="">
                        </van-uploader>
                        <van-loading v-if="loadingShow" color="white" class="loading" />
                    </div>
                </van-col>
            </van-row>

            <van-row type="flex" justify="center" class="big-title">
                <van-col span="22"><h2>填写企业信息：</h2></van-col>
            </van-row>

            <van-row>
                <van-col span="24">
                    <van-cell-group>
                        <van-field

                            v-model.trim="infoForm['name']"
                            required
                            clearable
                            :error-message="errorMsg.name"
                            @blur="handleChange('name')"
                            label="公司/档口名"
                            type="text"
                            placeholder="请输入公司/档口名"
                        />
                        <van-field

                            v-model.trim="infoForm['shopNo']"
                            clearable
                            label="档口编号"
                            type="text"
                            placeholder="请输入档口编号"
                        />
                        <van-field

                            v-model.trim="infoForm['area']"
                            @click="araePickershow = true"
                            :error-message="errorMsg.area"
                            required
                            readonly
                            label="省/市/区"
                            type="text"
                            :right-icon="araePickershow ? 'arrow-down' : 'arrow'"
                            placeholder="请选择省/市/区"
                        />
                        <van-field

                            :value="market"
                            @click="marketPickerShow = true"
                            :error-message="errorMsg.marketId"
                            readonly
                            required
                            label="商圈"
                            type="text"
                            :right-icon="marketPickerShow ? 'arrow-down' : 'arrow'"
                            placeholder="请选择您所在的商圈"
                        />
                        <van-field

                            v-model.trim="infoForm['address']"
                            required
                            clearable
                            :error-message="errorMsg.address"
                            @blur="handleChange('address')"
                            label="详细地址"
                            type="text"
                            placeholder="请输入详细地址"
                        />
                        <van-field

                            v-model.trim="infoForm['linkman']"
                            :error-message="errorMsg.linkman"
                            @blur="handleChange('linkman')"
                            required
                            clearable
                            label="联系人"
                            type="text"
                            placeholder="请输入联系人姓名"
                        />
                        <van-field

                            v-model.trim="infoForm['regTel']"
                            :error-message="errorMsg.regTel"
                            @blur="handleChange('regTel')"
                            required
                            clearable
                            label="联系电话"
                            type="tel"
                            maxlength='11'
                            placeholder="请输入联系电话"
                        />
                        <van-field

                            v-model.trim="infoForm['tel']"
                            clearable
                            label="固定电话"
                            type="tel"
                            placeholder="请输入固定电话"
                        />
                    </van-cell-group>
                    
                    <van-actionsheet v-model="araePickershow" title="">
                        <van-area 
                        :area-list="areaList" 
                        :loading="false"
                        :item-height="50" 
                        :value="araeCode"
                        @confirm="handleAreaConfirm"
                        @cancel = 'araePickershow = false'
                        @change="handleAreaChange"
                        />
                    </van-actionsheet>

                    <van-actionsheet v-model="marketPickerShow" title="">
                        <van-picker 
                            :columns="marketColumns" 
                            :item-height="50" 
                            :show-toolbar="true" 
                            :default-index="0"
                            @confirm="handleMarketConfirm"
                            @cancel = 'marketPickerShow = false'
                            @change="handleMarketChange" />
                    </van-actionsheet>
                </van-col>

            </van-row>

            <van-row type="flex" justify="center" class="btn">
                <van-col span="20">
                    <van-button
                    type="info"
                    block
                    @click="submit"
                    >下一步</van-button>
                </van-col>
            </van-row>

        </div>
    </div>
</template>
<script>
import validator from '@/validator'
import {mapState} from 'vuex'
import {USER} from '@/store/mutation-types'
import areaList from '@/utils/area'
import {getHeadPortraitChange,uploadImage} from '@/axios/api.js'

export default {
    data(){
        return {
            loadingShow:false,
            araePickershow: false,
            marketPickerShow: false,

            /* colums:[
                {label:'公司/档口名', prop:'name',  required: false, type:"text"},
                {label:'档口编号', prop:'shopNo', required: false, type:"text"},
                {label:'地址',     prop:'address' ,required: false, type:"text"},
                {label:'联系人',   prop:'linkman', required: false, type:"text"},
                {label:'联系电话', prop:'regTel',required: false, type:"tel"},
                {label:'固定电话', prop:'tel', required: false, type:"tel"},
            ], */

            marketColumns: [
                { text: '广州中大', value:1 },
                { text: '绍兴柯桥', value:2 },
                { text: '吴江盛泽', value:3 },
                { text: '福建石狮', value:4 },
                { text: '东莞虎门', value:5 },
                { text: '深圳东门', value:6 },
                { text: '佛山平地', value:7 },
                { text: '其它', value:99 },
            ],
            areaList:{},
            errorMsg: {
                name    : '',
                area    : '',
                marketId: '',
                regTel  : '',
                address : '',
                linkman : '',
                
            },

            infoForm:{
                area    : null,
                marketId: null,
                name    : null,
                shopNo  : null,
                address : null,
                linkman : null,
                regTel  : null,
                tel     : null,

            },
            rules: {
                name: [
                    { required: true, message: '请输入您的公司名/档口名'}
                ],
                area: [
                    { required: true, message: '请选择省、市、区'}
                ],
                marketId: [
                    { required: true, message: '请选择您所在的商圈'}
                ],
                address: [
                    { required: true, message: '请输入您的公司地址'}
                ],
                linkman: [
                    { required: true, message: '请输入您的姓名'}
                ],
                regTel: [
                    { required: true, pattern: /^1[345789]\d{9}$/, message: '请输入正确且有效的手机号码'}
                ]
            }
        }
    },
    computed:{
        ...mapState({
            userInfo   : state => state.userInfo
        }),
        market(){
            let res = this.marketColumns.find(item => {
                return item.value == this.infoForm.marketId
            })

            if(!res){
                res = {
                    text:""
                }
            }

            return res.text
        },
        araeCode(){
            
            let areaAll = this.infoForm.area

            let areaCode = ''

            if(areaAll){

                let areArr = areaAll.split(" ")//将初始数据已空格为分隔符变为数组

                let area = areArr[2] || '海珠区'//取到最后的区域值，如果不存在或者为空就默认海珠区

                let countyList = this.areaList.county_list//获取到省市区选择库的区域库

                let objectIndex = Object.values(countyList).findIndex(res => res == area)//在区域库里面根据value值查找对应的key值

                let objectKyes  = Object.keys(countyList)[objectIndex]//找到后赋值

                areaCode = objectKyes//对象的key值就为一个城市的编码

            }

            areaCode = areaCode || '440105'//没有搜索到或者默认返回的之后没有就取海珠区的code

            return  areaCode
        }
    },
    watch:{
        //监听省市区选择器和商圈选择权校验
        market(val){
            this.handleChange('marketId')
        },
        'infoForm.area'(val) {
            this.handleChange('area')
        }
        
    },
    mounted(){
        var n = document.querySelectorAll('input,textarea')
        Array.prototype.forEach.call(n, function(dom) {        
            var pageDom = 5
            dom.onblur = function() {
            document.body.scrollTop = ++pageDom
            }
        })
    },
    created(){

        //初始化表单验证
        this.validator = validator(this.rules, this.infoForm)

        //加载省市区库
        this.areaList = areaList

        //初始化表单数据
        this.infoForm.name     = this.userInfo.name
        this.infoForm.shopNo   = this.userInfo.shopNo
        this.infoForm.address  = this.userInfo.address
        this.infoForm.linkman  = this.userInfo.linkman
        this.infoForm.tel      = this.userInfo.tel
        this.infoForm.regTel   = this.userInfo.regTel
        this.infoForm.area     = this.userInfo.area
        this.infoForm.marketId = this.userInfo.marketId

    },
    methods:{

        async onRead(file) {

            this.loadingShow = true

            let imgUrl = await uploadImage(file.file).then(res => {
                
                if(res.desc == 'success'){
                    return res.urls[0].image
                }else{
                    throw new Error('上传失败')
                }

            })

            let params = {
                op           : 18,
                userId       : this.userInfo.userId,
                headPortrait : imgUrl
            }

            await getHeadPortraitChange(params).then(res => {

                this.$store.commit(USER.MODIFY_USER_DATA,{headPortrait : imgUrl})
                
                this.$notify({
                    message: '头像修改成功！',
                    duration: 1000,
                    background: '#1989fa'
                })

            }).finally(() => {
                this.loadingShow = false
            })

        },

        //验证当前input
        handleChange(prop) {

            this.validate((errors)=>{
                
                if(!errors){
                    this.resetField(prop)
                }

            },[prop])

        },
        //清除表单验证错误
        resetField(attrs) {

            attrs = !attrs ? Object.keys(this.errorMsg) : ( Array.isArray(attrs) ? attrs : [attrs])

            attrs.forEach(attr => {
                this.errorMsg[attr] = ''
            })

        },
        //表单验证函数
        validate(callback,data) {

            this.validator.validate((errors, fields) => {
  
                if (errors) {
                    fields.forEach(item => {
                        this.errorMsg[item.field] = item.message
                    })
                }

                callback && callback(errors, fields)

            }, data);
        },
        handleAreaChange(picker, value, index){
            this.infoForm.area =  value[0].name + " " + value[1].name + " " + value[2].name
        },
        handleAreaConfirm(value){
            this.infoForm.area =  value[0].name + " " + value[1].name + " " + value[2].name
            this.araePickershow = false
        },
        handleMarketConfirm(values){
            this.infoForm.marketId = values.value
            this.marketPickerShow = false
        },
        handleMarketChange(picker, values){
            this.infoForm.marketId = values.value
        },
        submit(){

            this.validate((errors) => {
                if(!errors){
                    this.$store.commit(USER.MODIFY_USER_DATA,this.infoForm)

                    this.$router.push({ 
                        path:'/category',
                        query:{'from':this.$route.query.from}
                    })
                }
            })

        },
        back(){
            this.$router.go(-1)
        }
    }
}
</script>
<style>
    @import '../assets/css/mycss.css';
</style>

<style lang="scss" scoped>
.page-content{
    padding-top:75px;
}
.btn{
    margin:20px 0;
}
.head-portrait{
    padding:10px 0;
    width:100%;
    text-align:center;
    position: relative;
    .loading{
        position: absolute;
        left:calc(50% - 50px);
        top:10px;
        background-color:rgba(0,0,0,0.5);
        width:100px;
        height:100px;
        padding:10px;
        box-sizing: border-box;
        border-radius: 5px;
    }
    img{
        width:100px;
        height:100px;
        object-fit:cover;
        display: block;
        border-radius:50%;
    }
}
</style>

