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
      default: '400px'
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
      var emotions = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Suprised', 'No face']
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
        title: {
          text: 'REAL TIME EMOTION STATISTIC',
          subtext: 'OCTOBER 24TH 2020',
          left: 'center',
          align: 'right'
        },
        xAxis: {
          data: ['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00', '09:10', '09:20', '09:30', '09:40', '09:50', '10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00', '11:10', '11:20', '11:30', '11:40', '11:50', '12:00', '12:10', '12:20', '12:30', '12:40', '12:50', '13:00', '13:10', '13:20', '13:30', '13:40', '13:50', '14:00', '14:10', '14:20', '14:30', '14:40', '14:50', '15:00', '15:10', '15:20', '15:30', '15:40', '15:50', '16:00', '16:10', '16:20', '16:30', '16:40', '16:50', '17:00'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 100,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        dataZoom: [{
          type: 'inside',
          start: 25,
          end: 45
        }, {
          start: 0,
          end: 30,
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          }
        }],
        yAxis: {
          name: 'Employee',
          axisTick: {
            show: false
          }
        },
        legend: {
          data: emotions,
          top: 60
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
