<template>
  <div class="filter-container">
    <!-- Title -->
    <el-input
      v-model="listQuery.fullname"
      placeholder="Employee Name"
      clearable
      class="filter-item"
      style="width: 250px"
      @keyup.enter.native="handleFilter"
    />
    <drag-select />
    <!-- Select date -->
    <el-date-picker
      v-model="listQuery.date"
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
      multiple
      filterable
      allow-create
      type="primary"
      class="filter-item"
      default-first-option
      style="width: 200px"
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
      class="filter-item"
      style="width: 200px"
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
export default {
  name: 'FilterContainer',
  directives: { waves },
  data() {
    return {
      shiftOptions: [1, 2, 3],
      statusOptions: ['Negative', 'Neutral', 'Positive', 'Poker Face'],
      listQuery: {
        date: undefined,
        fullname: undefined,
        employeeCode: undefined,
        shift: undefined,
        status: 'Negative'
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
  created() {},
  mounted() {},
  methods: {
    handleFilter() {
      this.$store.dispatch('employees/setFilterValue', {
        startDate: this.listQuery.date[0].toJSON(),
        endDate: this.listQuery.date[1].toJSON(),
        fullname: this.listQuery.fullname,
        status: this.listQuery.status
      })
    }
  }
}
</script>
