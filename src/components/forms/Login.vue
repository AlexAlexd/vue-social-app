<template>
  <div class="tabs">
    <ul class="tabs__links">
      <li
        class="tabs__link"
        @click="isLogin = true"
        :class="{'tabs__link-selected': isLogin === true}"
      >Войти</li>
      <li
        class="tabs__link"
        @click="isLogin = false"
        :class="{'tabs__link-selected': isLogin === false}"
      >Регистрация</li>
    </ul>
    <form class="form" @submit.prevent="login">
      <div class="form__error error-text" v-if="error">{{error}}</div>
      <Field
        v-model="email"
        type="text"
        placeholder="Email"
        autocomplete="email"
        class="form__field"
        :error="v$.email.$error ? 'Неверный email' : ''"
      />
      <Field
        v-model="password"
        type="password"
        placeholder="Пароль"
        autocomplete="current-password"
        class="form__field"
        :error="v$.password.$error ? 'Пароль должен содержать минимум 6 символов': ''"
      />
      <button
        class="form__btn btn btn-primary"
        :class="{ 'disabled': isLoading }"
        type="submit"
      >{{isLogin ? 'Войти' : 'Регистрация'}}</button>
    </form>
  </div>
</template>
<script>
import { auth, db } from '@/firebase'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import Field from './Field'
import { mapMutations } from 'vuex'
export default {
  components: { Field },
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      error: '',
      isLogin: true
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    return {
      email: { required, email },
      password: { required, minLength: minLength(6) }
    }
  },
  watch: {
    isLogin(val) {
      this.error = ''
    }
  },
  methods: {
    async login() {
      this.v$.$validate()
      if (this.v$.$error) return
      this.isLoading = true
      let user = null
      try {
        if (this.isLogin) {
          const data = await auth.signInWithEmailAndPassword(this.email, this.password)
          const uid = data.user.uid
          const userRef = db.ref(`users/${uid}/info`)
          const userRes = await userRef.get()
          user = userRes.val()
        } else {
          const data = await auth.createUserWithEmailAndPassword(this.email, this.password)
          const uid = data.user.uid
          const userData = {
            info: {
              main: {
                name: 'Аноним',
                image: '',
                uid
              },
              other: {
                readersCount: 0,
                postsCount: 0
              }
            },
            lastId: 0
          }
          const userRef = db.ref(`users/${uid}`)
          await userRef.set(userData)
          user = userData
        }
        // this.SET_USER(user)
        this.$router.replace({ name: 'profile' })
      } catch (err) {
        this.error = 'Ошибка аутентификации'
        this.isLoading = false
      }
      this.isLoading = false
    },
    ...mapMutations(['SET_USER'])
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";

  .tabs {
    max-width: 300px;
    width: 100%;
    &__links {
      display: flex;
    }
    &__link {
      width: 50%;
      height: 25px;
      line-height: 25px;
      border-bottom: 1px solid transparent;
      text-align: center;
      cursor: pointer;
      &-selected {
        border-bottom: 1px solid $primary;
      }
    }
  }
</style>
