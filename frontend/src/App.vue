<template>
  <v-app>
    <v-app-bar density="comfortable" elevate-on-scroll>
      <v-app-bar-title>Web Playground</v-app-bar-title>
      <v-spacer />
      <v-btn v-if="isLoggedIn" to="/routine" variant="text">ルーティン</v-btn>
      <v-btn v-if="isLoggedIn" variant="text" @click="handleLogout">ログアウト</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['isLoggedIn']),
  },
  mounted() {
    window.addEventListener('logout', this.handleLogout);
  },
  beforeUnmount() {
    window.removeEventListener('logout', this.handleLogout);
  },
  methods: {
    ...mapMutations(['logout']),
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.logout();
      this.$router.push('/login');
    },
  },
}
</script>
