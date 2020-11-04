import { getCriterias, addCriterias, updateCriterias, deteleCriterias } from '@/api/negative-emotion'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  id: '',
  condition: '',
  operator: '',
  comparingNumber: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_CONDITION: (state, condition) => {
    state.condition = condition
  },
  SET_OPERATOR: (state, operator) => {
    state.operator = operator
  },
  SET_COMPARING: (state, comparingNumber) => {
    state.comparingNumber = comparingNumber
  }
}

const actions = {
  // get all employee
  getCriterias({ state }) {
    return new Promise((resolve, reject) => {
      getCriterias(state.token).then(response => {
        const data = response.message
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addCriterias({ state, commit }, newCriteria) {
    const { condition, operator, comparingNumber } = newCriteria
    return new Promise((resolve, reject) => {
      addCriterias(state.token, { condition: condition, operator: operator, comparingNumber: comparingNumber }).then(response => {
        const data = response.message
        commit('SET_CONDITION', data.condition)
        commit('SET_OPERATOR', data.operator)
        commit('SET_COMPARING', data.comparingNumber)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateCriterias({ commit, state }, id, newCriteria) {
    const { condition, operator, comparingNumber } = newCriteria
    return new Promise((resolve, reject) => {
      updateCriterias(state.token, id, { condition: condition, operator: operator, comparingNumber: comparingNumber }).then(response => {
        const data = response.message
        commit('SET_CONDITION', data.condition)
        commit('SET_OPERATOR', data.operator)
        commit('SET_COMPARING', data.comparingNumber)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  deteleCriterias({ state }, id) {
    return new Promise((resolve, reject) => {
      deteleCriterias(state.token, id).then(response => {
        const data = response.message
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
