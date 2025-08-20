<template>
  <Login v-if="!isLoggedIn" />
  <Chat v-else />
</template>

<script setup>
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'

const isLoggedIn = true
</script>

