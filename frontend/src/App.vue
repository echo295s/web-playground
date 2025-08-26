<template>
  <v-app>
    <v-app-bar density="comfortable" elevate-on-scroll>
      <v-app-bar-title>Web Playground</v-app-bar-title>
      <v-spacer />
      <v-btn v-if="isLoggedIn" variant="text" @click="logout">ログアウト</v-btn>
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
    window.addEventListener('logout', this.logout);
  },
  beforeUnmount() {
    window.removeEventListener('logout', this.logout);
  },
  methods: {
    ...mapMutations(['setLoggedIn']),
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.setLoggedIn(false);
      this.$router.push('/');
    },
  },
}
</script>
