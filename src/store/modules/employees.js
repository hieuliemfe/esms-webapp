import { getWarningList } from '@/api/employees'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  id: '',
  empCode: '',
  email: '',
  fullname: '',
  phoneNumber: '',
  roleId: 3,
  avatarUrl: '',
  filterValue: {},
  reportList: [],
  reportIndex: 0
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_EMPLOYYEECODE: (state, employeeCode) => {
    state.empCode = employeeCode
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
  SET_ROLES: (state, roleId) => {
    state.roleId = roleId
  },
  SET_AVATAR: (state, avatarUrl) => {
    state.avatarUrl = avatarUrl
  },
  SET_FILTERVALUE: (state, filterValue) => {
    state.filterValue = { ...state.filterValue, ...filterValue }
  },
  SET_REPORT: (state, reportList) => {
    state.reportList = { ...state.reportList, ...reportList }
  },
  SET_REPORT_INDEX: (state, reportIndex) => {
    state.reportIndex = reportIndex
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
          filteredData = data.filter(e => e.roleId === 3)
        }
        resolve(filteredData)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setFilterValue({ commit }, filterValue) {
    commit('SET_FILTERVALUE', filterValue)
  },
  setReportList({ commit }, reportList) {
    commit('SET_REPORT', reportList)
  },
  setReportIndex({ commit }, reportIndex) {
    commit('SET_REPORT_INDEX', reportIndex)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
