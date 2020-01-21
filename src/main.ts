import Vue from 'vue'
import Router from './router'
import Store from './store'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(BootstrapVue)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  template: '<App/>',
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
