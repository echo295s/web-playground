<template>
  <v-app>
    <v-main>
      <v-container>
        <div v-if="isLoggedIn">
          <v-btn color="primary" @click="logout">ログアウト</v-btn>
          <Chat />
        </div>
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
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.isLoggedIn = false;
      this.isRegisterMode = false;
    },
  },
}
</script>

