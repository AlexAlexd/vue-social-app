<template>
  <div class="profile" v-if="user">
    <div class="profile__header">
      <div class="profile__image">
        <Image v-if="user.main" :src="user.main.image" :big="true"/>
      </div>
      <div class="profile__info">
        <div class="profile__left">
          <div class="profile__name">{{ user.main.name }}</div>
          <div class="profile__stats">
            <span class="profile__stat">
              <span>{{ user.other.readersCount }}</span>
              Читателей
            </span>
            <span class="profile__stat">
              <span>{{ user.other.postsCount }}</span>
              Постов
            </span>
          </div>
          <CopyIdButton/>
          <SearchButton/>
        </div>
        <div class="profile__right">
          <button class="profile__logout btn btn-danger" @click="showLogoutModal = true">Выйти</button>
          <button class="profile__edit btn" @click="showEditModal = true">Редактировать</button>
        </div>
      </div>
    </div>
    <div class="profile__body">
      <CreatePost @create="onPostCreate"/>
    </div>
    <Posts :uid="user.main.uid" :newPost="newPost"/>
    <Modal v-if="showEditModal" name="Редактировать профиль" @close="showEditModal = false">
      <Edit @saved="showEditModal = false"/>
    </Modal>
    <Modal
      v-if="showLogoutModal"
      name="Вы действительно хотите выйти?"
      @close="showLogoutModal = false"
    >
      <div class="modal-buttons">
        <button class="btn btn-danger" @click="showLogoutModal = false">Нет</button>
        <button class="btn btn-primary" @click="logOut">Да</button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { auth } from '@/firebase'
import Image from '@/components/app/Image'
import Modal from '@/components/app/Modal'
import SearchButton from '@/components/user/search/SearchButton'
import CopyIdButton from '@/components/user/CopyIdButton'
import Edit from '@/components/user/edit/Edit'
import CreatePost from '@/components/post/create/CreatePost'
import Posts from '@/components/post/Posts'
import { mapState, mapMutations } from 'vuex'

export default {
  components: { Image, CopyIdButton, Modal, Edit, CreatePost, Posts, SearchButton },
  data() {
    return {
      showEditModal: false,
      showLogoutModal: false,
      newPost: null
    }
  },
  methods: {
    async logOut() {
      await auth.signOut()
      this.SET_USER(null)
      this.showLogoutModal = false
      this.$router.replace({ name: 'auth' })
    },
    onPostCreate(post) {
      this.user.other.postsCount++
      this.newPost = post
    },
    ...mapMutations(['SET_USER'])
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .profile {
    margin-top: 20px;
    &__header {
      display: flex;
      @media screen and (max-width: $screen-sm-s) {
        flex-direction: column;
      }
    }
    &__image {
      margin-right: $offset;
    }
    &__info {
      display: flex;
      width: 100%;
      justify-content: space-between;
      @media screen and (max-width: $screen-sm-l) {
        flex-direction: column;
      }
    }
    &__name {
      font-weight: 700;
    }
    &__stats {
      margin-top: 4px;
    }
    &__stat {
      &:first-child {
        margin-right: $offset;
      }
      color: $secondary;
      & > span {
        color: black;
      }
    }
    &__edit {
      border: 1px solid $border-color;
    }
    &__body {
      margin-top: 40px;
      @media screen and (max-width: $screen-sm-s) {
        margin-top: 20px;
      }
    }
    &__right {
      @media screen and (max-width: $screen-sm-s) {
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>

