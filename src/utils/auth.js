import router from '@/router'

//请求微信官方的接口
export function wechatAuth(uri) {

    let link = router.resolve({
        path: "https://open.weixin.qq.com/connect/oauth2/authorize",
        query: { 
            appid           : 'wx549e521461be26b8',
            redirect_uri    : process.env.VUE_APP_URL + '/#' + uri,
            /* redirect_uri : 'http://avalon.xicp.io/#/businessCard', */
            response_type   : 'code',
            scope           : 'snsapi_userinfo',
            state           : '0'
        }
    })

    window.location.href = link.href.substr(2) + '#wechat_redirect'
}

//请求自己后台写入授权
export function wechatOauth(code,uri) {

    let link = router.resolve({
        path: process.env.VUE_APP_BASE_API + "/oauth.do",
        query: { 
            returnUrl : process.env.VUE_APP_URL + '/#' + uri,
            /* returnUrl : 'http://avalon.xicp.io/#/businessCard', */
            code      : code,
            appName   : process.env.VUE_APP_NAME
        }
    })

    /* http://192.168.31.72:8080/?code=081LYiNO0YaPa32X0gKO0rCiNO0LYiN-&state=0#/register */

    window.location.href = link.href.substr(2)
}