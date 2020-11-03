<template>
  <div class="app-container">
    <div class="filter row">
      <filter-container />
    </div>
    <div class="takecare row">
      <div class="col-3 no-padding">
        <div class="header-list">
          <h3>Warning List</h3>
        </div>
        <warning-list id="please-scroll" />
      </div>
      <div class="col-9 no-padding">
        <div class="col-8 no-padding">
          <div class="header-report">
            <h3>Report</h3>
          </div>
          <report-emotion id="please-scroll" />
        </div>
        <div class="col-4 no-padding">
          <div class="header-action">
            <h3>Action Suggest</h3>
          </div>
          <action-suggest id="please-scroll" />
        </div>
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
