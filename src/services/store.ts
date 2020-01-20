import Vue from 'vue'
import Vuex from 'vuex'
import { AxiosResponse } from 'axios'
import { Banner } from '../models'
import service from '../client'

Vue.use(Vuex as any)

interface BannersState {
  list: Banner[]
}

export default new Vuex.Store<BannersState>({
  state: {
    list: [],
  },

  getters: {
    listSortedAndCleared(state: BannersState) {
      // const cleared = state.list && state.list.filter(banner => banner.isActive)

      return state.list && state.list.sort((a, b) => {
        const keyA = a.sort
        const keyB = a.sort

        if (keyA > keyB) return 1
        else if (keyA < keyB) return -1
        else return 0
      })
    }
  },

  mutations: {
    saveList: (state: BannersState, payload: Banner[]) => state.list = payload
  },

  actions: {
    async getList({commit}) {
      return new Promise((resolve) => {
        service.get('api/v1/banners-list')
          .then((res: AxiosResponse<any>) => {
            while (!Array.isArray(res)) res = res.data

            commit('saveList', res)
            resolve()
          })
      })
    }
  }
})
