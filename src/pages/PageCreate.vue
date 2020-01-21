<template lang="pug">
  include ../tools/bemto.pug

  +b.page-create
    +e.H1.title.page-title Создание баннера
    FormCreate(class="page-create__form")
</template>

<script lang="ts">
import { Vue, Component } from '../../node_modules/vue-property-decorator/lib/vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from '../../node_modules/vuex-class/lib/index'
import Store from '../store/index'
import FormCreate from '../components/FormCreate.vue'

@Component({
  components: {
    FormCreate
  }
})

export default class PageCreate extends Vue {
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.page-create

  &__form
    grid-size(4, 4, 4, 4, 6)
</style>
