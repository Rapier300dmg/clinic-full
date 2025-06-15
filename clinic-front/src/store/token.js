import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || ''
  },
  mutations: {
    SET_AUTH(state, { token, role }) {
      state.token = token
      state.role = role
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
    },
    CLEAR_AUTH(state) {
      state.token = ''
      state.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    }
  },
  actions: {
    login({ commit }, authData) {
      commit('SET_AUTH', authData)
    },
    logout({ commit }) {
      commit('CLEAR_AUTH')
    }
  },
  getters: {
    isDoctor: state => state.role === 'doctor',
    isManager: state => state.role === 'manager',
    isPatient: state => state.role === 'patient'
  }
})
