<template>
  <div class="register-container">
    <h2>ユーザー登録</h2>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="ユーザー名" />
      <input v-model="password" type="password" placeholder="パスワード" />
      <button type="submit">登録</button>
    </form>
    <p class="link" @click="$emit('go-login')">ログインへ戻る</p>
    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import { apiURL } from '../config.js'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      message: '',
      error: ''
    }
  },
  methods: {
    async register() {
      this.error = ''
      this.message = ''
      try {
        await axios.post(`${apiURL}/auth/register`, {
          username: this.username,
          password: this.password
        })
        this.message = '登録が完了しました'
      } catch (err) {
        this.error = err.response?.data?.error || '登録に失敗しました'
      }
    }
  }
}
</script>

<style scoped>
.register-container {
  max-width: 300px;
  margin: 2rem auto;
  text-align: center;
}
.register-container input {
  display: block;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
}
.register-container button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  border: none;
  color: #fff;
  cursor: pointer;
}
.register-container .link {
  margin-top: 1rem;
  color: #42b983;
  cursor: pointer;
}
.message {
  color: #333;
  margin-top: 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>

