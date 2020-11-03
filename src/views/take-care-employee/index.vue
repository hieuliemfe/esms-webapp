<template>
  <div class="app-container">
    <div class="filter row">
      <filter-container />
    </div>
    <div class="takecare row">
      <warning-list id="please-scroll" class="col-3" />
      <div class="col-9">
        <report-emotion id="please-scroll" class="col-8" />
        <action-suggest id="please-scroll" class="col-4" />
      </div>
    </div>
  </div>
</template>
<script>
import FilterContainer from '@/components/Filter'
import ActionSuggest from './components/ActionToImproveList'
import WarningList from './components/WarningList'
import ReportEmotion from './components/ReportEmotion'
import waves from '@/directive/waves'
export default {
  name: 'TakeCareEmployee',
  components: { WarningList, ActionSuggest, ReportEmotion, FilterContainer },
  directives: { waves }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
</style>
