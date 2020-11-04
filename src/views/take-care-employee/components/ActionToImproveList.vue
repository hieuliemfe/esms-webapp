<template>
  <div class="action">
    <div
      id="please-scroll-action"
      v-loading="actionLoading"
      class="body-action"
      width="100%"
      highlight-current-message
    >
      <!-- <div v-if="action">
        <div
          v-for="row in action"
          :key="row"
          class="cardEmployee"
          @click="getReport(row)"
        >
          <div class="row">
            <div class="col-3">
              <img class="avatar center" :src="row.avatarUrl">
            </div>
            <div class="col-9">
              <div class="row"> -->
      <!-- <span><b>#{{ index + 1 }}</b></span> -->
      <!-- </div>
              <div class="row">
                <span>{{ row.fullname }} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <span> No data </span>
      </div> -->
    </div>
  </div>
</template>
<script>
import waves from '@/directive/waves'
import { mapState } from 'vuex'
export default {
  name: 'ActionSuggest',
  directives: { waves },
  data() {
    return {
      actionLoading: true,
      action: undefined
    }
  },
  computed: {
    ...mapState('employees', ['report'])
  },
  watch: {
    report: function(value) {
      this.getReport()
    }
  },
  created() {
    this.getReport()
  },
  mounted() {},
  methods: {
    getReport() {
      this.actionLoading = false
      this.action = this.report
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
