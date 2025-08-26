import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      isLoggedIn: !!localStorage.getItem('token'),
    }
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
})
