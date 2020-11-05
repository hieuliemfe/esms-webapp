import { sendMail } from '@/api/email'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  employeeCode: '',
  type: '',
  date: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_EMPLOYYEECODE: (state, employeeCode) => {
    state.employeeCode = employeeCode
  },
  SET_TYPE: (state, type) => {
    state.type = type
  },
  SET_DATE: (state, date) => {
    state.date = date
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  }
}

const actions = {
  // user login
  sendMail({ commit }, data) {
    const { employeeCode, type, date } = data
    return new Promise((resolve, reject) => {
      sendMail({ employeeCode: employeeCode, type: type, date: date }).then(response => {
        const data = response.status
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
