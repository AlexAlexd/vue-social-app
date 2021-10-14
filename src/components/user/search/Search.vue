<template>
  <div class="search">
    <div class="error-text">
      <span v-if="v$.query.$error">Айди содержит недопустимые символы</span>
      <span v-if="hasError">Ошибка подписки</span>
    </div>
    <input
      type="text"
      class="search__input input"
      placeholder="Введите id пользователя"
      ref="input"
      v-model="v$.query.$model"
      @input="fetchUser"
      maxlength="100"
    >
    <div class="search__spinner" v-if="isLoading">
      <Spinner/>
    </div>
    <div class="search__error" v-if="showPlug">Никого не найдено</div>
    <div class="search__result" v-if="result">
      <UserPoster :authorUid="result.uid"/>
      <button class="btn btn-primary" v-if="!alreadySubscribed" @click="subscribe">Подписатся</button>
    </div>
  </div>
</template>
<script>
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { db } from '@/firebase'
import Spinner from '@/components/app/Spinner'
import UserPoster from '@/components/app/UserPoster'
import { mapState } from 'vuex'

export default {
  components: { Spinner, UserPoster },
  inject: ['increaseCount'],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      query: '',
      result: null,
      isLoading: false,
      showPlug: false,
      alreadySubscribed: false,
      hasError: null
    }
  },
  validations() {
    return {
      query: { mustContainLetters }
    }
  },
  methods: {
    focusInput() {
      this.$refs.input.focus()
    },
    async fetchUser() {
      if (this.v$.$error) return this.showPlug = false
      this.hasError = false
      this.showPlug = false
      this.isLoading = true
      this.result = null
      const userRef = db.ref(`users/${this.query}/info/main`)
      const userRes = await userRef.get()
      const result = userRes.val()
      if (result) {
        if (this.user.main.uid !== result.uid) {
          await this.checkIsSub(result.uid)
          this.result = result
        }
      } else {
        this.showPlug = true
      }
      this.isLoading = false
    },
    async subscribe() {
      const userRef = db.ref(`users/${this.user.main.uid}/subs/${this.result.uid}`)
      try {
        await userRef.set(1)
        const readersCountRef = db.ref(`users/${this.result.uid}/info/other/readersCount`)
        const readersCountRes = await readersCountRef.get()
        let readersCount = readersCountRes.val()
        readersCount += 1
        await readersCountRef.set(readersCount)
        this.alreadySubscribed = true
      } catch (error) {
        this.hasError = true
      }
    },
    async checkIsSub(uid) {
      const isSubscribedRef = db.ref(`users/${this.user.main.uid}/subs/${uid}`)
      const isSubscribedRes = await isSubscribedRef.get()
      const isSubscribed = isSubscribedRes.val()
      this.alreadySubscribed = !!isSubscribed
    }
  },
  async mounted() {
    this.focusInput()
  },
  computed: {
    ...mapState(['user'])
  }
}
function mustContainLetters(value) {
  return /^[a-zA-Z0-9-]+$/i.test(value)
}
</script>

<style lang="scss">
  @import "@/assets/scss/vars.scss";

  .search {
    &__input {
      width: 100%;
    }
    &__result {
      display: flex;
      justify-content: space-between;
      padding: $offset 0;
    }
    &__spinner,
    &__error {
      padding: $offset 0;
    }
    &__spinner {
      display: flex;
      justify-content: center;
    }
    &__error {
      font-size: 14px;
    }
  }
</style>

