import { GetterTree, MutationTree, ActionTree } from 'vuex'

export type DataState = {
}

export const state = (): DataState  => ({
  test: null
})

export const getters: GetterTree<DataState, DataState> = {

}

export const mutations: MutationTree<DataState> = {

}

export const actions: ActionTree<DataState, DataState> = {
  async getTestData({ commit }) {
    try {
      const data = await this.$axios.$get('https://jsonplaceholder.typicode.com/todos/1')
      console.log(data)
      commit('saveTestData', data.title)
    } catch (error) {
      commit('saveTestData', error.message)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
