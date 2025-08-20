<template>
  <div class="chat-container">
    <h2>ようこそ「{{ username }}」さん</h2>
    <div class="message-input">
      <input
        name="newMessage"
        v-model="newMessage"
        placeholder="メッセージを入力"
      />
      <button @click="sendMessage">送信</button>
    </div>
    <ul class="message-list">
      <li v-for="msg in messages" :key="msg.id">
        {{ msg.content }}
        <span class="date">({{ msg.created_at }})</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { apiURL } from '../config.js'
import axios from 'axios'

export default {
  name: 'Chat',
  data() {
    return {
      apiURL,
      newMessage: '',
      messages: [],
      username: ''
    }
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

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.message-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.message-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.message-input button {
  padding: 0.5rem 1rem;
  background-color: #42b983;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.message-input button:hover {
  background-color: #369870;
}
.message-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.message-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
.message-list li .date {
  color: #888;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
</style>

