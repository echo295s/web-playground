<template>
  <v-app>
    <v-app-bar density="comfortable" elevate-on-scroll>
      <v-app-bar-title class="web-playground-title">
        <span class="cursor-pointer" @click="goApps">Web Playground</span>
      </v-app-bar-title>
      <v-spacer />
      <v-btn
        v-if="isLoggedIn"
        variant="text"
        class="mr-2"
        @click="goProfile"
      >ようこそ「{{ username }}」さん</v-btn>
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
    ...mapState(['isLoggedIn', 'username']),
  },
  mounted() {
    window.addEventListener('logout', this.handleLogout);
  },
  beforeUnmount() {
    window.removeEventListener('logout', this.handleLogout);
  },
  methods: {
    ...mapMutations(['logout']),
    goApps() {
      this.$router.push('/apps');
    },
    goProfile() {
      this.$router.push('/profile');
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.logout();
      this.$router.push('/login');
    },
  },
}
</script>

<style>
.web-playground-title {
  flex: none;
  user-select: none;
}
</style>
