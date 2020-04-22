import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '@/pages/index.vue'
import grid from '@/pages/grid.vue'
import GetDistance from '@/pages/get-distance.vue'
import test from '@/pages/test.vue'

Vue.use(VueRouter)

export default new VueRouter({
  // mode: 'history',
  routes: [
    { path: '/index', component: index, name: 'index' },
    { path: '/grid', component: grid, name: 'grid' },
    { path: '/get-distance', component: GetDistance, name: 'get-distance' },
    { path: '/test', component: test, name: 'test' }
  ]
})
