<template>
  <v-card class="mx-auto my-12" max-width="400">
    <v-card-title>ログイン</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="login">
        <v-text-field v-model="username" label="ユーザー名" />
        <v-text-field v-model="password" label="パスワード" type="password" />
        <v-btn type="submit" color="primary" class="mt-4">ログイン</v-btn>
      </v-form>
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      <v-btn variant="text" class="mt-2" @click="$emit('go-register')">
        新規登録はこちら
      </v-btn>
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
      try {
        const res = await axios.post(`${apiURL}/auth/login`, {
          username: this.username,
          password: this.password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', this.username)
        this.$emit('login-success')
      } catch (err) {
        this.error = err.response?.data?.error || 'ログインに失敗しました'
      }
    }
  }
}
</script>

