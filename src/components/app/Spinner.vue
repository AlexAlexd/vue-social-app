<template>
  <div class="spinner" :class="{ big: big }"></div>
</template>
<script>
export default {
  props: {
    big: Boolean
  }
}
</script>

<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid $border-color;
    background: white;
    border-radius: 50%;
    border-top: 3px solid $primary;
    animation: spin 0.8s linear infinite;
    &.big {
      width: 30px;
      height: 30px;
      border-width: 3px;
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
