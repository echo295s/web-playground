import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      isLoggedIn: !!localStorage.getItem('token'),
      username: localStorage.getItem('username') || '',
    }
  },
  mutations: {
    login(state, username) {
      state.isLoggedIn = true;
      state.username = username;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.username = '';
    },
  },
})
