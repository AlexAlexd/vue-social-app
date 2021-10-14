<template>
  <div class="feed">
    <div class="feed__users">
      <div
        class="feed__user"
        v-for="(sub, i) in subs"
        :key="i"
        @click="selectUser(i)"
        :class="{selected: uid === subs[i].uid}"
      >
        <UserPoster :authorUid="sub.uid" :image="sub.image"/>
      </div>
    </div>
    <Posts :uid="uid" v-if="uid"/>
  </div>
</template>
<script>
import { db } from '@/firebase'
import UserPoster from '@/components/app/UserPoster'
import Posts from '@/components/post/Posts'
import { mapState } from 'vuex'
export default {
  components: { UserPoster, Posts },
  data() {
    return {
      subs: [],
      uid: '',
      subsRef: null
    }
  },
  async activated() {
    this.subs = []
    this.uid = ''
    this.subsRef = db.ref(`users/${this.user.main.uid}/subs`)
    await this.fetchSubs()
  },
  methods: {
    selectUser(idx) {
      this.uid = this.subs[idx].uid
    },
    async fetchSubs() {
      let isFirstUser = true
      this.subsRef.on('child_added', async (snap) => {
        const uid = snap.key
        const userRes = await db.ref(`users/${uid}/info/main`).get()
        const user = userRes.val()
        this.subs.push(user)
        if (isFirstUser) {
          this.selectUser(0)
          isFirstUser = false
        }
      })
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";

  .feed {
    &__users {
      display: flex;
      flex-wrap: wrap;
    }
    &__user {
      padding: $offset;
      cursor: pointer;
      width: fit-content;
      border-radius: $border-radius-s;
      &.selected {
        background: lighten($border-color, 2%);
      }
    }
  }
</style>

