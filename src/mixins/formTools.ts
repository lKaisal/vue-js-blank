/**
 * @description По умолчанию настроено с учетом, что форма хранится в сторе в модуле data, интерфес формы - interfaces/form.ts
 * Необходимы библиотеки validator (валидация текстовых полей), inputmask (маска номера телефона, email)
 */

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import trim from 'validator/lib/trim'
import isAlpha from 'validator/lib/isAlpha'

export const formTools = {
  data: () => ({
    masks: {
      phone: {
        'ru': '+7 (999) 999-9999',
        'en': '+999999[999999999]',
      },
    },
  }),
  computed: {
    ...mapState('data', [
      'form',
    ]),
    ...mapGetters('data', [
      'formIsValid',
      'formParameters',
      'formName',
      'formEmail',
      'formQuestion',
    ]),
    name: {
      get() { return this.formName.value },
      set(value) { this.updateName(trim(value)) }
    },
    email: {
      get() { return this.formEmail.value },
      set(value) { this.updateEmail(trim(value)) }
    },
    question: {
      get() { return this.formQuestion.value },
      set(value) { this.updateQuestion(trim(value)) }
    },
  },
  async mounted() {
    await this.$nextTick()
    this.setMasks()
  },
  beforeDestroy() {
    this.setValidationIsShown(false)
  },
  methods: {
    ...mapMutations('data', [
      'updateName',
      'updateEmail',
      'updateQuestion',
      'setValidationIsShown',
      'clearForm'
    ]),
    ...mapActions('data', [
      'sendForm',
    ]),
    isInvalid(field) { return this.form.validationIsShown && field.validationRequired && !field.isValid },
    setMasks() {
      this.setEmailMask()
    },
    async setEmailMask() {
      const InputmaskModule = await import('inputmask/dist/inputmask/inputmask.js')
      const Inputmask = InputmaskModule.default
      const email = this.$refs.emailInput

      if (!email) return

      const options = {
        regex: '[a-zA-Z0-9.!#@$%&’*+/=?^_`{|}~-]*',
        placeholder: '',
      }

      const inputmask = Inputmask(options).mask(email)
    },
  }
}
