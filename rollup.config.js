import vue from 'rollup-plugin-vue'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'
import pkg from './package.json'

export default {
  input: 'src/App.vue',
  output: {
    format: 'esm',
    file: 'dist/module-banners.js'
  },
  // external: [
  //   'vue',
  //   'vue-property-decorator',
  //   'vuex-class',
  //   '@/components/ListBanners.vue'
  // ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    css(),
    typescript({
      typescript: require('typescript'),
    }),
    vue({css: false}),
  ]
}