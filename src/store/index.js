import Vue from 'vue'
import Vuex from 'vuex'
import {userSession,getUserDetail} from '@/axios/api.js'
import {USER} from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: {
            // userId      : 29240, // 测试29240//30753 //28196
            // name        : 'wayneCompany',
            // busiKeywords: [{'groupId':1,'keyword':'空气层'},{'groupId':1,'keyword':'牛仔'}, {'groupId':2,'keyword':'羊毛'},{'groupId':2,'keyword':'棉'}], // 测试
            // headPortrait: require('../assets/img/156.jpg'),
            status      : null,
            userId      : null,
            name        : null,
            busiKeywords: null,
            headPortrait: null,
            area        : null,
            marketId    : null,
            regTel      : null,
            shopNo      : null,
            address     : null,
            linkman     : null,
            tel         : null,
            memo        : null
        }
    },
    mutations:{
        //修改userInfo的方法
        [USER.MODIFY_USER_DATA](state,userData){

            for(let key of Object.keys(state.userInfo)){

                if(userData.hasOwnProperty(key)){

                    state.userInfo[key] = userData[key] || null

                }

            }

        }
    },
    actions:{

        //请求微信授权及后台session签名后再调用请求用户详细资料接口
        async getUserData({commit}){

            //session签名
            const userInfo = await userSession().then(res => {

                const userData = {
                    userId : res.User.userId,
                    regTel : res.User.regTel,
                    status : res.User.status
                }

                commit(USER.MODIFY_USER_DATA,userData)

                return userData
            })

            //异步请求拿到userid再去请求用户资料接口
            let {userId} = userInfo
            //如果为-1则表示用户未关注，后台没有该用户数据，不能继续后面请求用户资料接口

            if(userId == -1)  {return userInfo}

            //调用用户资料接口
            const userDetail = await getUserDetail({userId}).then(res => {

                const userData = {
                    area        : res.area,
                    marketId    : res.marketId,
                    address     : res.address,
                    linkman     : res.linkman,
                    name        : res.name,
                    shopNo      : res.shopNo,
                    tel         : res.tel,
                    memo        : res.memo,
                    busiKeywords: res.busiKeywords,
                    headPortrait: res.headPortrait
                };

                commit(USER.MODIFY_USER_DATA,userData);

                return userData
            });

            //将数据合并后返回
            return {...userInfo,...userDetail}
        }
    },
    modules: {

    },
})
