<template lang="pug">
  include ../tools/all

  +b.debug-navigation
    +e.ROUTER-LINK.link(to="/index") index
    +e.ROUTER-LINK.link(to="/grid") grid
    +e.ROUTER-LINK.link(to="/test") test
    +e.ROUTER-LINK.link(to="get-distance") get-distance
</template>

<script lang="ts">

export default {
  name: 'DebugNavigation',
  computed: {
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.debug-navigation
  position fixed
  z-index 9999
  debug()
  color white
  bottom 0
  right 0
  left 0
  padding 10px

  &__link
    margin-right 10px
</style>
