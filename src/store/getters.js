const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.root.token,
  avatarUrl: state => state.root.avatarUrl,
  fullname: state => state.root.fullname,
  introduction: state => state.root.introduction,
  roles: state => state.root.roles,
  permission_routes: state => state.permission.routes,
  permission_add_routes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs,
  email: state => state.root.email,
  profile: state => state.root.profile
}
export default getters
