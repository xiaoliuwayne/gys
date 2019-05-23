import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'
import store from '@/store'
import router from '@/router'
import 'lib-flexible'
import 'vant/lib/index.css'
import VueLazyLoad from 'vue-lazyload'

//图片上传组件
const VueUploadComponent = require('vue-upload-component');
Vue.component('file-upload', VueUploadComponent);

Vue.use(VueLazyLoad,{
    error: require('./assets/img/lazyLoad/error.png'),
    loading: require('./assets/img/lazyLoad/loading.png')
});
Vue.config.productionTip = false;

Vue.use(Vant);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
