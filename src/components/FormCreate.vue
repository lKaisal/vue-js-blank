<template lang="pug">
  include ../tools/bemto.pug

  +b.form-create
    +e.FORM.body
      +e.row
        +e.img-drop
          +e.drop(v-show="!uploadedImg && !imgUrl" ref="fileform" @drop.prevent="saveImg" @dragover.prevent)
            i(class="el-icon-plus form-create__drop-plus")
          +e.INPUT.input-img(type="file" @input="onInputImg")
          +e.img(v-if="uploadedImg" @mouseenter.self="dropDeleteIsShown=true" @mouseleave="dropDeleteIsShown=false")
            IMG(:src="imgUrl" :class="{ 'is-faded': dropDeleteIsShown }" class="form-create__img-preview")
            i(v-show="dropDeleteIsShown" @click="removeImg" class="el-icon-delete-solid form-create__drop-delete")
      +e.row
        +e.LABEL.label(for="newsId") Id новости
        +e.EL-INPUT.input(placeholder="7777777" v-model="newsId")
      +e.row
        +e.LABEL.label(for="pageType") Тип страницы
        +e.EL-INPUT.input(placeholder="7777777" v-model="pageType")
      +e.row
        +e.LABEL.label(for="isActive") Показывать в приложении
        +e.EL-CHECKBOX.checkbox(v-model="isActive")
      +e.row
        +e.LABEL.label(for="sortBy") Положение баннера
        +e.EL-SELECT.select(ref="select" v-model="sortBy" :placeholder="(maxSortBy + 1).toString()")
          +e.EL-OPTION(v-for="n in maxSortBy + 1" :key="n" :label="n" :value="n")
      +e.row
        +e.EL-BUTTON(type="primary" @click="submitForm") Сохранить баннер
        +e.EL-BUTTON(type="danger") Отменить
</template>

<script lang="ts">
import { Vue, Component, Prop } from '../../node_modules/vue-property-decorator/lib/vue-property-decorator'
import Store from '../store/index'
import { Banner } from '../models'

@Component({
  components: {
  }
})

export default class FormCreate extends Vue {
  newsId: string = ''
  pageType: string = ''
  isActive: boolean = true
  sortBy: number = 1
  uploadedImg: any = ''
  imgUrl: string | ArrayBuffer | null = ''
  dropDeleteIsShown: boolean = false

  get list() { return Store.getters.listSorted }
  get maxSortBy() { return this.list.length }

  submitForm() {
    const formData = new FormData()
    formData.append('file', this.uploadedImg)
    formData.append('isActive', this.isActive.toString())
    formData.append('newsId', this.newsId)
    formData.append('pageType', this.pageType)
    formData.append('sort', this.sortBy.toString())

    Store.dispatch('createBanner', formData)
  }

  saveImg(evt: any) {
    this.uploadedImg = evt.dataTransfer.files[0]
    this.getImagePreviews();
  }

  onInputImg(evt: any) {
    this.uploadedImg = evt.srcElement.files[0]
    this.getImagePreviews()
  }

  getImagePreviews(){
    let reader = new FileReader();

    reader.addEventListener('load', () => this.imgUrl = reader.result, false);
    reader.readAsDataURL(this.uploadedImg);
  }

  removeImg() {
    this.uploadedImg = null
    this.imgUrl = null
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.form-create

  &__row
    display flex
    align-items flex-end
    &:not(:last-child)
      margin-bottom 25px

  &__label
    margin-right 25px
    font-weight 300
    white-space nowrap

  &__img-drop
    position relative
    width 100px
    height 100px
    border 1px dashed black
    overflow hidden

  &__drop
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center

  &__input-img
    opacity 0
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    width 100%
    height 100%

  &__img
    z-index 1000
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    overflow hidden
    display flex
    justify-content center
    align-items center

  &__img-preview
    transition()
    &.is-faded
      opacity .5

  &__drop-delete
    z-index 1
    position absolute
</style>