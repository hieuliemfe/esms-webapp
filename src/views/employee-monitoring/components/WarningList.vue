<template>
  <div class="list">
    <div
      v-loading="listLoading"
      class="body-list"
      width="100%"
      highlight-current-message
    >
      <div v-if="list">
        <div
          v-for="(row, index) in list"
          :key="index"
          class="cardEmployee"
          @click="getReportIndex(index)"
        >
          <div class="row">
            <div class="col-3">
              <img class="avatar center" :src="row.avatarUrl">
            </div>
            <div class="col-9">
              <div class="row">
                <span><b>#{{ index + 1 }}</b></span>
              </div>
              <div class="row">
                <span class="fullname">{{ row.fullname }} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <span> No data </span>
      </div>
    </div>
  </div>
</template>
<script>
import { getWarningList } from '@/api/employees'
import waves from '@/directive/waves'
import { mapState } from 'vuex'
export default {
  name: 'WarningList',
  directives: { waves },
  data() {
    return {
      avatarUrl: '',
      show: false,
      list: null,
      listLoading: true
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
  mounted() {},
  methods: {
    getList() {
      this.listLoading = false
      getWarningList(this.filterValue)
        .then(() => this.$store.dispatch('employees/getWarningList', this.filterValue))
        .then((filteredList) => {
          this.list = filteredList
          if (this.list) {
            this.$store.dispatch('employees/setReportList', this.list)
          }
          setTimeout(() => {
            this.listLoading = false
          }, 2 * 1000)
        })
    },
    getReportIndex(index) {
      this.$store.dispatch('employees/setReportIndex', index)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
