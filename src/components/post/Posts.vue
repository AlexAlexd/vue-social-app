<template>
  <div class="posts">
    <h3 v-if="showPlug" class="posts__plug">Нет постов</h3>
    <div class="posts__list" v-else>
      <Post v-for="(post) in posts" :key="JSON.stringify(post)" :post="post"/>
      <div ref="plug"></div>
      <div class="spinner-wrapper" v-if="isLoading">
        <Spinner :big="true"/>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from '@/firebase'
import Post from './item/Post'
import Spinner from '@/components/app/Spinner'
export default {
  components: { Post, Spinner },
  props: {
    uid: String,
    newPost: Object
  },
  data() {
    return {
      lastId: undefined,
      posts: [],
      itemsCount: 5,
      isLoading: true,
      showPlug: false
    }
  },
  watch: {
    newPost(val) {
      this.showPlug = false
      this.isLoading = false
      this.posts.unshift(val)
    },
    uid(val) {
      this.lastId = undefined
      this.posts = []
      this.showPlug = false
      this.fetchPosts()
    }
  },
  methods: {
    async loadMore() {
      if (this.lastId < 0) return

      this.isLoading = true
      const end = this.lastId - this.itemsCount
      const postsPromises = []

      for (let i = this.lastId; i > end; i--) {
        if (i > 0) {
          const postPromise = db.ref(`users/${this.uid}/posts/${i}`).get()
          postsPromises.push(postPromise)
        }
      }

      const snaps = await Promise.all(postsPromises)
      const receivedPosts = snaps.map(post => post.val())

      if (receivedPosts.length !== 0) {
        for (const post of receivedPosts) {
          this.posts.push(post)
        }
        this.lastId = end
      }

      this.isLoading = false
    },
    async fetchLastId() {
      const lastIdRef = db.ref(`users/${this.uid}/lastId`)
      const lastidRes = await lastIdRef.get()
      const lastId = lastidRes.val()

      this.lastId = lastId
    },
    async fetchPosts() {
      this.isLoading = true
      await this.fetchLastId()
      if (!this.lastId) {
        this.showPlug = true
      } else {
        await this.loadMore()
      }
    },
    onScroll() {
      if (!this.posts.length) return
      const top = this.$refs.plug.getBoundingClientRect().top
      if (top === window.innerHeight) {
        this.loadMore()
      }
    }
  },
  created() {
    this.fetchPosts()
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>
<style lang="scss">
  .posts {
    &__list {
      margin-top: 10px;
    }
    &__plug {
      text-align: center;
      padding: 30px 0;
      font-weight: 300;
    }
  }
</style>

