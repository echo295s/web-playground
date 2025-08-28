<template>
  <v-card class="mx-auto my-12" max-width="400">
    <v-card-title>プロフィール</v-card-title>
    <v-card-text>
      ログインユーザー名: {{ username }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...mapState(['username'])
  }
}
</script>
