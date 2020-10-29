<template>
  <div class="app-container">
    <filter-container />
    <h1 fixedClass="isFixed">Employees Warning List</h1>
    <!-- <div class="top3" :data="list" align="center">
      <div v-for="row in data.slice(0,2)" :key="row" class="top1">
        <img class="avatar" :src="row.avatarUrl" >
        <span class="link-fullname">{{ row.fullname }}</span>
        <span>{{ row.phoneNumber }}</span>
        <span>{{ row.email }}</span>
      </div>
    </div> -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      border
      :data="list"
      height="800"
      width="300"
      highlight-current-row
    >
      <!-- <el-table-column width="30">
        <template>
          <span>{{ index }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        width="100px"
        label="Photo"
        align="center"
      >
        <template slot-scope="{ row }">
          <img
            v-if="row.avatarUrl !== ''"
            class="avatar"
            :src="row.avatarUrl"
          >
        </template>
      </el-table-column>
      <el-table-column
        label="Full Name"
        align="left"
        min-width="200px"
        prop="fullname"
      >
        <template slot-scope="{ row }">
          <span class="link-fullname">{{
            row.fullname
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" min-width="100px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" align="center" min-width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="Actions"
        align="center"
        min-width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            size="mini"
            type="primary"
            @click="handleActivate(row, false)"
          >
            View Session
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getWarningList } from '@/api/employees'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import FilterContainer from '@/components/Filter'
import { mapState } from 'vuex'

export default {
  name: 'WarningTable',
  components: { Pagination, FilterContainer },
  directives: { waves },
  data() {
    const defaultForm = {
      fullname: '',
      phoneNumber: '123',
      avatarUrl: '',
      roleId: '3'
    }
    return {
      tableKey: 0,
      count: 0,
      warningForm: Object.assign({}, defaultForm),
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapState('employees', ['filterValue'])
  },
  watch: {
    filterValue: function(value) {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      this.listLoading = false
      getWarningList(this.filterValue).then(response => {
        this.list = response.message
        this.total = this.list.length
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
h1{
width:100%; font-weight: bold; color:red; text-align:center;
}
.top3{
  width: 100%;
  align-items: center;
  height: 250px;
  background: #754275;
   .avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
}
</style>
