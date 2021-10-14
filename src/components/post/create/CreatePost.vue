<template>
  <div class="create">
    <div class="create__body">
      <div v-if="isRecordingView">
        <StopWatch/>
        <div class="create__message">Максимальная длительность {{maxVoiceDuration / 1000}} секунд</div>
      </div>
      <div v-else>
        <textarea
          class="create__input"
          placeholder="Введите текст поста"
          v-model="postText"
          maxlength="200"
        />
      </div>
    </div>
    <div class="modal-buttons">
      <div v-if="isRecordingView" class="create__buttons">
        <button class="create__button btn btn-danger" @click="discardRecording" v-if="getIconMode">
          <font-awesome-icon :icon="[ 'fas', 'times' ]"/>
        </button>
        <button class="create__button btn btn-danger" @click="discardRecording" v-else>Отмена</button>

        <button class="create__button btn btn-primary" @click="uploadRecording" v-if="getIconMode">
          <font-awesome-icon :icon="[ 'fas', 'check' ]"/>
        </button>
        <button class="create__button btn btn-primary" @click="uploadRecording" v-else>Опубликовать</button>
      </div>
      <div v-else class="create__buttons">
        <button
          v-if="getIconMode"
          class="create__button btn btn-primary"
          @click="publish"
          :class="{disabled: isLoading}"
        >
          <font-awesome-icon :icon="[ 'fas', 'check' ]"/>
        </button>
        <button
          v-else
          class="create__button btn btn-primary"
          @click="publish"
          :class="{disabled: isLoading}"
        >Опубликовать</button>
        <button class="create__button btn btn-primary" @click="startRecording">
          <span>
            <font-awesome-icon :icon="[ 'fas', 'microphone' ]"/>
          </span>
          <span v-if="!getIconMode">Записать</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import ysFixWebmDuration from 'fix-webm-duration'
import { db, storage } from '@/firebase'
import StopWatch from './StopWatch'
import { mapState, mapGetters } from 'vuex';

export default {
  components: { StopWatch },
  inject: ['increaseCount'],
  emits: ['create'],
  data() {
    return {
      postText: '',
      isLoading: false,
      isRecordingView: false,
      mediaRecorder: null,
      stream: null,
      saveRecording: false,
      file: null,
      canPublish: false,
      canPublishTimeout: null,
      maxDurationTimeout: null,
      maxVoiceDuration: 30000
    }
  },
  methods: {
    setWatchVoiceDuration() {
      this.maxDurationTimeout = setTimeout(() => {
        this.discardRecording()
      }, this.maxVoiceDuration)
    },
    clearWatchVoiceDuration() {
      clearTimeout(this.maxDurationTimeout)
    },
    async publish() {
      if (!this.postText.trim()) return
      this.isLoading = true
      await this.uploadPost()
      this.postText = ''
      this.isLoading = false
    },
    async uploadPost() {
      const uid = this.user.main.uid
      const index = await this.increaseCount(`users/${uid}/lastId`)
      const postRef = db.ref(`users/${uid}/posts/${index}`)
      let audioUrl = null
      if (this.file) {
        const audioRef = storage.ref(`users/${uid}/audio/${index}`)
        await audioRef.put(this.file)
        audioUrl = await audioRef.getDownloadURL()
      }
      const post = {
        text: this.postText || null,
        file: audioUrl,
        time: Date.now(),
        index,
        authorUid: uid,
        commentsCount: 0
      }
      await postRef.set(post)
      await this.increaseCount(`users/${uid}/info/other/postsCount`)

      this.$emit('create', post)
    },
    async startRecording() {
      this.isRecordingView = true
      this.setWatchVoiceDuration()
      this.canPublishTimeout = setTimeout(() => this.canPublish = true, 1000)

      if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
        alert('Невозможно начать запись')
        return
      }

      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(this.stream)
      let chunks = []

      this.mediaRecorder.ondataavailable = e => chunks.push(e.data)

      this.mediaRecorder.onstop = async () => {
        clearTimeout(this.canPublishTimeout)
        if (!this.canPublish) return
        this.canPublish = false
        if (this.saveRecording) {
          const duration = Date.now() - startTime
          const blob = new Blob(chunks, { type: 'audio/webm' })
          this.file = await ysFixWebmDuration(blob, duration, { logger: false })
          chunks = []
          await this.uploadPost()
        } else {
          chunks = []
        }
        this.file = null
      }
      const startTime = Date.now();
      this.mediaRecorder.start()
    },
    discardRecording() {
      this.saveRecording = false
      this.stopRecording()
    },
    uploadRecording() {
      this.saveRecording = true
      this.stopRecording()
    },
    stopRecording() {
      this.isRecordingView = false
      this.clearWatchVoiceDuration()
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') return
      this.mediaRecorder.stop()
      this.stream.getTracks().forEach(track => track.stop())
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['getIconMode'])
  }
}
</script>

<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .create {
    padding: $offset;
    border: 1px solid $border-color;
    border-radius: $border-radius-s;
    &__message {
      font-size: $font-size-m;
    }
    &__body {
      height: 40px;
    }
    &__input {
      width: 100%;
      resize: none;
      font-size: $font-size-m;
    }
    &__button {
      margin-left: $offset;
      & > span {
        margin-right: 6px;
      }
      &:first-child {
        margin-left: 0;
      }
    }
  }
</style>
