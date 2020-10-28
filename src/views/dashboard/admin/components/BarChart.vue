<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '385px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ angryData, disgustedData, fearfulData, happyData, neutralData, sadData, suprisedData, noFaceDetectedData } = {}) {
      var emotions = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Suprised', 'No face']
      var stackDayInWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      var normalColors = ['#F94144', '#90BE6D', '#7400B8', '#F9C74F', '#B1A7A6', '#0077B6', '#3FC1C0', '#0F4C5C']
      var sequenceDatas = []
      sequenceDatas.push(angryData)
      sequenceDatas.push(disgustedData)
      sequenceDatas.push(fearfulData)
      sequenceDatas.push(happyData)
      sequenceDatas.push(neutralData)
      sequenceDatas.push(sadData)
      sequenceDatas.push(suprisedData)
      sequenceDatas.push(noFaceDetectedData)
      var serieDatas = []
      for (var i = 0; i < sequenceDatas.length; i++) {
        serieDatas.push({
          name: emotions[i],
          data: sequenceDatas[i],
          type: 'bar',
          stack: 'aaa',
          barWidth: '50%',
          animationDuration,
          itemStyle: {
            normal: {
              color: normalColors[i]
            }
          }
        })
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 20,
          left: '2%',
          right: '2%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: [{
          name: 'Employees',
          type: 'category',
          data: stackDayInWeek,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: true
          }
        }],
        legend: {
          data: emotions,
          left: 'center',
          bottom: '10'
        },
        series: serieDatas
      })
    }
  }
}
</script>
