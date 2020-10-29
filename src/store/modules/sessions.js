import { getSessionList } from '@/api/sessions'
import { getToken } from '@/utils/auth'
const state = {
  token: getToken(),
  idsession: '',
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
  },
  id() {
    return state.id
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID_SESSION: (state, id) => {
    state.id = { ...state.filterValue, ...id }
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
  getSessionList({ state }, filterValue) {
    return new Promise((resolve, reject) => {
      getSessionList(state.token, filterValue).then(response => {
        const data = response.message
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setFilterValue({ commit }, filterValue) {
    commit('SET_FILTERVALUE', filterValue)
  },
  setIdSession({ commit }, id) {
    console.log('sessions id', id)
    commit('SET_ID_SESSION', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
