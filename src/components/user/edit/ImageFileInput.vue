<template>
  <div class="file">
    <div class="file__preview" @click="triggerFileInput" :class="{'input-error': error}">
      <Image :src="image" :big="true"/>
      <span>
        <font-awesome-icon :icon="[ 'fas', 'camera' ]"/>
      </span>
    </div>
    <input
      type="file"
      accept=".png, .jpg, .jfif, .jpeg, .webp"
      ref="fileInput"
      @change="onFileChange"
    >
    <div class="file__error error-text" v-if="error">{{error}}</div>
  </div>
</template>
<script>
import Image from '@/components/app/Image'

export default {
  props: {
    error: String,
    src: String
  },
  components: { Image },
  data() {
    return {
      image: ''
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    onFileChange(e) {
      const file = e.target.files[0]
      if (!file) return
      this.image = URL.createObjectURL(file)
      this.$emit('fileChange', file)
    }
  },
  mounted() {
    this.image = this.src
  }
}
</script>
<style lang="scss">
  .file {
    &__preview {
      position: relative;
      width: 100px;
      height: 100px;
      cursor: pointer;
      & > span {
        position: absolute;
        font-size: 20px;
        height: 36px;
        width: 36px;
        text-align: center;
        line-height: 33px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.2);
        color: white;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &__error {
      margin-top: 4px;
    }
  }
</style>

