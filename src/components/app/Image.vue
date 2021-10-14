<template>
  <div class="image" :class="{ big: big, border: !src }">
    <img v-if="src" :src="src" :class="{ mask: mask, landscape: landscape }" @load="onImageLoad">
    <div v-else class="image__plug">
      <font-awesome-icon :icon="[ 'fas', 'user' ]"/>
    </div>
  </div>
</template>

<script>
import Spinner from './Spinner'
export default {
  components: { Spinner },
  props: {
    src: String,
    big: Boolean
  },
  data() {
    return {
      mask: true,
      landscape: false
    }
  },
  watch: {
    src() {
      this.mask = true
    }
  },
  methods: {
    onImageLoad(e) {
      const img = e.target
      this.landscape = img.width > img.height
      this.mask = false
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";

  .image {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 30px;
    height: 30px;
    background-color: white;
    &__plug {
      position: absolute;
      font-size: 20px;
      color: $border-color;
    }
    & > img {
      height: auto;
      width: 100%;
      -webkit-user-drag: none;
      user-select: none;
      &.mask {
        opacity: 0;
      }
      &.landscape {
        height: 100%;
        width: auto;
      }
    }
    &.big {
      width: 100px;
      height: 100px;
    }
    &.border {
      border: 1px solid $border-color;
    }
  }
</style>

