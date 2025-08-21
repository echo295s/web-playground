<template>
  <Chat v-if="isLoggedIn" />
  <Login
    v-else-if="!isRegisterMode"
    @login-success="handleLoginSuccess"
    @go-register="handleGoRegister"
  />
  <Register v-else @go-login="handleGoLogin" />
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
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('token'),
      isRegisterMode: false,
    }
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;
    },
    handleGoRegister() {
      this.isRegisterMode = true;
    },
    handleGoLogin() {
      this.isRegisterMode = false;
    },
  },
}
</script>

