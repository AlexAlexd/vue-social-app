<template>
  <div class="container">
    <div v-if="showLoader" class="main-spinner">
      <Spinner :big="true"/>
    </div>
    <div v-else>
      <Header v-if="$route.meta.header"/>
      <div class="content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"/>
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>
<script>
import { auth, db } from './firebase'
import Spinner from './components/app/Spinner'
import Header from './components/base/Header'
import { mapState, mapGetters } from 'vuex'

export default {
  components: { Header, Spinner },
  computed: {
    ...mapState(['showLoader'])
  }
}
</script>
<style lang="scss">
  .main-spinner {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    margin-top: 40px;
  }
</style>

