import Vue from 'vue'
import VueRouter from 'vue-router'
import PageMain from './pages/PageMain.vue'
import PageCreate from './pages/PageCreate.vue'

Vue.use(VueRouter)

export default new VueRouter({
  // mode: 'history',
  routes: [
    { path: '/', component: PageMain, name: 'PageMain' },
    { path: '/create', component: PageCreate, name: 'PageCreate' },
    { path: "*", component: PageMain, name: 'Error Page' }
  ]
})
