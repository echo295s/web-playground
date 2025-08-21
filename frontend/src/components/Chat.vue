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
        <img :src="userIcon" alt="user icon" class="user-icon" />
        <span class="content">{{ msg.content }}</span>
        <span class="date">({{ msg.created_at }})</span>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../axios.js'
import userIcon from '../assets/userIcon.svg'

export default {
  name: 'Chat',
  data() {
    return {
      userIcon,
      newMessage: '',
      messages: [],
      username: ''
    }
  },
  mounted() {
    this.username = localStorage.getItem('username') || '';
    this.fetchMessages();
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage) return;

      try {
        await api.post('/message', {
          content: this.newMessage
        });
        this.newMessage = '';
        await this.fetchMessages();
      } catch (error) {
        console.error('送信失敗', error);
      }
    },
    async fetchMessages() {
      try {
        const res = await api.get('/messages');
        this.messages = res.data.messages;
      } catch (error) {
        console.error('取得失敗', error);
      }
    }
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #1e1e1e;
  border: 1px solid #333;
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
  background-color: #2c2c2c;
  border: 1px solid #555;
  border-radius: 4px;
  color: #e0e0e0;
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
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
}
.message-list li .content {
  flex: 1;
}
.message-list li .date {
  color: #aaa;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
.user-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
}
</style>

