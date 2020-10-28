import { getSessionList } from '@/api/sessions'
import { getToken } from '@/utils/auth'
const state = {
  token: getToken(),
  id: '',
  employeeId: '',
  createdAt: '',
  avatarUrl: '',
  employeeFullname: '',
  status: '',
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
  SET_EMPLOYYEECODE: (state, employeeId) => {
    state.employeeId = employeeId
  },
  SET_EMPLOYEENAME: (state, employeeFullname) => {
    state.employeeFullname = employeeFullname
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
  },
  SET_CREATED: (state, createdAt) => {
    state.createdAt = createdAt
  }
}

const actions = {
  // get all employee
  getSessionList({ commit, state }, filterValue) {
    return new Promise((resolve, reject) => {
      getSessionList(state.token, filterValue).then(response => {
        const data = response.message
        let filteredData
        if (data && data.length > 0) {
          // filteredData = data.filter(e => e.performanceStatus === 'Warning')
        }
        resolve(filteredData)
        // resolve(data)
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
