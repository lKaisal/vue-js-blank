<template lang="pug">
  include ./tools/all

  +b.app#app(v-cloak)
    DebugGrid(v-if="showDebugGrid")
    DebugNavigation
    router-view
</template>

<script lang="ts">
import DebugGrid from '@/components/DebugGrid.vue'
import DebugNavigation from '@/components/DebugNavigation.vue'

export default {
  name: 'App',
  components: {
    DebugGrid,
    DebugNavigation,
  },
  computed: {
    showDebugGrid() {
      return Object.keys(this.$route.query).includes('debug')
    },
  }
}
</script>

<style lang="stylus">
@import '~@/styles/tools'

.app
  overflow hidden
</style>
