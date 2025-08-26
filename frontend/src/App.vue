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
          @login-success="handleLoginSuccess"
          @go-register="handleGoRegister"
        />
        <Register v-else @go-login="handleGoLogin" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'

  export default {
      components: {
        Chat,
        Login,
        Register,
      },
      computed: {
        isLoggedIn() {
          return this.$store.state.isLoggedIn
        },
        isRegisterMode() {
          return this.$store.state.isRegisterMode
        },
      },
      mounted() {
        window.addEventListener('logout', this.logout)
      },
      beforeUnmount() {
        window.removeEventListener('logout', this.logout)
      },
      methods: {
        handleLoginSuccess() {
          this.$store.commit('setLoggedIn', true);
        },
        handleGoRegister() {
          this.$store.commit('setRegisterMode', true);
        },
        handleGoLogin() {
          this.$store.commit('setRegisterMode', false);
        },
        logout() {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          this.$store.commit('setLoggedIn', false);
          this.$store.commit('setRegisterMode', false);
        },
      },
    }
</script>

