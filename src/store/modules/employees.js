import { getWarningList } from '@/api/employees'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  id: '',
  employeeCode: '',
  email: '',
  fullname: '',
  phoneNumber: '',
  roleId: '',
  performanceStatus: '',
  avatarUrl: '',
  filterValue: {}
}

const getters = {
  filterValue() {
    return state.filterValue
  }
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
  SET_AVATAR: (state, avatarUrl) => {
    state.avatarUrl = avatarUrl
  },
  SET_FILTERVALUE: (state, filterValue) => {
    // state.filterValue = {startDate: 'abc', endDate: 'xya'}
    // filterValue = {startDate: 'mnp', fullname: 'QWERT'}
    // => new => state.filterValue = {startDate: 'mnp', endDate: 'xya', fullname: 'QWERT'}
    state.filterValue = { ...state.filterValue, ...filterValue }
  },
  SET_STATUS: (state, performanceStatus) => {
    state.performanceStatus = performanceStatus
  }
}

const actions = {
  // get all employee
  getWarningList({ state }, filterValue) {
    return new Promise((resolve, reject) => {
      getWarningList(state.token, filterValue).then(response => {
        const data = response.message
        let filteredData
        if (data && data.length > 0) {
          filteredData = data.filter(e => e.performanceStatus === 'Warning')
        }
        resolve(filteredData)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setFilterValue({ commit }, filterValue) {
    commit('SET_FILTERVALUE', filterValue)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
