<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
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
      var emotions = ['angry', 'disgusted', 'fearful', 'happy', 'neutral', 'sad', 'suprised', 'no face']
      var normalColors = ['#FF005A', '#33cc33', '#9933ff', '#ffcc00', '#996600', '#0099ff', '#33cccc', '#000000']
      var lineStyleColors = ['#FF005A', '#33cc33', '#9933ff', '#ffcc00', '#996600', '#0099ff', '#33cccc', '#000000']
      var areaStyleColors = ['#ffe6ee', '#ebfaeb', '#f2e6ff', '#fffae6', '#ffeecc', '#e6f5ff', '#ebfafa', '#f2f2f2']
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
      for (var i = 0; i < emotions.length; i++) {
        serieDatas.push({
          name: emotions[i],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: normalColors[i],
              lineStyle: {
                color: lineStyleColors[i],
                width: 2
              },
              areaStyle: {
                color: areaStyleColors[i]
              }
            }
          },
          data: sequenceDatas[i],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        })
      }
      this.chart.setOption({
        xAxis: {
          data: ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: emotions
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['stack', 'tiled'] }
          }
        },
        series: serieDatas
      })
    }
  }
}
</script>
