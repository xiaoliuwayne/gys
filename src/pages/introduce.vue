<template>
    <div>
        <van-row type="flex" justify="center">
            <van-col span="24">
                <div class="block-img">
                    <div>
                        <img src="@/assets/img/introduce/banner.png" alt="">
                    </div>
                    <div class="block1">
                        <img src="@/assets/img/introduce/block1.png" alt="">
                    </div>
                    <div>
                        <img src="@/assets/img/introduce/block2.png" alt="">
                    </div>
                    <div>
                        <img src="@/assets/img/introduce/block3.png" alt="">
                    </div>
                    <div class="qr-code">
                        <img src="@/assets/img/introduce/qrcode.png" alt="">
                    </div>
                </div>
            </van-col>
        </van-row>
        <van-row type="flex" justify="center">
            <van-col span="24">
                <div class="res-btn" @click="register">
                    {{userId == -1 ? '注册账号' : '去接单'}}
                </div>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: "introduce",
    computed:{
        ...mapState({
            userId   : state => state.userInfo.userId,
            regTel   : state => state.userInfo.regTel
        }),
    },
    data(){
        return{

        }
    },
    created(){

    },
    methods:{
        register(){

            let userId = this.userId
            let regTel = this.regTel

            
            if(userId == -1){
                this.$notify({
                    message: '请您先长按二维码关注公众号！',
                    duration: 2000,
                    background: '#E6A23C'
                })
            }else if(regTel == ""){
                this.$router.push({
                    path:'/register'
                })
            }else{
                this.$router.push({
                    path:'/index'
                })
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.block-img{
    img{
        width:100%;
        height:auto;
    }
}
.block1{
    margin-top:-30px;
}

.res-btn{
    position: fixed;
    left:0;
    bottom:0;
    width:100%;
    background-color:#F27000;
    padding-bottom:calc(env(safe-area-inset-bottom) - 15px );
    width:100%;
    text-align: center;
    line-height:45px;
    font-size:15px;
    color:#fff;
}

.qr-code{
    text-align:center;
    margin:30px 0 80px 0;
    padding-bottom:calc(env(safe-area-inset-bottom) - 10px );
    img{
        width:40%;
        height:auto;
    }
}
</style>
