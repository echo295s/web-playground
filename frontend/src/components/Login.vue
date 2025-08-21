<template>
  <div class="login-container">
    <h2>ログイン</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="ユーザー名" />
      <input v-model="password" type="password" placeholder="パスワード" />
      <button type="submit">ログイン</button>
    </form>
    <p class="link" @click="$emit('go-register')">新規登録はこちら</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
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

<style scoped>
.login-container {
  max-width: 300px;
  margin: 2rem auto;
  text-align: center;
}
.login-container input {
  display: block;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #2c2c2c;
  border: 1px solid #555;
  color: #e0e0e0;
}
.login-container button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  border: none;
  color: #fff;
  cursor: pointer;
}
.login-container .link {
  margin-top: 1rem;
  color: #42b983;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>

