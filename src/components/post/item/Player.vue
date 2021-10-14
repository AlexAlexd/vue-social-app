<template>
  <div class="player">
    <button class="player__btn" @click="togglePlay">
      <font-awesome-icon :icon="[ 'fas', 'play' ]" v-if="isPaused"/>
      <font-awesome-icon :icon="[ 'fas', 'pause' ]" v-else/>
    </button>
    <div class="vertical-center offset">
      {{formatTime(currentTime)}}
      <div class="track vertical-center offset" @click="seek">
        <div class="seek" :style="{width: trackWidth + 'px'}">
          <div class="progress" :style="{width: progressWidth + 'px'}"></div>
        </div>
      </div>
      {{formatTime(duration)}}
    </div>
    <div class="player__mute" v-if="!getIconMode">
      <button class="player__btn" @click="toggleMute">
        <font-awesome-icon :icon="[ 'fas', 'volume-mute' ]" v-if="isMuted"/>
        <font-awesome-icon :icon="[ 'fas', 'volume-up' ]" v-else/>
      </button>

      <div class="track vertical-center offset" @click="volumeSeek">
        <div class="seek" :style="{width: volumeTrackWidth + 'px'}">
          <div class="progress" :style="{width: volumeProgressWidth + 'px'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    src: String
  },
  data() {
    return {
      isPaused: true,
      isMuted: false,
      audio: null,
      currentTime: 0,
      duration: 0,
      progressWidth: 0,
      trackWidth: 120,
      volumeProgressWidth: 0,
      volumeTrackWidth: 60
    }
  },
  mounted() {
    this.audio = new Audio(this.src)
    this.audio.onended = () => this.isPaused = true
    this.audio.onloadedmetadata = async e => {
      this.duration = Math.floor(this.audio.duration)
    }
    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime
      this.updateLineWidth()
    }
    this.volumeToPx()
  },
  methods: {
    toggleMute() {
      this.audio.muted = !this.audio.muted
      this.isMuted = this.audio.muted
    },
    async togglePlay() {
      if (this.audio.paused) {
        await this.audio.play()
      } else {
        this.audio.pause()
      }
      this.isPaused = this.audio.paused
    },
    formatTime(time) {
      const min = Math.floor((time % 3600) / 60)
      const sec = Math.floor(time % 60)
      const res = `${min}:${sec < 10 ? '0' : ''}${sec}`

      return res
    },
    updateLineWidth() {
      this.progressWidth = this.audio.currentTime / this.duration * this.trackWidth
    },
    seek(e) {
      const px = e.offsetX
      const sec = px / this.trackWidth * this.duration
      this.audio.currentTime = sec
    },
    volumeSeek(e) {
      const px = e.offsetX
      this.volumeProgressWidth = px
      this.audio.volume = px / this.volumeTrackWidth
    },
    volumeToPx() {
      const volumePercent = this.audio.volume * 100
      this.volumeProgressWidth = this.volumeTrackWidth / 100 * volumePercent
    }
  },
  computed: {
    ...mapGetters(['getIconMode'])
  }
}
</script>
<style lang="scss">
  @import "@/assets/scss/vars.scss";
  .player {
    display: flex;
    &__btn {
      cursor: pointer;
    }
    &__mute {
      display: flex;
    }
  }
  .offset {
    margin: 0 $offset;
  }
  .vertical-center {
    display: flex;
    align-items: center;
  }
  .track {
    height: 100%;
    cursor: pointer;
  }
  .seek {
    height: 4px;
    background: $border-color;
    position: relative;
    overflow: hidden;
    border-radius: $border-radius-m;
  }
  .progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 50%;
    background-color: $primary;
  }
</style>
