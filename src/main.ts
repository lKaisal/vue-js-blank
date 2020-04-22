import Vue from 'vue'
import Router from './router'
import Store from './store'
import App from '@/App.vue'

Vue.config.productionTip = false

new Vue({
  template: '<App/>',
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
