import { getRoles } from '@/api/roles'
import { getToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
// import { data } from 'autoprefixer'

const state = {
  token: getToken(),
  name: '',
  avatarUrl: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLEID: (state, id) => {
    state.id = id
  },
  SET_ROLENAME: (state, roleName) => {
    state.roleName = roleName
  }
}

const actions = {
  // get user info
  getRoles({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRoles(state.token).then(response => {
        const data = response.message
        commit('SET_ROLEID', [data.id])
        commit('SET_ROLENAME', [data.roleName])
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
