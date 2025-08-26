import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      isLoggedIn: !!localStorage.getItem('token'),
      isRegisterMode: false,
    }
  },
  mutations: {
    setLoggedIn(state, value) {
      state.isLoggedIn = value
    },
    setRegisterMode(state, value) {
      state.isRegisterMode = value
    },
  },
})
