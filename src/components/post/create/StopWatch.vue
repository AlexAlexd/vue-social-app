<template>
  <div class="stopwatch">{{formatTime(min)}}:{{formatTime(sec)}}:{{formatTime(nanosec)}}</div>
</template>
<script>
export default {
  data() {
    return {
      interval: null,
      nanosec: 0,
      sec: 0,
      min: 0
    }
  },
  methods: {
    startTimer() {
      this.interval = setInterval(() => this.nanosec++, 10)
    },
    stopTimer() {
      clearInterval(this.interval)
    },
    resetTimer() {
      this.nanosec = 0
      this.min = 0
      this.sec = 0
    }
  },
  mounted() {
    this.startTimer()
  },
  unmounted() {
    this.stopTimer()
    this.resetTimer()
  },
  watch: {
    nanosec(val) {
      if (val > 99) {
        this.nanosec = 0
        this.sec++
      } else if (val > 6000) {
        this.sec = 0
        this.min++
      }
    }
  },
  computed: {
    formatTime() {
      return num => num < 10 ? `0${num}` : num
    }
  }
}
</script>
