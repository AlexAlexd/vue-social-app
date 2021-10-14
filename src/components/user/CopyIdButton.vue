<template>
  <div class="copy-id-button">
    <button
      class="btn-secondary"
      @click="copyId"
      :class="{ active: isCopy }"
    >{{isCopy ? 'Скопировано' : 'Копировать id'}}</button>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isCopy: false
    }
  },
  methods: {
    copyId() {
      if (this.isCopy) return
      navigator.clipboard.writeText(this.user.main.uid);
      this.isCopy = true
      setTimeout(() => {
        this.isCopy = false
      }, 1000);
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .copy-id-button {
    & > button {
      &.active {
        cursor: default;
        color: $primary;
      }
    }
  }
</style>
