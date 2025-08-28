<template>
  <v-card class="mx-auto my-12" max-width="400">
    <v-card-title>ログイン</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field
          class="mb-6"
          v-model="username"
          placeholder="ユーザー名"
          density="compact"
          hide-details
          autocomplete="username"
        />
        <v-text-field
          class="mb-6"
          v-model="password"
          placeholder="パスワード"
          density="compact"
          hide-details
          type="password"
          autocomplete="current-password"
        />
        <div class="d-flex justify-space-between">
          <v-btn variant="text" color="primary" @click="goRegister">
            新規登録
          </v-btn>
          <v-btn type="submit" color="primary">
            ログイン
          </v-btn>
        </div>
      </v-form>
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios'
import { apiURL } from '../config.js'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      this.error = ''
      if (!this.username || !this.password) {
        this.error = 'ユーザー名とパスワードを入力してください'
        return
      }
      try {
        const res = await axios.post(`${apiURL}/auth/login`, {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', this.username)
        this.$store.commit('login', this.username)
        this.$router.push('/apps')
      } catch (err) {
        this.error = err.response?.data?.error || 'ログインに失敗しました'
      }
    },
    goRegister() {
      this.$router.push('/register')
    }
  }
}
</script>
