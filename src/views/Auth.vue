<template>
  <div class="auth">
    <h1 class="auth__logo">{{title}}</h1>
    <div class="auth__content">
      <Login/>
    </div>
  </div>
</template>
<script>
import Login from '@/components/forms/Login'
export default {
  components: { Login },
  data() {
    return {
      title: ''
    }
  },
  created() {
    this.title = process.env.VUE_APP_TITLE
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";

  .auth {
    padding-top: 100px;
    &__logo {
      text-align: center;
      font-size: 72px;
      color: $primary;
      font-weight: $font-weigth-m;
      margin-bottom: 100px;
    }
    &__content {
      display: flex;
      justify-content: center;
    }
  }
</style>
