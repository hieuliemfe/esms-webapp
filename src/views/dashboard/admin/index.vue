<template>
  <div class="dashboard-editor-container">

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <el-select v-model="periodPie" placeholder="Choose" clearable @change="chooseData($event)">
            <el-option v-for="item in periodPieOptions" :key="item" :label="item.label" :value="item" />
          </el-select>
          <pie-chart :chart-data="pieChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart :chart-data="barChartDataMonth" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart :chart-data="barChartDataWeek" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
var angryData = []
var disgustedData = []
var happyData = []
var neutralData = []
var suprisedData = []
var fearfulData = []
var sadData = []
var noFaceDetectedData = []
var MAX_EMPLOYEE = 100
for (var i = 0; i < 56; i++) {
  happyData.push(getRndInteger(0, MAX_EMPLOYEE))
  neutralData.push(getRndInteger(0, MAX_EMPLOYEE - happyData[i]))
  angryData.push(getRndInteger(0, MAX_EMPLOYEE - happyData[i] - neutralData[i]))
  disgustedData.push(getRndInteger(0, MAX_EMPLOYEE - angryData[i] - happyData[i] - neutralData[i]))
  sadData.push(getRndInteger(0, MAX_EMPLOYEE - disgustedData[i] - angryData[i] - happyData[i] - neutralData[i]))
  fearfulData.push(getRndInteger(0, MAX_EMPLOYEE - sadData[i] - disgustedData[i] - angryData[i] - happyData[i] - neutralData[i]))
  suprisedData.push(getRndInteger(0, MAX_EMPLOYEE - fearfulData[i] - sadData[i] - disgustedData[i] - angryData[i] - happyData[i] - neutralData[i]))
  noFaceDetectedData.push(MAX_EMPLOYEE - suprisedData[i] - fearfulData[i] - sadData[i] - disgustedData[i] - angryData[i] - happyData[i] - neutralData[i])
}
const lineChartData = {
  angryData: angryData,
  disgustedData: disgustedData,
  fearfulData: fearfulData,
  happyData: happyData,
  neutralData: neutralData,
  sadData: sadData,
  suprisedData: suprisedData,
  noFaceDetectedData: noFaceDetectedData
}
const barChartDataMonth = {
  angryData: [0, 5, 30, 10, 5],
  disgustedData: [0, 0, 40, 30, 0],
  fearfulData: [0, 20, 50, 10, 30],
  happyData: [50, 50, 50, 30, 50],
  neutralData: [50, 10, 40, 30, 30],
  sadData: [0, 10, 10, 20, 10],
  suprisedData: [0, 10, 30, 10, 0],
  noFaceDetectedData: [10, 0, 0, 0, 50]
}
const barChartDataWeek = {
  angryData: [0, 5, 30, 10, 5],
  disgustedData: [0, 0, 40, 30, 0],
  fearfulData: [0, 20, 50, 10, 30],
  happyData: [50, 50, 50, 30, 50],
  neutralData: [50, 10, 40, 30, 30],
  sadData: [0, 10, 10, 20, 10],
  suprisedData: [0, 10, 30, 10, 0],
  noFaceDetectedData: [10, 0, 0, 0, 50]
}
const pieChartData0 = {
  valueEmo: [10, 1, 5, 40, 20, 4, 6, 10]
}
const pieChartData1 = {
  valueEmo: [20, 30, 50, 10, 4, 8, 30, 10]
}
const pieChartData2 = {
  valueEmo: [50, 10, 55, 40, 20, 40, 36, 10]
}
export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData,
      barChartDataMonth: barChartDataMonth,
      barChartDataWeek: barChartDataWeek,
      pieChartData: pieChartData0,
      periodPie: 'Yesterday',
      periodPieOptions: [
        {
          label: 'Yesterday',
          value: pieChartData0
        },
        {
          label: 'This week',
          value: pieChartData2
        },
        {
          label: 'Last Week',
          value: pieChartData1
        }
      ]
    }
  },
  methods: {
    chooseData(event) {
      this.pieChartData = event.value
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
