<template>
  <div class="poster">
    <div class="poster__header">
      <Image :src="authorInfo.image"/>
      <div class="poster__info">
        <div class="poster__author">{{authorInfo.name}}</div>
        <div class="poster__time" v-if="time">{{this.formatTime(time)}}</div>
      </div>
    </div>
    <div class="poster__content" v-if="text" v-html="formattedText"></div>
  </div>
</template>
<script>
import { db } from '@/firebase'
import Image from './Image'

export default {
  components: { Image },
  props: {
    authorUid: String,
    time: Number,
    text: String,
  },
  data() {
    return {
      authorInfo: {}
    }
  },
  methods: {
    formatTime(timestamp) {
      const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
      const date = new Date(timestamp)
      const day = date.getDate()
      const month = months[date.getMonth()]
      const hours = date.getHours()
      const baseMinutes = date.getMinutes()
      const minutes = baseMinutes < 10 ? `0${baseMinutes}` : baseMinutes

      return `${day} ${month}, ${hours}:${minutes}`
    },
    async fetchAuthorInfo() {
      const uid = this.authorUid
      const authorInfoRes = await db.ref(`users/${this.authorUid}/info/main`).get()
      const authorInfo = authorInfoRes.val()
      this.authorInfo = authorInfo
    }
  },
  async created() {
    await this.fetchAuthorInfo()
  },
  computed: {
    formattedText() {
      let text = this.text
      text = text.replace(/\n/g, ' <br /> ')
      const links = text.match(/\bhttps?:\/\/\S+/gi)
      if (links) {
        links.forEach(link => {
          const linkHTML = `<a href="${link}" target="_blank" class="link"> ${link} </a>`
          if (!text.includes(linkHTML)) {
            text = text.replaceAll(link, linkHTML)
          }
        })
      }

      return text
    }
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";

  .poster {
    &__header {
      display: flex;
      align-items: center;
    }
    &__info {
      font-size: $font-size-m;
      display: flex;
      flex-direction: column;
      line-height: 1;
      justify-content: space-between;
      height: 30px;
      margin-left: $offset;
    }
    &__author {
      font-weight: 700;
    }
    &__time {
      font-size: $font-size-s;
      color: $secondary;
    }
    &__content {
      margin: $offset - 3px 0 $offset - 3px 0;
      line-break: anywhere;
    }
  }
</style>

