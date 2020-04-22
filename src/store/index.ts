import Vue from 'vue'
import Vuex from 'vuex'
import data from '@/store/modules/data'
import ui from '@/store/modules/ui'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ui,
    data
  }
})