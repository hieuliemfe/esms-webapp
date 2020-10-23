<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- Title -->
      <el-select
        v-model="listQuery.fullname"
        placeholder="Employee Name"
        clearable
        class="filter-item"
        style="width: 250px"
        @keyup.enter.native="handleFilter"
      >
        <el-option
          v-for="item in employeeListOptions"
          :key="item"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <drag-select />
      <!-- Select date -->
      <el-date-picker
        v-model="listQuery.date"
        class="filter-item"
        type="date"
        format="yyyy-MM-dd"
        placeholder="Select date"
        :picker-options="pickerOptions1"
      />
      <!-- Shift -->
      <el-select
        v-if="listQuery.date"
        v-model="listQuery.shift"
        multiple
        filterable
        allow-create
        class="filter-item"
        default-first-option
        style="width: 200px"
        placeholder="Shift"
      >
        <el-option
          v-for="item in shiftOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <!-- status -->
      <el-select
        v-model="listQuery.status"
        placeholder="Status"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item"
          :label="'Status: ' + item"
          :value="item"
        />
      </el-select>
      <!-- button -->
      <el-button
        v-waves
        class="filter-item"
        type="info"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
    </div>
    <div class="session-container">
      <div class="listSession">
        <div class="sortList">
          <el-dropdown trigger="click">
            <el-button
              type="info"
              size="mini"
              class="el-dropdown-link"
              style="border-radius: 5px"
            >
              <span
                style="color: #000000 !important"
              >Sort by<i
                class="el-icon-arrow-down el-icon--right"
              /></span>
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
                  <span>Negative</span>
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
              <i class="el-icon-error negative" />
            </div>
            <div class="statusSession">
              <span>Negative</span>
            </div>
          </div>
          <div class="reportName">
            <span>[201024-003] Mr.Hoang </span>
          </div>
          <div class="reportName">
            <el-tooltip
              class="item"
              effect="dark"
              content="Watch Video"
              placement="bottom"
            >
              <el-button
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
                type="info"
                size="mini"
                icon="el-icon-timer"
                style="float: left; border-radius: 5px"
              >8m40s
              </el-button>
            </el-tooltip>
          </div>
          <div class="task">
            <span>TASK IN SESSION</span>
          </div>
        </div>
        <div class="empInfo border-left">
          <div class="info">
            <img class="avatar" :src="avatarUrl">
          </div>
          <div class="info">
            <i class="el-icon-star-on" style="width: 24px; height:24px; color: gold;" />
            <i class="el-icon-star-on" style="width: 24px; height:24px; color: gold;" />
          </div>
          <div class="info">
            <span><b>Bank Teller</b></span>
          </div>
          <div class="info">
            <span>Nguyen Hieu Liem</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getListEmployee } from '@/api/employees'
import waves from '@/directive/waves'
import DragSelect from '@/components/DragSelect'
import Pagination from '@/components/Pagination'
export default {
  name: 'EmployeeTable',
  components: { DragSelect, Pagination },
  directives: { waves },
  data() {
    return {
      avatarUrl:
        'https://scontent.fvca1-1.fna.fbcdn.net/v/t1.0-9/104392339_961672564285741_3242929677651781360_o.jpg?_nc_cat=102&ccb=2&_nc_sid=09cbfe&_nc_ohc=u4VFPL3M_1QAX8nCC98&_nc_ht=scontent.fvca1-1.fna&oh=2df6761417eeab471389f3dee72b8e90&oe=5FB951DC',
      show: false,
      shiftOptions: [1, 2, 3],
      statusOptions: ['All', 'Negative', 'Neutral', 'Positive', 'Poker Face'],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        fullname: undefined,
        employeeCode: undefined,
        shift: undefined
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }
        ]
      },
      datePicker: ''
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
      getListEmployee().then((response) => {
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

.session-container {
  width: 100%;
  height: 600px;
}
.el-button {
  color: black !important;
    font-size: 14px;
}
.listSession {
  float: left;
  width: 270px;
  height: 100%;
  background: #e6e8ea;
  border-radius: 5px;
  margin-right: 20px;
  box-shadow: 2px 2px 1px 1px #bbbec2;
  .sortList {
    border-radius: 5px;
    margin-top: 10px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    background: #e6e8ea;
  }
  .list {
    width: 90%;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    overflow-y: scroll;
    height: 80%;
    border-radius: 5px;
    background: white;
    .cardSession {
      padding: 10px;
      .el-row {
        margin: 5px 0px 5px 0px;

        .avatar {
          border: 1px solid black;
          float: right;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .nameSession {
          font-size: 16px;
          color: #0052cc;
          .span {
            max-lines: 2;
          }
        }
      }
    }
    .cardSession:hover {
      background: #deebff;
      .nameSession {
        color: black;
      }
      .statusSession {
        color: #0052cc;
      }
      .avatar {
        border: 2px solid whitesmoke;
      }
    }
  }
  .pages {
    width: 90%;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
  }
}
.reportSession {
  padding: 10px;
  border: 1px solid;
  border-radius: 5px;
  padding: 10px;
  width: auto;
  height: 100%;
  overflow-y: scroll;
  .empReport {
    padding: 0px 20px 0px 10px;
    float: left;
    height: 100%;
    width: 70%;
    // background: rgb(250, 239, 218);
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
    .task{
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
    .info{
        margin-top: 5px;
        font-size: 14px;
        text-align: center;
float: left;
width: 100%;
.avatar{
          width: 200px;
          display:block;
        margin-left: auto;
        margin-right: auto;
          height: 200px;
          border-radius: 50%;
    }
    i{
        font-size: 24px;
    }
    }
  }
}

.iconSession {
  font-size: 20px;
  height: 25px;
  float: left;
  .negative {
    color: red;
  }
  .positive {
    color: green;
  }
  .poker {
    color: #e06f1f;
  }
}
.statusSession {
  margin-left: 3px;
  font-size: 14px;
  float: left;
  height: 25px;
  padding-top: 5px;
  font-weight: bold;
  color: #8993a4;
  text-transform: uppercase;
}

.filter-item {
  margin: 5px;
  border-radius: 5px;
}
</style>
