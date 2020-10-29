<template>
  <div class="listSession">
    <div class="sortList">
      <el-dropdown trigger="click">
        <el-button
          type="info"
          size="mini"
          class="el-dropdown-link filter-list"
          style="border-radius: 5px"
        >
          <span>Sort by<i
            class="el-icon-armessage-down el-icon--right"
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
          class="filter-list"
          type="info"
          size="mini"
          icon="el-icon-refresh"
          style="float: right; border-radius: 5px"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Sort" placement="bottom">
        <el-button
          class="filter-list"
          type="info"
          size="mini"
          icon="el-icon-sort"
          style="float: right; margin-right: 2px; border-radius: 5px"
        />
      </el-tooltip>
    </div>
    <div
      v-loading="listLoading"
      class="list border-right border-left"
      height="800"
      width="100%"
      highlight-current-message
    >
      <div v-if="list">
        <div
          v-for="row in list"
          :key="row.id"
          class="cardSession border-bottom"
          @click="getReport(row.id)"
        >
          <el-row :span="24">
            <div class="nameSession">
              <span> Session {{ row.id }}</span>
            </div>
          </el-row>
          <el-row :span="24">
            <el-col :span="18">
              <div v-if="row.status==='Negative'" class="iconSession">
                <i class="el-icon-error negative" />
              </div>
              <div v-if="row.status==='Positive'" class="iconSession">
                <i class="el-icon-success positive" />
              </div>
              <div v-if="row.status==='Neutral'" class="iconSession">
                <i class="el-icon-minus neutral" />
              </div>
              <div v-if="row.status==='Pocker Face'" class="iconSession">
                <i class="el-icon-s-tools poker" />
              </div>
              <div class="statusSession">
                <span>{{ row.status }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.employeeFullname"
                placement="bottom"
              >
                <img class="avatar" :src="row.avatarUrl">
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="pages">
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import { getSessionList } from '@/api/sessions'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
  name: 'SessionList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      avatarUrl: '',
      show: false,
      list: null,
      total: 1,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapState('sessions', ['filterValue'])
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
      getSessionList(this.filterValue).then(response => {
        this.list = response.message
        this.total = this.list.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getReport(id) {
      console.log('id', id)
      this.$store.dispatch('sessions/', id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
