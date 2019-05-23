<template>
    <div>
        <ul>
            <li>userId:{{userInfo.userId}}</li>
            <li>name:{{userInfo.name}}</li>
            <li>regTel:{{userInfo.regTel}}</li>
        </ul>
    </div>
</template>
<script>
import {wechatAuth,wechatOauth,wechatOauth2} from '@/utils/auth.js'
import {userSession} from '@/axios/api.js'
import {mapState} from 'vuex'
export default {
    computed:{
        ...mapState({
            userInfo : state => state.userInfo
        })
    },
    created() {
  
        this.getInfo()

    },
    methods:{
        async getInfo(){

            //获取当前页面链接进行签名处理
            let link = this.$router.resolve({
                path: window.location.href
            })

            //判断链接里面有没有code参数
            //有就执行后台oauth写入授权
            //没有code执行正常的流程请求用户session
            if(link.href.includes('/?code')){
                
                wechatOauth(link.route.query.code,'/auth')
                /* wechatOauth2(link.route.query.code).then(res => {
                    console.log(res)
                }) */

            }else{
                //先判断有无用户授权，有就拿到用户data数据，没有就请求微信授权接口
                let {isAuth,...data} = await this.userData()

                //如果没有授权返回的是false，调用微信的接口请求用户授权再返回auth页面
                if(!isAuth){
                    wechatAuth('/auth')
                }else{
                    
                    let {
                        userId,name,regTel,shopNo,address,linkman,tel
                    } = data.User/* {userId:30745,name:'wangxiao',regTel:'18565383379',shopNo:'测试1',address:'测试2',linkman:'测试3',tel:'测试4'} */

                    this.$store.commit(
                        'modifyUserData',
                        {userId,name,regTel,shopNo,address,linkman,tel}
                    )

                    //授权成功后判断id是否已经关注了微信公众号，-1为未关注，跳至引导页关注
                    if(userId == -1){
                        this.$router.push({
                            path:'/introduce'
                        })
                    }else{
                        //用户关注微信公众号后判断是否绑定了手机号码
                        //regTel为空表示未绑定,跳至register页面绑定手机号码
                        if(regTel == ""){
                            this.$router.push({
                                path:'/register'
                            })
                        }else{
                            //不为空就从哪里进来到哪里去
                            /* let {redirect} = this.$router.query
                            
                            if(redirect){
                                this.$router.push({
                                    path:`'/${redirect}'`
                                })
                            }else{
                                this.$router.push({
                                    path:'/introduce'
                                })
                            } */
                            
                        }
                    }

                }
            }

            
        },
        userData(){
            return userSession().then(res => {

                res.isAuth = true

                return res

            }).catch(err => {
                
                if(err.exId == -33){
                    
                    return {
                        isAuth : false
                    }
                }

            })
        }
    }

}
</script>
