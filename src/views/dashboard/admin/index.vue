<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    angryData: [0, 50, 30, 100, 50, 0, 70, 100, 80, 100],
    disgustedData: [0, 0, 40, 60, 0, 20, 30, 10, 0, 30],
    fearfulData: [0, 20, 50, 10, 30, 0, 20, 10, 40, 30],
    happyData: [100, 100, 100, 70, 50, 80, 100, 95, 90, 100],
    neutralData: [100, 70, 40, 80, 80, 100, 50, 20, 30, 80],
    sadData: [0, 10, 10, 20, 10, 0, 10, 40, 30, 0],
    suprisedData: [0, 10, 30, 10, 0, 10, 5, 20, 5, 0],
    noFaceDetectedData: [10, 0, 0, 0, 100, 10, 0, 0, 20, 50]
  },
  messages: {
    angryData: [0, 50, 30, 100, 50, 0, 70, 100, 80, 100],
    disgustedData: [0, 0, 40, 6, 0, 20, 30, 10, 0, 30],
    fearfulData: [0, 20, 50, 10, 30, 0, 20, 10, 40, 30],
    happyData: [100, 100, 100, 70, 50, 80, 100, 95, 90, 100],
    neutralData: [100, 70, 40, 80, 80, 100, 50, 20, 30, 80],
    sadData: [0, 10, 10, 20, 10, 0, 10, 40, 30, 0],
    suprisedData: [0, 10, 30, 10, 0, 10, 5, 20, 5, 0],
    noFaceDetectedData: [10, 0, 0, 0, 100, 10, 0, 0, 20, 50]
  },
  purchases: {
    angryData: [0, 50, 30, 100, 50, 0, 70, 100, 80, 100],
    disgustedData: [0, 0, 40, 6, 0, 20, 30, 10, 0, 30],
    fearfulData: [0, 20, 50, 10, 30, 0, 20, 10, 40, 30],
    happyData: [100, 100, 100, 70, 50, 80, 100, 95, 90, 100],
    neutralData: [100, 70, 40, 80, 80, 100, 50, 20, 30, 80],
    sadData: [0, 10, 10, 20, 10, 0, 10, 40, 30, 0],
    suprisedData: [0, 10, 30, 10, 0, 10, 5, 20, 5, 0],
    noFaceDetectedData: [10, 0, 0, 0, 100, 10, 0, 0, 20, 50]
  },
  shoppings: {
    angryData: [0, 50, 30, 100, 50, 0, 70, 100, 80, 100],
    disgustedData: [0, 0, 40, 6, 0, 20, 30, 10, 0, 30],
    fearfulData: [0, 20, 50, 10, 30, 0, 20, 10, 40, 30],
    happyData: [100, 100, 100, 70, 50, 80, 100, 95, 90, 100],
    neutralData: [100, 70, 40, 80, 80, 100, 50, 20, 30, 80],
    sadData: [0, 10, 10, 20, 10, 0, 10, 40, 30, 0],
    suprisedData: [0, 10, 30, 10, 0, 10, 5, 20, 5, 0],
    noFaceDetectedData: [10, 0, 0, 0, 100, 10, 0, 0, 20, 50]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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
