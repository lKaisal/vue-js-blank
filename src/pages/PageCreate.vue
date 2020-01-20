<template lang="pug">
  include ../tools/bemto.pug

  +b.page-create
    +e.title.H1 Создание баннера
    +e.container
</template>

<script lang="ts">
import { Vue, Component } from '../../node_modules/vue-property-decorator/lib/vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from '../../node_modules/vuex-class/lib/index'
import Store from '../services/store'

@Component({
  components: {
  }
})

export default class App extends Vue {
  get list() { return Store.getters.listSortedAndCleared }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.page-create

  &__container
    debug()
    width 100%
    height 100px
</style>
