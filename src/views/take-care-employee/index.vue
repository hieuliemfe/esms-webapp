<template>
  <div class="app-container">
    <div class="filter row">
      <filter-container />
    </div>
    <div class="takecare row">
      <warning-list id="please-scroll" class="col col-2" />
      <div class="col-10">
        <report-emotion id="please-scroll" class="col col-9" />
        <warning-list id="please-scroll" class="col col-3" />
      </div>
    </div>
  </div>
</template>
<script>
import FilterContainer from '@/components/Filter'

import WarningList from './components/WarningList'
import ReportEmotion from './components/ReportEmotion'
import waves from '@/directive/waves'
export default {
  name: 'TakeCareEmployee',
  components: { WarningList, ReportEmotion, FilterContainer },
  directives: { waves }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
