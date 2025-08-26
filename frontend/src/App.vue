<template>
  <v-app>
    <v-app-bar density="comfortable" elevate-on-scroll>
      <v-app-bar-title>Web Playground</v-app-bar-title>
      <v-spacer />
      <v-btn v-if="isLoggedIn" variant="text" @click="logout">ログアウト</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Chat v-if="isLoggedIn" />
        <Login
          v-else-if="!isRegisterMode"
          @login-success="this.setLoggedIn(true)"
          @go-register="this.setRegisterMode(true)"
        />
        <Register v-else @go-login="this.setRegisterMode(false)" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    Chat,
    Login,
    Register,
  },
  computed: {
    ...mapState(['isLoggedIn', 'isRegisterMode']),
  },
  mounted() {
    window.addEventListener('logout', this.logout);
  },
  beforeUnmount() {
    window.removeEventListener('logout', this.logout);
  },
  methods: {
    ...mapMutations(['setLoggedIn', 'setRegisterMode']),
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.setLoggedIn(false);
      this.setRegisterMode(false);
    },
  },
}
</script>
