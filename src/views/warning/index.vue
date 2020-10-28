<template>
  <div class="app-container">
    <div class="warningList">
      <warning-table />
    </div>
  </div>
</template>
<script>
import WarningTable from './components/WarningTable'

export default {
  name: 'Warning',
  components: { WarningTable }
}
</script>
