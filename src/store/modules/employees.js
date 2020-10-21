import { getListEmployee } from '@/api/employees'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  id: '',
  employeeCode: '',
  email: '',
  fullname: '',
  phoneNumber: '',
  roleId: '',
  isDeleted: '',
  createdAt: '',
  avatarUrl: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_EMPLOYYEECODE: (state, employeeCode) => {
    state.employeeCode = employeeCode
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_NAME: (state, fullname) => {
    state.fullname = fullname
  },
  SET_PHONE: (state, phoneNumber) => {
    state.phoneNumber = phoneNumber
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ACTIVE: (state, isDeleted) => {
    state.isDeleted = isDeleted
  },
  SET_CREATE: (state, createdAt) => {
    state.createdAt = createdAt
  },
  SET_AVATAR: (state, avatarUrl) => {
    state.avatarUrl = avatarUrl
  }
}

const actions = {
  // get all employee
  getListEmployee({ commit, state }) {
    return new Promise((resolve, reject) => {
      getListEmployee(state.token).then(response => {
        const data = response.message

        if (!data) {
          reject('Do not have any employee to show to. Add new!')
        }

        commit('SET_ID', data.row.fullname)
        commit('SET_EMPLOYYEECODE', data.row.employeeCode)
        commit('SET_EMAIL', data.row.email)
        commit('SET_NAME', data.row.fullname)
        commit('SET_PHONE', data.row.phoneNumber)
        commit('SET_ROLES', data.row.roles)
        commit('SET_ACTIVE', data.row.isDeleted)
        commit('SET_CREATE', data.row.createdAt)
        commit('SET_AVATAR', data.row.avatarUrl)
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
