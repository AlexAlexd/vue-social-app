<template>
  <header class="header">
    <div class="header__content container">
      <div class="header__logo">{{title}}</div>
      <div class="header__nav">
        <router-link class="header__link" to="/">Подписки</router-link>
        <router-link class="header__link" to="/profile">Профиль</router-link>
      </div>
    </div>
  </header>
</template>
<script>

export default {
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
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    justify-content: center;
    display: flex;
    background: white;
    line-height: 30px;
    z-index: 100;
    &__content {
      display: flex;
      justify-content: space-between;
      @media screen and (max-width: $screen-sm-m) {
        justify-content: flex-start;
      }
    }
    &__logo {
      font-weight: 700;
      font-size: 18px;
      color: $primary;
    }
    &__link {
      margin-left: 20px;
      cursor: pointer;
      @media screen and (max-width: $screen-sm-m) {
        margin-left: 10px;
      }
    }
  }
</style>
