<template>
  <div
    v-loading="listLoading"
    class="list"
    height="800"
    width="100%"
    highlight-current-message
  >
    <div v-if="list">
      <div
        v-for="row in list"
        :key="row.id"
        class="cardSession"
        @click="getReport(row.id)"
      >
        <div class="row">
          <div class="nameSession">
            <span> Session {{ row.id }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col-9">
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
          </div>
          <div class="col-3">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.employeeFullname"
              placement="bottom"
            >
              <img class="avatar" :src="row.avatarUrl">
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="pages">
      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div> -->
  </div>
</template>
<script>
import { getSessionList } from '@/api/sessions'
import waves from '@/directive/waves'
// import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
  name: 'WarningList',
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
        // console.log('IDDDD', this.list[0].id)

        if (this.list[0]) {
          this.$store.dispatch('sessions/setIdSession', this.list[0].id)
        }
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
      this.$store.dispatch('sessions/setIdSession', id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
