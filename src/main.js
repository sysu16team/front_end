// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://172.18.32.30:3000'
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
Vue.use(iView)
var vm = new Vue({
  el: '#app',
  router,
  axios,
  components: { App },
  template: '<App/>'
})
