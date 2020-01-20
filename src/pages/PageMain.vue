<template lang="pug">
  include ../tools/bemto.pug

  +b.page-main
    +e.title.H1 Список баннеров
    el-button.page-main__btn.page-main__btn_add(type="primary" @click="onClick") Создать баннер
    ListBanners(v-if="list && list.length" class="page-main__list")
</template>

<script lang="ts">
import { Vue, Component } from '../../node_modules/vue-property-decorator/lib/vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from '../../node_modules/vuex-class/lib/index'
import Store from '../services/store'
import ListBanners from '../components/ListBanners.vue'

@Component({
  components: {
    ListBanners
  }
})

export default class App extends Vue {
  get list() { return Store.getters.listSortedAndCleared }

  onClick() { this.$router.push({ path: '/create' }) }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.page-main

  &__btn
    margin-bottom 50px

  &__list
    width 100%
</style>
