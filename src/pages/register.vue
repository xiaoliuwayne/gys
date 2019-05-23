<template>
    <div>
        <van-row type="flex" justify="center">
            <van-col span="12"><img class="logo" src="@/assets/img/logo.png" alt=""></van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="24">
                <van-cell-group>
                    <van-field
                        v-model="formData.regTel"
                        label="手机号"
                        placeholder="请输入手机号"
                        :error-message="errorMsg.regTel"
                        @blur="handleChange('regTel')"
                        type="tel"
                        maxlength='11'
                        clearable/>
                    <van-field
                        v-model="formData.sms"
                        :error-message="errorMsg.sms"
                        @blur="handleChange('sms')"
                        maxlength='4'
                        type="number"
                        center
                        clearable
                        pattern="\d*"
                        label="短信验证码"
                        placeholder="请输入短信验证码">
                        <van-button 
                        slot="button" 
                        size="small" 
                        type="primary"
                        :loading="smsBtnLoading"
                        @click="getSendSms"
                        :disabled="!(formData.regTel.length == 11 && countdown == 60)"
                        >{{countdown == 60 ? '发送验证码' : countdown + 's后重发'}}</van-button>
                    </van-field>
                </van-cell-group>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center" style="margin-top:40px;">
            <van-col span="20">
                <van-button 
                type="info" 
                block 
                :loading="submitBtnLoading"
                :disabled="!(formData.regTel.length == 11 && formData.sms.length == 4)"
                @click="submit"
                >注册并与微信绑定</van-button>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import validator from '@/validator'
import {smsSend,userSession,userMgr} from '@/axios/api.js'
import {mapState} from 'vuex'
import {USER} from '@/store/mutation-types'
export default {
    data(){
        return {
            smsBtnLoading : false,
            submitBtnLoading:false,
            countdown: 60,
            formData:{
                sms   : '',
                regTel : '',
            },
            
            errorMsg: {
                regTel: '',
                sms: ''
            },
            rules: {
                regTel: [
                    { required: true, pattern: /^1[345789]\d{9}$/, message: '请输入正确且有效的手机号码'}
                ],
                sms: [
                    { required: true, min:4, message: '请输入正确的验证码'}
                ]
            }
        }
    },
    computed:{
        ...mapState({
            userId   : state => state.userInfo.userId,
            regTel   : state => state.userInfo.regTel
        })
    },
    created() {

        this.validator = validator(this.rules, this.formData)
        
    },
    methods:{
        
        submit() {
            this.validate((errors) => {
                if(!errors){

                    let params = {
                        /* userId  : this.userId, */
                        op      : 17,
                        regTel  : this.formData.regTel,
                        smsCode : this.formData.sms
                    }

                    this.submitBtnLoading = true

                    userMgr(params).then(res => {

                        this.$notify({
                            message: '手机号码绑定微信成功',
                            duration: 1000,
                            background: '#1989fa'
                        })

                        this.$store.commit(USER.MODIFY_USER_DATA,{regTel : params.regTel})
                        
                        this.$router.push({
                            path:'/businessCard'
                        })

                    }).finally(() => {
                        this.submitBtnLoading = false
                    })
                }
            })
        },

        getSendSms(){
            this.validate(async (errors)=>{
                
                if(!errors){

                    this.smsBtnLoading = true

                    let isSend = await smsSend({tel:this.formData.regTel}).then(res => {
                                        return true
                                    }).finally(() => {
                                        this.smsBtnLoading = false
                                })

                    if(isSend){
                        
                        this.$toast.success('短信发送成功')

                        this.countdownStart()

                    }
                }

            },['regTel'])
        },

        countdownStart(){
            
            let initial = this.countdown    //记录初始值
                        --this.countdown    //先减去1从59开始计时
    
            let timer = self.setInterval(()=>{

                this.countdown--

                if(this.countdown < 0){
                    this.countdown = initial
                   clearInterval(timer)
                }

            },1000)
        },

        //失去焦点验证当前input
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
    }
}
</script>

<style lang="scss" scoped>
.logo{
    width:100%;
    height:auto;
    padding:80px 0;
}
</style>



