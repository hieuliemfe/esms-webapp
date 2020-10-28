<template>
  <div class="app-container">
    <filter-container />
    <div class="session-container">
      <div class="listSession">
        <div class="sortList">
          <el-dropdown trigger="click">
            <el-button
              type="info"
              size="mini"
              class="el-dropdown-link filter-list"
              style="border-radius: 5px"
            >
              <span>Sort by<i class="el-icon-arrow-down el-icon--right" /></span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>ORDER SESSION BY</el-dropdown-item>
              <el-dropdown-item>Name</el-dropdown-item>
              <el-dropdown-item>Time</el-dropdown-item>
              <el-dropdown-item>Status</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tooltip
            class="item"
            effect="dark"
            content="Refresh"
            placement="bottom"
          >
            <el-button
              class="filter-list"
              type="info"
              size="mini"
              icon="el-icon-refresh"
              style="float: right; border-radius: 5px"
            />
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="Sort"
            placement="bottom"
          >
            <el-button
              class="filter-list"
              type="info"
              size="mini"
              icon="el-icon-sort"
              style="float: right; margin-right: 2px; border-radius: 5px"
            />
          </el-tooltip>
        </div>
        <div class="list border-right border-left">
          <!-- card 1 -->
          <div class="cardSession border-bottom">
            <el-row :span="24">
              <div class="nameSession"><span>[201024-03] Mr. Hoang</span></div>
            </el-row>
            <el-row :span="24">
              <el-col :span="18">
                <div class="iconSession">
                  <i class="el-icon-error negative" />
                </div>
                <div class="statusSession">
                  <span>Positive</span>
                </div>
              </el-col>
              <el-col :span="6">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Nguyen Hieu Liem"
                  placement="bottom"
                >
                  <img class="avatar" :src="avatarUrl">
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <!-- card 2 -->
          <div class="cardSession border-bottom">
            <el-row :span="24">
              <div class="nameSession"><span>[201024-002] Mr. Hoa</span></div>
            </el-row>
            <el-row :span="24">
              <el-col :span="18">
                <div class="iconSession">
                  <i class="el-icon-success positive" />
                </div>
                <div class="statusSession">
                  <span>Positive</span>
                </div>
              </el-col>
              <el-col :span="6">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Nguyen Hieu Liem"
                  placement="bottom"
                >
                  <img class="avatar" :src="avatarUrl">
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <!-- card 3 -->
          <div class="cardSession border-bottom">
            <el-row :span="24">
              <div class="nameSession"><span>[201024-004] Ms. Duong</span></div>
            </el-row>
            <el-row :span="24">
              <el-col :span="18">
                <div class="iconSession">
                  <i class="el-icon-minus neutral" />
                </div>
                <div class="statusSession">
                  <span>Neutral</span>
                </div>
              </el-col>
              <el-col :span="6">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Nguyen Hieu Liem"
                  placement="bottom"
                >
                  <img class="avatar" :src="avatarUrl">
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
          <!-- card4 -->
          <div class="cardSession border-bottom">
            <el-row :span="24">
              <div class="nameSession"><span>[201024-001] Mr. Khanh</span></div>
            </el-row>
            <el-row :span="24">
              <el-col :span="18">
                <div class="iconSession">
                  <i class="el-icon-s-tools poker" />
                </div>
                <div class="statusSession">
                  <span>Pocker Face</span>
                </div>
              </el-col>
              <el-col :span="6">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Nguyen Hieu Liem"
                  placement="bottom"
                >
                  <img class="avatar" :src="avatarUrl">
                </el-tooltip>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="pages">
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </div>
      </div>
      <div class="reportSession">
        <div class="empReport">
          <div class="status">
            <div class="iconSession">
              <i class="el-icon-success positive" />
            </div>
            <div class="statusSession">
              <span>Positive</span>
            </div>
          </div>
          <div class="reportName">
            <span>[201024-003] Mr.Hoa </span>
          </div>
          <span style="font-size: 12px">2020-10-24 9:36:23 AM</span>
          <div class="reportName">
            <el-tooltip
              class="item"
              effect="dark"
              content="Watch Video"
              placement="bottom"
            >
              <el-button
                class="filter-list"
                type="info"
                size="mini"
                icon="el-icon-video-camera-solid"
                style="float: left; border-radius: 5px"
              >Video</el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Add attachment"
              placement="bottom"
            >
              <el-button
                class="filter-list"
                type="info"
                size="mini"
                icon="el-icon-paperclip"
                style="float: left; border-radius: 5px"
              >Attach
              </el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="Session Duration"
              placement="bottom"
            >
              <el-button
                class="filter-list"
                type="info"
                size="mini"
                icon="el-icon-timer"
                style="float: left; border-radius: 5px"
              >8m40s
              </el-button>
            </el-tooltip>
          </div>
          <!-- <div class="task">
            <span>TASK IN SESSION</span>
          </div> -->
          <div class="task">
            <div class="chart-wrapper">
              <pie-chart :chart-data="pieChartData" />
            </div>
          </div>
          <div class="task">
            <span>EMOTION STATICTIS</span>
          </div>
          <div class="info">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Emotions</th>
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Angry</td>
                  <td>8s</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Disgusted</td>
                  <td>2s</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Happy</td>
                  <td>6m</td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>Neutral</td>
                  <td>1m50s</td>
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>Cannot detected</td>
                  <td>40s</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="task">
            <span>WARNING STATICTIS</span>
          </div>
          <div class="info">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Warning</th>
                  <th scope="col">Times</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Angry</td>
                  <td>0</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Leaving the working space</td>
                  <td>1</td>
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
            <i
              class="el-icon-star-on"
              style="width: 24px; height: 24px; color: gold"
            />
            <i
              class="el-icon-star-on"
              style="width: 24px; height: 24px; color: gold"
            />
          </div>
          <div class="info">
            <span><b>Bank Teller</b></span>
          </div>
          <div class="info">
            <span>Nguyen Hieu Liem</span>
          </div>
          <div class="info">
            <table class="table">
              <tbody>
                <tr>
                  <td>Shift</td>
                  <td>1</td>
                </tr>
                <tr>
                  <td>Counter</td>
                  <td>8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="info">
            <span><b>SESSION RESULT</b></span>
          </div>
          <div class="info">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Negative</td>
                  <td>10s</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Neutral</td>
                  <td>1m50s</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Positive</td>
                  <td>6m40s</td>
                </tr>
                <tr>
                  <td>Overview</td>
                  <th colspan="2" style="color: green">POSITIVE</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from './components/PieChart'
import { getListEmployee } from '@/api/employees'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import FilterContainer from '@/components/Filter'
const pieChartData = {
  valueEmo: [8, 2, '-', 360, 110, '-', '-', 40]
}
export default {
  name: 'SessionManager',
  components: { PieChart, Pagination, FilterContainer },
  directives: { waves },
  data() {
    return {
      pieChartData: pieChartData,
      avatarUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t1.0-9/104392339_961672564285741_3242929677651781360_o.jpg?_nc_cat=102&ccb=2&_nc_sid=09cbfe&_nc_ohc=u4VFPL3M_1QAX8nCC98&_nc_ht=scontent.fvca1-1.fna&oh=2df6761417eeab471389f3dee72b8e90&oe=5FB951DC',
      show: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        date: undefined,
        page: 1,
        limit: 20,
        fullname: undefined,
        employeeCode: undefined,
        shift: undefined
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: 'Today',
            onClick(picker) {
              const current = new Date()
              const morning = new Date(
                current.toJSON().split('T')[0] + 'T00:00:00+07:00'
              )
              const night = new Date(
                current.toJSON().split('T')[0] + 'T23:59:59+07:00'
              )
              const end = new Date(night.getTime())
              const start = new Date(morning.getTime())
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Yesterday',
            onClick(picker) {
              const current = new Date()
              const morning = new Date(
                current.toJSON().split('T')[0] + 'T00:00:00+07:00'
              )
              const night = new Date(
                current.toJSON().split('T')[0] + 'T23:59:59+07:00'
              )
              const end = new Date(
                current.getTime() -
                  3600 * 1000 * 24 +
                  (night.getTime() - current.getTime())
              )
              const start = new Date(
                current.getTime() -
                  3600 * 1000 * 24 -
                  (current.getTime() - morning.getTime())
              )
              picker.$emit('pick', [start, end])
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last week',
            onClick(picker) {
              const current = new Date()
              const morning = new Date(
                current.toJSON().split('T')[0] + 'T00:00:00+07:00'
              )
              const night = new Date(
                current.toJSON().split('T')[0] + 'T23:59:59+07:00'
              )
              const end = new Date(night.getTime())
              const start = new Date(current.getTime())
              start.setTime(
                current.getTime() -
                  3600 * 1000 * 24 * 7 -
                  (current.getTime() - morning.getTime())
              )
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const current = new Date()
              const morning = new Date(
                current.toJSON().split('T')[0] + 'T00:00:00+07:00'
              )
              const night = new Date(
                current.toJSON().split('T')[0] + 'T23:59:59+07:00'
              )
              const end = new Date(night.getTime())
              const start = new Date(current.getTime())
              start.setTime(
                current.getTime() -
                  3600 * 1000 * 24 * 30 -
                  (current.getTime() - morning.getTime())
              )
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const current = new Date()
              const morning = new Date(
                current.toJSON().split('T')[0] + 'T00:00:00+07:00'
              )
              const night = new Date(
                current.toJSON().split('T')[0] + 'T23:59:59+07:00'
              )
              const end = new Date(night.getTime())
              const start = new Date(current.getTime())
              start.setTime(
                current.getTime() -
                  3600 * 1000 * 24 * 90 -
                  (current.getTime() - morning.getTime())
              )
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    console.log('registerForm', this.registerForm)
  },
  methods: {
    getList() {
      this.listLoading = false
      getListEmployee().then(response => {
        this.list = response.message
        this.total = this.list.length
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
.session-container {
  width: 100%;
  height: 635px;
}
.filter-list {
  color: #42526e !important;
  font-weight: bold;
  font-size: 14px;
}

.reportSession {
  padding: 10px;
  border-radius: 5px;
  padding: 10px;
  width: auto;
  height: 100%;
  overflow-y: scroll;
}
.empReport {
  padding: 0px 20px 0px 10px;
  float: left;
  height: 100%;
  width: 70%;
  .status {
    width: 100%;
    font-size: 20px;
    height: 25px;
    float: left;
  }
  .reportName {
    float: left;
    width: 100%;
    padding: 10px 0px 10px 0px;
    font-size: 24px;
    font-weight: bold;
  }
  .task {
    float: left;
    width: 100%;
    padding: 10px 0px 10px 0px;
    font-weight: bold;
    font-size: 14px;
  }
}
.empInfo {
  padding: 0px 10px 0px 20px;
  float: left;
  height: 100%;
  width: 30%;
  // background: rgb(247, 202, 202);
}
.info {
  margin-top: 5px;
  font-size: 14px;
  text-align: center;
  float: left;
  width: 100%;
  .avatar {
    width: 200px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    height: 200px;
    border-radius: 50%;
  }
  i {
    font-size: 24px;
  }
}
</style>
