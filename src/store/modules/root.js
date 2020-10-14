import { login, getProfile, register } from '@/api/root'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { data } from 'autoprefixer'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_NAME: (state, fullname) => {
    state.fullname = fullname
  },
  SET_EMPLOYYEECODE: (state, employeeCode) => {
    state.employeeCode = employeeCode
  },
  SET_AVATAR: (state, avatarUrl) => {
    state.avatarUrl = avatarUrl
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { employeeCode, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ employeeCode: employeeCode, password: password }).then(response => {
        const data = response
        commit('SET_TOKEN', data.token)
        commit('SET_ROLES', [data.message.roleName])
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // post register
  register({ commit }) {
    const { fullname, roles } = data
    return new Promise((resolve, reject) => {
      register({ name: name, roles: roles }).then(response => {
        const { data } = response
        commit('NAME', fullname)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getProfile({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfile(state.token).then(response => {
        const data = response.message

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // const { roleName, fullname, avatarUrl, email } = data

        // roles must be a non-empty array
        if (!data.Role.roleName || data.Role.roleName.length <= 0) {
          reject('getProfile: roles must be a non-null array!')
        }
        commit('SET_NAME', data.fullname)
        commit('SET_ROLES', data.Role.roleName)
        commit('SET_AVATAR', data.avatarUrl)
        commit('SET_EMAIL', data.email)
        console.log('getProfile role ' + data.Role.roleName)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getProfile')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
