<template>
  <div v-if="data" class="reportSession">
    <div class="empReport">
      <div class="status">
        <!-- icon -->
        <div v-if="data.info.emotion_level < 0" class="iconSession">
          <i class="el-icon-error negative" />
        </div>
        <div v-if="data.info.emotion_level > 0" class="iconSession">
          <i class="el-icon-success positive" />
        </div>
        <div v-if="data.info.emotion_level === 0" class="iconSession">
          <i class="el-icon-minus neutral" />
        </div>
        <!-- status -->
        <div class="statusSession">
          <span>{{ severe }}</span>
        </div>
      </div>
      <!-- id session -->
      <div class="reportName">
        <span> Session {{ data.id }} </span>
      </div>
      <span style="font-size: 12px">{{ sessionStart }}</span>
      <div class="task">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" />
        </div>
      </div>
      <div class="task">
        <span style="color:red">WARNING STATISTIC</span>
      </div>
      <div class="info">
        <table class="table table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Warning</th>
              <th scope="col">Times</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Angry</td>
              <td>{{ data.info.angry_warning }}</td>
              <td>{{ msToStr(data.info.angry_duration_warning_max) }}</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Leaving the working space</td>
              <td>{{ data.info.no_face_detected_warning }}</td>
              <td>{{ msToStr(data.info.no_face_detected_duration_warning_max) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="task">
        <span style="color:#0052cc">EMOTION STATISTIC</span>
      </div>
      <div class="info">
        <table class="table table-bordered table-striped">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Emotions</th>
              <th scope="col">Duration</th>
              <th scope="col">Period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Negative</td>
              <td>{{ msToStr(data.info.negative_emotions_duration) }}</td>
              <td>{{ data.info.negative_emotions_period_count }}</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Neutral</td>
              <td>{{ msToStr(data.info.neutral_emotions_duration) }}</td>
              <td>{{ data.info.neutral_emotion_period_count }}</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Positive</td>
              <td>{{ msToStr(data.info.positive_emotions_duration) }}</td>
              <td>{{ data.info.positive_emotions_period_count }}</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Leaving the working space</td>
              <td>{{ msToStr(data.info.no_face_detected_duration) }}</td>
              <td>{{ data.info.no_face_detected_period_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="empInfo">
      <div class="info">
        <img class="avatar" :src="avatarUrl">
      </div>
      <div class="info">
        <span><b>Bank Teller</b></span>
      </div>
      <div class="info">
        <span>Le Nguyen An Khang</span>
      </div>
    </div>
  </div>
</template>
<script>
import PieChart from './PieChart'
import waves from '@/directive/waves'
import { mapState } from 'vuex'
import { getSessionById } from '@/api/sessions'
const pieChartData = {
  valueEmo: [8, 2, '-', 360, 110, '-', '-', 40]
}
export default {
  name: 'SessionReport',
  components: { PieChart },
  directives: { waves },
  data() {
    return {
      pieChartData: pieChartData,
      avatarUrl: 'https://scontent.fsgn1-1.fna.fbcdn.net/v/t1.0-9/71288718_2518740211691156_145778560190119936_n.jpg?_nc_cat=109&ccb=2&_nc_sid=09cbfe&_nc_ohc=C8kNpWM0k_oAX8AG9Gk&_nc_ht=scontent.fsgn1-1.fna&oh=0360a8096ba2d73d6a6e2da7ae1c5cdc&oe=5FBFF578',
      reportLoading: true,
      data: undefined
    }
  },
  computed: {
    ...mapState('sessions', ['sessionId']),
    sessionStart() {
      return this.data ? new Date(this.data.sessionStart) : null
    },
    severe() {
      const emotion_level = this.data.info.emotion_level
      if (emotion_level < 0) {
        // neg
        if (emotion_level < 0 && emotion_level > -0.25) {
          return 'Lowly Negative'
        } else if (emotion_level < -0.25 && emotion_level > -0.5) {
          return 'Medium Negative'
        } else if (emotion_level < -0.5 && emotion_level > -0.75) {
          return 'Highly Negative'
        } else {
          return 'Extremely Negative'
        }
      } else if (emotion_level > 0) {
        // pos
        if (emotion_level > 0 && emotion_level < 0.25) {
          return 'Lowly Positive'
        } else if (emotion_level > 0.25 && emotion_level < 0.5) {
          return 'Medium Positive'
        } else if (emotion_level > 0.5 && emotion_level < 0.75) {
          return 'Highly Positive'
        } else {
          return 'Extremely Positive'
        }
      } else {
        return 'Neutral'
      }
    }
  },
  watch: {
    sessionId: function(value) {
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
      getSessionById(this.sessionId).then((response) => {
        this.data = response.message
        this.pieChartData.valueEmo = this.data.info.emotions_duration
        setTimeout(() => {
          this.reportLoading = false
        }, 5 * 1000)
      })
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
