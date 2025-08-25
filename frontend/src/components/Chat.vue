<template>
  <v-card class="mx-auto my-8" max-width="600">
    <v-card-title>ようこそ「{{ username }}」さん</v-card-title>
    <v-card-text>
      <div class="d-flex gap-2 mb-1">
        <v-text-field
          name="newMessage"
          v-model="newMessage"
          placeholder="メッセージを入力"
          autocomplete="off"
          hide-details
          density="compact"
          class="flex-grow-1 pr-2"
        />
        <v-btn color="primary" @click="sendMessage">送信</v-btn>
      </div>
      <v-list>
        <v-list-item
          v-for="msg in messages"
          :key="msg.id"
        >
          <template #prepend>
            <v-avatar size="24" class="user-icon">
              <img :src="userIcon" alt="user icon" />
            </v-avatar>
          </template>
          <v-list-item-title>{{ msg.content }}</v-list-item-title>
          <v-list-item-subtitle>({{ msg.created_at }})</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
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
.user-icon {
  background-color: gray;
}
</style>