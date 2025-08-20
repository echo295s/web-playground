<template>
  <div v-if="!isLoggedIn">
    <h2>ログイン</h2>
  </div>
  <div v-else>
    <h2>ようこそ「{{ username }}」さん</h2>
    <input name="newMessage" v-model="newMessage" placeholder="メッセージを入力" />
    <button @click="sendMessage">送信</button>
    <ul>
      <li v-for="msg in messages" :key="msg.id">
        {{ msg.content }} ({{ msg.created_at }})
      </li>
    </ul>
  </div>
</template>

<script>
import { apiURL } from './config.js'
import axios from 'axios'

export default {
  data() {
    return {
      apiURL,
      newMessage: '',
      messages: [],
      username: ''
    }
  },
  computed: {
    isLoggedIn() {
      return true;
    },
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage) return
      try {
        await axios.post(`${this.apiURL}/message`, {
          content: this.newMessage
        })
        this.newMessage = ''
        await this.fetchMessages()
      } catch (error) {
        console.error('送信失敗', error)
      }
    },
    async fetchMessages() {
      try {
        const res = await axios.get(`${this.apiURL}/messages`)
        this.messages = res.data.messages
      } catch (error) {
        console.error('取得失敗', error)
      }
    }
  },
  mounted() {
    this.fetchMessages()
  }
}
</script>
