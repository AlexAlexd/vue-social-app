<template>
  <div class="post" v-if="post">
    <div class="post__header">
      <UserPoster :authorUid="post.authorUid" :time="post.time" :text="post.text"/>
    </div>
    <div class="post__content">
      <div v-if="post.file">
        <Player :src="post.file"/>
      </div>
    </div>
    <div class="post__stats">
      <div class="post__stat" @click="isCommentsModalShow = true">
        <font-awesome-icon :icon="[ 'far', 'comment' ]"/>
        {{commentsCount === 0 ? '' : commentsCount}}
      </div>
    </div>
    <Modal name="Комментарии" v-if="isCommentsModalShow" @close="isCommentsModalShow = false">
      <Comments :postId="post.index" :uid="post.authorUid" @commentAdd="commentsCount++"/>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/app/Modal'
import UserPoster from '@/components/app/UserPoster'
import Comments from './Comments'
import Player from './Player'

export default {
  components: { Image, Modal, Comments, UserPoster, Player },
  props: {
    post: Object
  },
  data() {
    return {
      isCommentsModalShow: false,
      commentsCount: 0
    }
  },
  mounted() {
    this.commentsCount = this.post.commentsCount
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .post {
    margin-bottom: $offset;
    font-size: 14px;
    padding: $offset;
    border: 1px solid $border-color;
    border-radius: $border-radius-s;
    &__header {
      display: flex;
      align-items: center;
    }
    &__content {
      margin: $offset 0 $offset 0;
    }
    &__stats {
      display: flex;
    }
    &__stat {
      cursor: pointer;
      color: $secondary;
      margin-right: $offset * 3;
      display: flex;
      & > svg {
        margin-right: $offset;
        font-size: 20px;
      }
    }
  }
</style>
