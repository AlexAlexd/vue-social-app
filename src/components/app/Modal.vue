<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal__header">
        <h3 class="modal__name">{{name}}</h3>
        <button class="modal__close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal__body">
        <slot/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    name: String
  },
  mounted() {
    document.body.classList.add('no-scroll')
  },
  unmounted() {
    document.body.classList.remove('no-scroll')
  },
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .modal {
    max-width: 400px;
    background-color: white;
    margin: 5vh auto;
    @media screen and (max-width: $screen-sm-m) {
      margin: 5vh 10px;
      max-width: 100%;
    }
    &__header {
      border-bottom: 1px solid $border-color;
      padding: 3px 5px;
      display: flex;
      justify-content: space-between;
    }
    &__name {
      flex: 1;
      text-align: center;
      margin-left: 30px;
      font-weight: $font-weigth-m;
      line-height: 30px;
      font-size: 16px;
    }
    &__close {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      font-size: 27px;
    }
    &__body {
      padding: $offset;
    }
  }
</style>


