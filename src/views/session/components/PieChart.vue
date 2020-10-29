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
    setOptions({ valueEmo } = {}) {
      var emotions = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Suprised', 'No face']
      var normalColors = ['#F94144', '#90BE6D', '#7400B8', '#F9C74F', '#B1A7A6', '#0077B6', '#3FC1C0', '#0F4C5C']
      var value = []
      value.push(valueEmo)

      var serieDatas = []
      for (var i = 0; i < emotions.length; i++) {
        serieDatas.push({
          name: emotions[i],
          value: valueEmo[i],
          itemStyle: {
            normal: {
              color: normalColors[i]
            }
          }
        })
      }
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Neutral', 'Sad', 'Suprised', 'No face']
        },
        series: [
          {
            name: 'Emotion',
            type: 'pie',
            radius: [15, 95],
            // left: '50%',
            bottom: 20,
            top: 20,
            data: serieDatas,
            animationEasing: 'cubicInOut',
            animationDuration: 3000
          }
        ]
      })
    }
  }
}
</script>
