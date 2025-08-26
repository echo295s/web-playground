import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      isLoggedIn: !!localStorage.getItem('token'),
    }
  },
  mutations: {
    setLoggedIn(state, value) {
      state.isLoggedIn = value
    },
  },
})
