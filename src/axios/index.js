import axios from 'axios'
import Qs from 'qs'
/* import store from '@/store'
import { USER } from '@/store/mutation-types' */
import { Notify } from 'vant'


// 创建axios实例
const service = axios.create({
  	baseURL	: process.env.VUE_APP_API || process.env.VUE_APP_BASE_API,
	headers	: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
	//post请求前向data添加参数
	transformRequest: [function (data) {

		if(data instanceof FormData){

			data = data

		}else{

			data = Qs.stringify({
				appName: process.env.VUE_APP_NAME,
				...data
			})
			
		}
		
		return data

	}],
    timeout: 15000 // 请求超时时间
})


// request拦截器
service.interceptors.request.use(config => {
		return config
    }, error => {
        // Do something with request error
        Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {

		const res = response.data

		if (res.exDesc) {
			/* store.commit(USER.MODIFY_USER_DATA,{userId : null}) */
			Notify(res.exDesc + '或刷新页面')
			return Promise.reject(res)

		} else {
			return response.data
		}
    },
    error => {

		Notify(error.message)

		return Promise.reject(error)
    }
)

// 图片上传的axios实例
const postImg = axios.create({
    baseURL	: process.env.VUE_APP_API || process.env.VUE_APP_BASE_API,
    headers: {'Content-Type': 'multipart/form-data'},
    timeout: 15000 // 请求超时时间
})


//封装get请求返回的参数
function fetch(url,params) {
	//get请求编辑的参数
	return service({
		method: 'get',
		url,
		params : {
			appName: process.env.VUE_APP_NAME,
			...params
		}
	})
}

export default service

export {
	fetch,
	service as request,
	postImg as postImage
}


