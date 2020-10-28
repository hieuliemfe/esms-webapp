<template>
  <div class="app-container">
    <filter-container />
    <div class="session-container">
      <session-list />
      <session-report />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import FilterContainer from '@/components/Filter'
import SessionList from './components/SessionList'
import SessionReport from './components/SessionReport'
export default {
  name: 'SessionManager',
  components: { SessionList, SessionReport, FilterContainer },
  directives: { waves }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "node_modules/bootstrap/scss/bootstrap.scss";
@import "~@/styles/index.scss";
.session-container {
  width: 100%;
  height: 635px;
}
</style>
