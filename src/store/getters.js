const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.root.token,
  avatar: state => state.root.avatar,
  name: state => state.root.name,
  introduction: state => state.root.introduction,
  roles: state => state.root.roles,
  permission_routes: state => state.permission.routes,
  permission_add_routes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs
}
export default getters
