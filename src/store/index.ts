import Vue from 'vue'
import Vuex from 'vuex'
import { AxiosResponse } from 'axios'
import { Banner, BannersState } from '../models'
import service from '../client'
import { StoreOptions } from 'vuex'

Vue.use(Vuex as any)

const store: StoreOptions<BannersState> = {
  state: {
    list: [],
    createBanner: {
      isLoading: false,
      success: false,
      error: ''
    }
  },

  getters: {
    listSorted(state: BannersState) {
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
          .catch(error => console.log(error.response))
      })
    },
    async createBanner(state, formData) {
      return new Promise((resolve) => {
        service.post('api/v1/banner-create', formData, {headers: { 'Content-Type': 'multipart/form-data'}})
          .then((res: AxiosResponse<any>) => {
            console.log(res)
            resolve()
          })
          .catch(error => console.log(error.response))
      })
    }
  }
}

export default new Vuex.Store<BannersState>(store);
