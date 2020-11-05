<template>
  <div class="action">
    <div
      v-loading="actionLoading"
      class="body-action"
      width="100%"
      highlight-current-message
    >
      <div v-if="data" class="cardAction">
        <el-form ref="mailForm" :model="mailForm" label-position="left">
          <div class="row">
            <span>{{ data.action }} </span>
          </div>
          <div class="row">
            <!-- <el-input v-model="mailForm.employeeCode" class="filter-item" placeholder="EmployeeCode" style="width: 100px;" /> -->
            <el-select v-model="mailForm.type" class="filter-item" placeholder="Mail Type" style="width: 150px;">
              <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
            </el-select>
            <el-date-picker
              v-if="mailForm.type==='appointment'"
              v-model="mailForm.datetime"
              type="datetime"
              placeholder="Select date and time"
              default-time="09:00:00"
            />
          </div>
          <div class="row">
            <el-button size="mini" round icon="el-icon-message" @click="sendMail()">Send mail</el-button>
          </div>
        </el-form>
      </div>
      <div v-else>
        <span> No data </span>
      </div>
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
      typeOptions: ['day_off', 'cheering', 'appointment'],
      mailForm: {
        employeeCode: undefined,
        type: undefined,
        datetime: undefined
      },
      actionLoading: true,
      data: undefined
    }
  },
  computed: {
    ...mapState('employees', ['reportList', 'reportIndex'])
  },
  watch: {
    reportList: function(value) {
      this.getActionList()
    },
    reportIndex: function(value) {
      this.getActionList()
    }
  },
  created() {
    this.getActionList()
  },
  mounted() {},
  methods: {
    getActionList() {
      this.actionLoading = false
      this.data = this.reportList[this.reportIndex]
      this.mailForm.employeeCode = this.reportList[this.reportIndex].employeeCode
      // console.log('this.mailForm.employeeCode', this.mailForm.employeeCode)
    },
    sendMail() {
      this.$refs.mailForm.validate(valid => {
        this.loading = true
        this.$store.dispatch('email/sendMail', this.mailForm)
          .then(() => {
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
