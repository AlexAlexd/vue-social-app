<template>
  <div class="edit">
    <form @submit.prevent="saveChanges">
      <ImageFileInput
        @fileChange="onFileInputChange"
        :error="v$.file.$error ? 'Размер файла должен быть до 2МВ' : ''"
        :src="user.main.image"
      />
      <div class="edit__field">
        <Field
          v-model="name"
          type="text"
          placeholder="Имя"
          :error="v$.name.$error ? 'Имя может содержать буквы, цифры, пробелы и быть не длинее 20 символов' : ''"
        />
      </div>
      <div class="edit__footer">
        <button
          class="edit__submit btn btn-primary"
          type="submit"
          :class="{ disabled: isLoading }"
          v-if="getIconMode"
        >
          <font-awesome-icon :icon="[ 'fas', 'check' ]"/>
        </button>
        <button
          v-else
          class="edit__submit btn btn-primary"
          type="submit"
          :class="{ disabled: isLoading }"
        >Сохранить</button>
      </div>
    </form>
  </div>
</template>
<script>
import { db, storage } from '@/firebase'
import useVuelidate from '@vuelidate/core'
import { required, maxLength } from '@vuelidate/validators'
import Field from '@/components/forms/Field'
import ImageFileInput from './ImageFileInput'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  components: { Field, ImageFileInput },
  data() {
    return {
      name: '333',
      image: '',
      isLoading: false,
      file: null
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      name: { required, mustContainLetters, maxLength: maxLength(20) },
      file: { checkSize }
    }
  },
  methods: {
    async saveChanges() {
      if (this.isLoading) return
      this.v$.$validate()
      if (this.v$.$error) return
      this.isLoading = true
      if (this.file) {
        await this.uploadImage()
      }
      if (this.name !== this.user.main.name) {
        await this.uploadName()
      }
      this.isLoading = false
      this.$emit('saved')
    },
    onFileInputChange(file) {
      this.file = file
    },
    async uploadImage() {
      const imageRef = storage.ref(`users/${this.user.main.uid}/profile-photo`)
      await imageRef.put(this.file)
      const url = await imageRef.getDownloadURL()

      const { uid } = this.user.main
      const imageUrlRef = createRef(uid, 'image')
      await imageUrlRef.set(url)
      this.file = null
      this.SET_USER_IMAGE(url)
    },
    async uploadName() {
      const { uid } = this.user.main
      const nameRef = createRef(uid, 'name')
      await nameRef.set(this.name)
      this.SET_USER_NAME(this.name)
    },
    ...mapMutations(['SET_USER_IMAGE', 'SET_USER_NAME'])
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['getIconMode'])
  },
  mounted() {
    this.name = this.user.main.name
  },
}
function createRef(uid, path) {
  return db.ref(`users/${uid}/info/main/${path}`)
}
function mustContainLetters(value) {
  return /^[a-zA-Zа-яА-Я0-9\s]+$/i.test(value)
}
function checkSize(file) {
  return file ? file.size < 2000000 : true
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .edit {
    &__field {
      margin-top: 10px;
    }
    &__footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
</style>

