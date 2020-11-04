<template>
  <div class="filter-container">
    <!-- Title -->
    <el-autocomplete
      v-model="listQuery.fullname"
      placeholder="Employee Name"
      clearable
      class="filter-item"
      style="width: 30vh"
    />
    <!-- :fetch-suggestions="querySearch"
      @select="handleSelect" -->
    <!-- Select date -->
    <el-date-picker
      v-model="listQuery.date"
      style="width: 30vh"
      type="daterange"
      class="filter-item"
      align="center"
      unlink-panels
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
      :picker-options="pickerOptions"
      :default-time="['00:00:00', '23:59:59']"
    />
    <!-- Shift -->
    <el-select
      v-if="listQuery.date"
      v-model="listQuery.shift"
      style="width: 25vh"
      multiple
      filterable
      allow-create
      type="primary"
      class="filter-item"
      default-first-option
      placeholder="Shift"
    >
      <el-option
        v-for="item in shiftOptions"
        :key="item"
        type="primary"
        :label="item"
        :value="item"
      />
    </el-select>
    <!-- status -->
    <el-select
      v-model="listQuery.status"
      placeholder="Status"
      clearable
      style="width: 15vh"
      class="filter-item"
    >
      <el-option
        v-for="item in statusOptions"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <!-- button -->
    <el-button
      v-waves
      class="filter-item"
      style="width: 15vh"
      type="primary"
      icon="el-icon-search"
      @click="handleFilter"
    >
      Search
    </el-button>
  </div>
</template>
<script>
import waves from '@/directive/waves'
// import { getWarningList } from '@/api/employees'
export default {
  name: 'FilterContainer',
  directives: { waves },
  data() {
    const current = new Date()
    return {
      shiftOptions: [1, 2, 3],
      statusOptions: ['Negative', 'Neutral', 'Positive', 'Poker Face'],
      listQuery: {
        fullname: undefined,
        employeeCode: undefined,
        employeeInfo: [],
        date: [new Date(new Date(current.toJSON().split('T')[0] + 'T00:00:00+07:00').getTime()),
          new Date(new Date(current.toJSON().split('T')[0] + 'T23:59:59+07:00').getTime())],
        shift: undefined,
        status: undefined
      },
      pickerOptions: {
        disabledDate(time) {
          const current = new Date()
          const night = new Date(
            current.toJSON().split('T')[0] + 'T23:59:59+07:00'
          )
          return time.getTime() > night
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
  methods: {
    handleFilter() {
      this.$store.dispatch('employees/setFilterValue', {
        startDate: this.listQuery.date[0].toJSON(),
        endDate: this.listQuery.date && this.listQuery.date[1].toJSON(),
        fullname: this.listQuery.fullname,
        status: this.listQuery.status
      })
      this.$store.dispatch('sessions/setFilterValue', {
        startDate: this.listQuery.date && this.listQuery.date[0].toJSON(),
        endDate: this.listQuery.date && this.listQuery.date[1].toJSON(),
        fullname: this.listQuery.fullname,
        status: this.listQuery.status
      })
    }
    // querySearch(queryString, cb) {
    //   var employeeInfo = this.employeeInfo
    //   var results = queryString ? employeeInfo.filter(this.createFilter(queryString)) : employeeInfo
    //   // call callback function to return suggestions
    //   cb(results)
    // },
    // createFilter(queryString) {
    //   return (link) => {
    //     return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    // getWarningList() {
    //   getWarningList(this.filterValue).then((response) => {
    //     this.list = response.message

    //     if (this.list[0]) {
    //       this.$store.dispatch('sessions/setIdSession', this.list[0].id)
    //     }
    //     this.employeeInfo = response
    //   })
    // },
    // handleSelect(item) {
    //   console.log(item)
    // }
  }
}
</script>
