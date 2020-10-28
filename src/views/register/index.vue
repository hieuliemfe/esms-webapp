<template>
  <div class="app-container">
    <div class="warningList">
      <employee-table />
    </div>
  </div>
</template>
<script>
import EmployeeTable from './components/EmployeeTable'

export default {
  name: 'Register',
  components: { EmployeeTable },
  data: function() {
    return {
    }
  },
  methods: {
  }
}
</script>
