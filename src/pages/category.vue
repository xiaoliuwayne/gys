<template>
    <div>
        <van-nav-bar
                title="供应商信息"
                left-arrow
                @click-left="back"
                class="header header-top"
        />
        <van-row type="flex" justify="center" class="big-title">
            <van-col span="22">
                <div  class="title">
                    <h2>填写企业信息：</h2>
                    <p>该信息非常重要，关系到平台是否准确推送客户订单。</p>
                </div>

            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="22">
                <div class="title">
                    <h2 >针织：</h2>
                </div>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="22">
                <div class="tag">
                    <van-tag
                    v-for="(item,index) in tag[0]"
                    :key="item.keyId"
                    size="large"
                    :plain="!item.checked"
                    @click="handleChecked(0,index)"
                    type="primary">
                        {{item.keyword}}
                    </van-tag>
                </div>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="22">
                <div class="title">
                    <h2 >梭织：</h2>
                </div>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="22">
                <div class="tag">
                    <van-tag
                    v-for="(item,index) in tag[1]"
                    :key="item.keyId"
                    size="large"
                    :plain="!item.checked"
                    @click="handleChecked(1,index)"
                    type="primary">
                        {{item.keyword}}
                    </van-tag>
                </div>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="22">
                <div class="title">
                    <h2 >其他：</h2>
                </div>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="22">
                <div class="tag add-tag">
                    <input type="text" placeholder="填写您的品类，多个用','隔开" v-model="memo">
                </div>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center" style="margin:70px 0;">
            <van-col span="20">
                <van-button
                type="info"
                block
                :loading="submitBtnLoading"
                @click="submit"
                >完成</van-button>
            </van-col>
        </van-row>
    </div>
</template>
<script>

import {fabricKeywords,selfMdfProvider,newUserPush} from '@/axios/api.js'
import {mapState} from 'vuex'
import {USER} from '@/store/mutation-types'
export default {
    data(){
        return{
            submitBtnLoading : false,
            memo:null,
            tag:[
                    [
                        /* {
                            keyword   :   '测试测试1',
                            keyId  :   null,
                            checked :   false
                        } */
                    ],
                    []
                ]
        }
    },
    computed:{
        ...mapState({
            userInfo : state => state.userInfo
        }),
        formatTag(){

            //合并数组
            let tag = [...this.tag[0],...this.tag[1]]
            //筛选数组
                tag = tag.filter(res => res.checked === true)
            //返回只需要的字段
                tag = tag.map(res => {
                    return {
                        keyId : res.keyId
                    }
                })

            return tag
        },
        formatTagAll(){

            //合并数组
            let tag = [
                ...this.tag[0]
                    .filter(item => item.checked == true)
                    .map(res => {
                        return {
                            groupId : 1,
                            keyword : res.keyword,
                            keyId   : res.keyId
                        }
                    }),
                ...this.tag[1]
                    .filter(item => item.checked == true)
                    .map(res => {
                        return {
                            groupId : 2,
                            keyword : res.keyword,
                            keyId   : res.keyId
                        }
                    })
            ]

            return tag
        }
    },
    created(){

        this.memo = this.userInfo.memo

        let busiKeywords = this.userInfo.busiKeywords.map(res => res.keyId)

        fabricKeywords({groupId:0}).then(res => {

            let tag = []

            tag[0] = res[0].list.map(item => {

                let checked = busiKeywords.includes(item.keyId)

                return  {
                    keyword   :   item.keyword,
                    keyId     :   item.keyId,
                    checked   :   checked
                }
            })

             tag[1] = res[1].list.map(item => {

                let checked = busiKeywords.includes(item.keyId)

                return  {
                    keyword   :   item.keyword,
                    keyId     :   item.keyId,
                    checked   :   checked
                }
            })

            this.tag = tag
        })

    },
    methods:{
        back(){
            this.$router.go(-1);
        },
        handleChecked(key,index){
            let {checked} = this.tag[key][index]
            this.tag[key][index].checked = !checked
        },
        submit(){

            let {userId,name,regTel,shopNo,address,linkman,tel,area,marketId} = this.userInfo

            let busiKeywords = this.formatTag

            let memo = this.memo

            let params = {
                userId  : userId,
                provider: JSON.stringify({
                    userId,name,regTel,shopNo,address,linkman,tel,memo,busiKeywords,area,marketId
                })
            }

            this.submitBtnLoading = true

            selfMdfProvider(params).then(res => {

                this.$notify({
                    message: '资料保存成功！',
                    duration: 1000,
                    background: '#1989fa'
                })

                let busiKeywords = this.formatTagAll

                this.$store.commit(USER.MODIFY_USER_DATA,{memo,busiKeywords})

                this.$toast.loading({
                    mask: true,
                    message: '正在给您匹配数据...'
                })

                setTimeout(()=>{
                    newUserPush({userId}).then(res => {})

                    if(this.$route.query.from){
                        this.$router.push({
                            path:'/acceptOrder'
                        })
                    }else{
                        this.$router.push({
                            path:'/index'
                        })
                    }
                }, 3000)

            }).finally(() => {

                this.submitBtnLoading = false

            })



        }
    }
}
</script>
<style lang="scss" scoped>
    @import '../assets/css/mycss.css';
.title{
    p{
        font-size:14px;
    }
}

.tag{
    border-top:1px solid #ccc;
    padding:15px 0;
    .van-tag{
        margin-right:10px;
        margin-bottom:10px;
    }
}

.add-tag{
    display:flex;
    input{
        width:100%;
        height:30px;
        font-size:14px;
        line-height:2;
    }
}
.big-title{
    margin-top:46px;
}
</style>
