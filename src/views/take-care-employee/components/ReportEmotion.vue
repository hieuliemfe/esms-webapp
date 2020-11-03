<template>
  <div v-if="data" class="reportSession">
    <div class="header-report">
      <h3>Report</h3>
    </div>
    <div class="body-report">
      <div class="emp-info">
        <div class="row">
          <div class="col-4">
            <img class="avatar center" :src="data.avatarUrl">
          </div>
          <div class="col-8">
            <div class="row">{{ data.fullname }}</div>
            <div class="row">{{ data.email }}</div>
            <div class="row">{{ data.phoneNumber }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import waves from '@/directive/waves'
import { mapState } from 'vuex'
export default {
  name: 'ReportEmotion',
  directives: { waves },
  data() {
    return {
      reportLoading: true,
      data: undefined
    }
  },
  computed: {
    ...mapState('employees', ['report'])
  },
  watch: {
    report: function(value) {
      this.getReport()
    }
  },
  created() {
    this.getReport()
  },
  mounted() {},
  methods: {
    getReport() {
      this.reportLoading = false
      this.data = this.report
    },
    msToStr(ms, _callCount = 1) {
      if (ms < 1000) {
        return ms + ' ms'
      }
      if (ms < 60000) {
        const secs = Math.floor(ms / 1000)
        _callCount += 1
        return secs + ` sec${secs === 1 ? '' : 's'}`
      }
      if (ms < 3600000) {
        const mins = Math.floor(ms / 60000)
        _callCount += 1
        return mins + ` min${mins === 1 ? '' : 's'}` + this.msToStr(ms % 60000, _callCount)
      }
      const hours = Math.floor(ms / 3600000)
      _callCount += 1
      return hours + ` hour${hours === 1 ? '' : 's'}` +
      this.msToStr(ms % 3600000, _callCount)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
