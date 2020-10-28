<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'ESMS',
      logo: 'https://i.upanh.org/2020/10/26/logo1.png'
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 2s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 150px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    background: #0052cc;
    width: 100%;

    & .sidebar-logo {
      width: 90px;
      height: auto;
      vertical-align: middle;
      margin-right: auto;
      margin-left: auto;
      margin-top: 10px;
      margin-bottom: 0px;
    }

    & .sidebar-title {
      width: 100%;
      display: inline-block;
      margin: 0px 0px 10px 0px;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 25px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    height: 8%;
    width: 100%;
    background: #f4f5f7;

      .sidebar-logo {
        margin-right: 0px;
        width: 36px;
        height: 36px;
      }
  }
}
</style>
