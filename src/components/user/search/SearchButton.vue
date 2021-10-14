<template>
  <div class="search-btn">
    <button class="btn-secondary" @click="showSearchModal = true">
      <font-awesome-icon :icon="[ 'fas', 'search' ]"/>
      <span>Поиск по id</span>
    </button>
    <Modal v-if="showSearchModal" name="Поиск" @close="showSearchModal = false">
      <Search/>
    </Modal>
  </div>
</template>
<script>
import Search from './Search'
import Modal from '@/components/app/Modal'

export default {
  components: { Modal, Search },
  data() {
    return {
      showSearchModal: false
    }
  }
}
</script>
<style lang="scss">
  .search-btn button span {
    margin-left: 5px;
    cursor: pointer;
  }
</style>
