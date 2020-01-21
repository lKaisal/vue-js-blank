<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      <router-view></router-view>
      //- ListBanners(class="app__list")
</template>

<script lang="ts">
import { Vue, Component } from '../node_modules/vue-property-decorator/lib/vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from '../node_modules/vuex-class/lib/index'
import ListBanners from './components/ListBanners.vue'
import Store from './store/index'

@Component({
  components: {
    ListBanners
  }
})

export default class App extends Vue {
  get list() { return Store.getters.listSorted }

  async created() {
    if (!this.list || !this.list.length) await Store.dispatch('getList')
  }
}
</script>

<style lang="stylus" scoped>
@import './styles/app'
@import './styles/tools'

.app

  &__container
    width-between-property 'padding-top' 600 10 1000 20 true true
    width-between-property 'padding-top' 1441 20 1920 30 false true
    width-between-property 'padding-bottom' 600 10 1000 20 true true
    width-between-property 'padding-bottom' 1441 20 1920 30 false true
</style>
