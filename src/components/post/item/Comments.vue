<template>
  <div class="comments">
    <div class="comments__list">
      <div class="spinner-wrapper" v-if="isCommentsFetching">
        <Spinner :big="true"/>
      </div>
      <h3 v-if="!isCommentsFetching && !comments.length" class="comments__plug">Нет комментариев</h3>
      <div v-else>
        <UserPoster
          v-for="(comment, i) in comments"
          :key="i"
          :authorUid="comment.authorUid"
          :time="comment.time"
          :text="comment.text"
        />
        <div ref="scrollEl"></div>
      </div>
    </div>
    <form class="comments__form" @submit.prevent="sendComment">
      <input
        type="text"
        class="comments__field input"
        placeholder="Введите ваш комментарий"
        ref="field"
        v-model="commentText"
        maxlength="100"
      >
      <button
        class="comments__send btn btn-primary"
        type="submit"
        :class="{disabled: isCommentSending}"
        v-if="iconMode"
      >
        <font-awesome-icon :icon="[ 'fas', 'check' ]"/>
      </button>
      <button
        v-else
        class="comments__send btn btn-primary"
        type="submit"
        :class="{disabled: isCommentSending}"
      >Отправить</button>
    </form>
  </div>
</template>
<script>
import { db } from '@/firebase'
import UserPoster from '@/components/app/UserPoster'
import Spinner from '@/components/app/Spinner'

import { mapState } from 'vuex';

export default {
  props: {
    postId: Number,
    uid: String
  },
  components: { UserPoster, Spinner },
  inject: ['increaseCount'],
  data() {
    return {
      comments: [],
      showPlug: false,
      commentText: '',
      isCommentSending: false,
      isCommentsFetching: false
    }
  },
  methods: {
    async fetchComments() {
      this.isCommentsFetching = true
      const commentsRes = await this.createRef('comments').get()
      const comments = commentsRes.val()
      if (comments) {
        this.comments = Object.values(comments)
        this.scrollToComment()
      }
      this.isCommentsFetching = false
    },
    async sendComment() {
      if (!this.commentText || this.isCommentSending) return
      this.isCommentSending = true
      const comment = {
        text: this.commentText,
        time: Date.now(),
        authorUid: this.user.main.uid
      }
      const commentRef = this.createRef('comments').push()
      await commentRef.set(comment)

      await this.increaseCount(`users/${this.uid}/posts/${this.postId}/commentsCount`)

      this.commentText = ''
      this.comments.push(comment)
      this.isCommentSending = false
      this.$emit('commentAdd')
      this.scrollToComment()
    },
    createRef(path) {
      return db.ref(`users/${this.uid}/posts/${this.postId}/${path}`)
    },
    scrollToComment() {
      this.$nextTick(() => this.$refs.scrollEl.scrollIntoView())
    }
  },
  async created() {
    await this.fetchComments()
  },
  mounted() {
    this.$refs.field.focus()
  },
  computed: {
    ...mapState(['user', 'iconMode'])
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";

  .comments {
    &__list {
      height: calc(50vh - 140px);
      overflow: auto;
      min-height: 200px;
    }
    &__form {
      display: flex;
      align-items: center;
    }
    &__field {
      margin-right: 10px;
    }
    &__plug {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: $font-weigth-r;
    }
  }
</style>
