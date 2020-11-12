<template>
  <div v-if="data" class="report">
    <div class="body-report">
      <div class="row">
        <div class="col-4">
          <img class="avatarReport" :src="data.avatarUrl">
        </div>
        <div class="col-8">
          <div class="row">{{ data.fullname }}</div>
          <div class="row">{{ data.email }}</div>
          <div class="row">{{ data.phoneNumber }}</div>
        </div>
      </div>
      <div>
        <!-- <span>From: ... To: ...</span><br> -->
        <span>Total session: {{ data.totalSessions }}</span>
        <table class="table table-bordered">
          <thead class="thead-light">
            <tr>
              <!-- <th scope="col">#</th> -->
              <th scope="col">Conditions</th>
              <th scope="col">Number of Session</th>
              <th scope="col">Total Percentage</th>
            </tr>
          </thead>
          <tbody v-for="(row, index) in data.report" :key="index">
            <tr v-if="row.count!=0">
              <!-- <th scope="row">{{ index }}</th> -->
              <td>{{ convertExpression(row.condition) }}</td>
              <td>{{ row.count }}</td>
              <td>{{ parseFloat(row.percentage).toFixed(2) + "%" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Negative -->
      <!-- <button type="button" class="btn btn-dark" @click="isHidden = !isHidden">
        Negative Criterias
      </button>
      <div v-if="isHidden && list">
        <table class="table" style="margin-top:10px;">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Condition</th>
              <th scope="col">Limit Session</th>
              <th scope="col">Limit Percentage</th>
            </tr>
          </thead>
          <tbody v-for="(row, index) in list" :key="index">
            <tr>
              <th>{{ index }}</th>
              <td>...</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div> -->
    </div>
  </div>
</template>
<script>
import { getCriterias } from '@/api/negative-emotion'
import waves from '@/directive/waves'
import { mapState } from 'vuex'
export default {
  name: 'ReportEmotion',
  directives: { waves },
  data() {
    return {
      isHidden: false,
      reportLoading: true,
      data: undefined
    }
  },
  computed: {
    ...mapState('employees', ['reportList', 'reportIndex'])
  },
  watch: {
    reportList: function(value) {
      this.getReportList()
    },
    reportIndex: function(value) {
      this.getReportList()
    }
  },
  created() {
    this.getReportList()
    this.getCriterias()
  },
  mounted() {},
  methods: {
    getReportList() {
      this.reportLoading = false
      this.data = this.reportList[this.reportIndex]
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
        return (
          mins +
          ` min${mins === 1 ? '' : 's'}` +
          this.msToStr(ms % 60000, _callCount)
        )
      }
      const hours = Math.floor(ms / 3600000)
      _callCount += 1
      return (
        hours +
        ` hour${hours === 1 ? '' : 's'}` +
        this.msToStr(ms % 3600000, _callCount)
      )
    },
    getCriterias() {
      getCriterias().then(response => {
        this.list = response.message
      })
    },
    convertExpression(condition) {
      condition = condition.split(' ').join('')
      var tmp = condition.match(/\[[0||4||6]\]\/\[0,4,6\]/g)
      tmp.forEach(element => {
        var emotion = element.match(/\[[0||4||6]\]/g)[0].match(/[0||4||6]/g)[0]
        console.log(emotion)
        var string = ''
        switch (parseInt(emotion)) {
          case 0:
            string = 'Percentage of angry'
            break
          case 4:
            string = 'Percentage of neutral'
            break
          case 6:
            string = 'Percentage of happy'
            break
        }
        console.log(element)
        console.log(string)
        condition = condition.replace(element, string)
      })
      condition = condition.split('&&').join(' and ')
      condition = condition.split('>=').join(' greater and equal than ')
      condition = condition.split('<=').join(' less and equal than ')
      condition = condition.split('>').join(' greater than ')
      condition = condition.split('<').join(' less than ')
      var percents = condition.match(/0\.[0-9]*/g)
      percents.forEach(element => {
        var percent = parseFloat(parseFloat(element) * 100)
        condition = condition.replace(element, percent + '%')
      })
      return condition
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
