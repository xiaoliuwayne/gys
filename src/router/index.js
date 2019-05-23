import Vue from 'vue'
import Router from 'vue-router'
import {wechatAuth,wechatOauth} from '@/utils/auth.js'
import store from '@/store'
import VueCookies from 'vue-cookies'

Vue.use(Router)

const routes = {
    mode: 'hash',
    routes: [
        { path: '/', redirect: '/index' },
        {
            path: '/introduce',
            name:'introduce',
            component: () => import('@/pages/introduce')
        },
        {
            path: '/register',
            component: () => import('@/pages/register')
        },
        /* {
            path: '/auth',
            component: () => import('@/pages/auth')
        }, */
        {
            path: '/businessCard',
            component: () => import('@/pages/businessCard')
        },
        {
            path: '/category',
            component: () => import('@/pages/category')
        },
        {
            path: '/index',
            name:'index',
            component: () => import('@/pages/index')
        },
        {
            path: '/orderList',
            name:'orderList',
            component: () => import('@/pages/orderList')
        },
        {
            path: '/orderDetail',
            name:'orderDetail',
            component: () => import('@/pages/orderDetail')
        },
        {
            path: '/acceptOrder',
            name:'acceptOrder',
            component: () => import('@/pages/acceptOrder')
        },
        {
            path: '/feedBackDetail',
            name:'feedBackDetail',
            component: () => import('@/pages/feedBackDetail')
        },
        {
            path: '/historyRecord',
            name:'historyRecord',
            component: () => import('@/pages/historyRecord')
        },
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
}


const route = new Router(
    routes
)

route.beforeEach((to, from, next) => {
    //获取当前页面链接进入路由签名
    let link = route.resolve({
        path: window.location.href
    })

    //判断有没有code
    if(link.href.includes('/?code')){
        let {code} = link.route.query
        let uri    = to.fullPath
        wechatOauth(code,uri)

    }else{

        let {userId,regTel} = store.state.userInfo

        //没有code再进入判断有没有用户资料
        //这里在进入项目页面的时候只会走一次
        if(userId === null){

            //用户数据初始化请求

            store.dispatch('getUserData').then(res => {

                if(res.userId == -1){

                    //已授权进入正常的判断跳转流程
                    //判断用户是否关注了公众号 -1为没有关注
                    //没有关注就删除无效的cookie
                    //然后跳转至引导页

                    let session_name = process.env.VUE_APP_COOKIE_NAME

                    if(VueCookies.isKey(session_name)) VueCookies.remove(session_name)

                    next('/introduce')

                }

                //这里是请求到用户资料进入的正常流程
                //判断有没有绑定手机号码
                if(res.regTel == '') next('/register')


                next()

            //未授权就请求微信接口进行授权
            }).catch(err => {


                if(err.exId == -33){
                    wechatAuth(to.fullPath)
                }else{
                    console.log(err)
                }

            })

        }else{
            //这里又陷入了if的嵌套地狱，谁有更好的办法
            //这里是没有问题进入的正常流程
            //防止用户回退但是没有关注公众号，跳到引导页
            //这样的数据结构防止页面内存栈溢出，下同
            if(userId == -1){
                if(to.path == '/introduce'){
                    next()
                }else{
                    next('/introduce')
                }
            }else{
                //防止用户回退但是有关注公众号，但是没有绑定手机跳到注册页
                if(regTel == null){
                    if(to.path == '/register'){
                        next()
                    }else{
                        next('/register')
                    }
                }else{
                    next()//最终没问题出口
                }
            }

        }
    }
})

export default route
