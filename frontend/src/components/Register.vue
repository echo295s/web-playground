<template>
  <v-card class="mx-auto my-12" max-width="400">
    <v-card-title>ユーザー登録</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="register">
        <v-text-field v-model="username" label="ユーザー名" />
        <v-text-field v-model="password" label="パスワード" type="password" />
        <v-btn type="submit" color="primary" class="mt-4">登録</v-btn>
      </v-form>
      <v-alert v-if="message" type="success" class="mt-4">{{ message }}</v-alert>
      <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
      <v-btn variant="text" class="mt-2" @click="$emit('go-login')">
        ログインへ戻る
      </v-btn>
    </v-card-text>
  </v-card>
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
      this.error = '';
      this.message = '';
      try {
        await axios.post(`${apiURL}/auth/register`, {
          username: this.username,
          password: this.password
        });
        this.message = '登録が完了しました';
      } catch (err) {
        this.error = err.response?.data?.error || '登録に失敗しました';
      }
    }
  }
}
</script>


