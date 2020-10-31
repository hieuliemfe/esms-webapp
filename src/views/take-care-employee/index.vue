<template>
  <div class="app-container">
    <warning-list class="col-3" />
  </div>
</template>
<script>
import WarningList from './components/WarningList'
import waves from '@/directive/waves'
export default {
  name: 'TakeCareEmployee',
  components: { WarningList },
  directives: { waves }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
