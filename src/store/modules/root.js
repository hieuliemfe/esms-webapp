import { login, getProfile } from '@/api/root'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  fullname: '',
  avatarUrl: '',
  employeeCode: '',
  roles: [],
  password: '',
  email: ''
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
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // post register
  // register({ commit }, dataRegister) {
  //   const { fullname, phoneNumber, avatarUrl, roleId } = dataRegister
  //   return new Promise((resolve, reject) => {
  //     register({ fullname: fullname, phoneNumber: phoneNumber, avatarUrl: avatarUrl, roleId: roleId }).then(response => {
  //       const data = response.message
  //       commit('SET_EMPLOYYEECODE', data.employeeCode)
  //       commit('SET_PASSWORD', data.password)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // get user info
  getProfile({ commit, state }) {
    return new Promise((resolve, reject) => {
      getProfile(state.token).then(response => {
        const data = response.message

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // roles must be a non-empty array
        if (!data.Role.roleName || data.Role.roleName.length <= 0) {
          reject('getProfile: roles must be a non-null array!')
        }
        commit('SET_NAME', data.fullname)
        commit('SET_ROLES', [data.Role.roleName])
        commit('SET_AVATAR', data.avatarUrl)
        commit('SET_EMAIL', data.email)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
