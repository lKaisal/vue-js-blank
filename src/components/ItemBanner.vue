<template lang="pug">
  include ../tools/bemto.pug

  +b.item-banner
    +e.container
      +e.img-wrapper
        IMG.item-banner__img(:src="banner.bannerImageUrl")
      +e.info
        +e.info-item._banner-date(v-if="banner.bannerDate")
          +e.title Banner Date:&nbsp;<span class="item-banner__text">{{ banner.bannerDate }}</span>
        +e.info-item._created-at(v-if="banner.createdAt")
          +e.title Created At:&nbsp;<span class="item-banner__text">{{ banner.createdAt }}</span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from '../../node_modules/vue-property-decorator/lib/vue-property-decorator'
import { Banner } from '../models'

@Component({
  components: {
  }
})

export default class ListBanners extends Vue {
  @Prop() banner!: Object
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.item-banner

  &__container
    display flex
    justify-content center
    flex-wrap wrap
    width 100%
    height 100%

  &__img-wrapper
    position relative
    width 80%
    height 80%
    overflow hidden
    margin-bottom 50px

  &__img
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    max-width 100%
    max-height 100%

  &__info-item
    display flex

  &__title
    font-weight 700

  &__text
    font-weight 300
</style>
